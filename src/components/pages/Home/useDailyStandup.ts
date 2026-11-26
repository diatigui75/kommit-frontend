import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ChatEntry } from '@/components/pages/Home/ChatMessage'
import { dailyContent } from '@/data/daily'
import { isApiError } from '@/logic/auth/error/error'
import { calendarQueryFor } from '@/logic/daily/calendarQuery/calendarQuery'
import { calendarStateFor } from '@/logic/daily/calendarState/calendarState'
import { isSendDisabled } from '@/logic/daily/composer/composer'
import { addUserMessage, startConversation } from '@/logic/daily/conversation/conversation'
import { isConversationUnfinished } from '@/logic/daily/quitConfirmation/quitConfirmation'
import { standupBodyFor } from '@/logic/daily/standupBody/standupBody'
import { streamErrorDisplayFor, type StreamErrorDisplay } from '@/logic/daily/streamError/streamError'
import { applySseEvent, emptyStreamTurn, isAwaitingFirstToken, type StreamTurn } from '@/logic/daily/streamTurn/streamTurn'
import { summaryDialogStateFor } from '@/logic/daily/summaryDialog/summaryDialog'
import { todayInParis } from '@/logic/daily/today/today'
import { dailyHeadingFor, shouldConfirmReplacement } from '@/logic/daily/todayStatus/todayStatus'
import { isValidateDisabled } from '@/logic/daily/validateButton/validateButton'
import {
  calendarQueryKey,
  fetchCalendar,
  fetchStandup,
  fetchToday,
  postStandup,
  standupQueryKey,
  streamConversation,
  todayQueryKey,
} from '@/lib/api/standup'
import type { ApiError, GetTodayResponse, Jour, Message, StandupSummary } from '@/types/apiContract'

const outageError: ApiError = { code: 'INTERNAL_ERROR', message: dailyContent.outageMessage }

const toMessages = (entries: ChatEntry[]): Message[] => entries.map(({ role, content }) => ({ role, content }))

// État du daily de l'accueil connecté : jour, calendrier, conversation SSE, validation, modales (KOM-19, KOM-22).
export function useDailyStandup(firstName: string | undefined) {
  const queryClient = useQueryClient()
  const isConnected = firstName !== undefined
  const today = todayInParis(new Date())
  const calendarQuery = calendarQueryFor(today)

  const todayQuery = useQuery({ queryKey: todayQueryKey, queryFn: fetchToday, enabled: isConnected, retry: false })
  const calendar = useQuery({
    queryKey: calendarQueryKey(calendarQuery),
    queryFn: () => fetchCalendar(calendarQuery),
    enabled: isConnected,
    retry: false,
  })

  // Si l'état du jour est illisible, on propose la saisie plutôt qu'un loader sans fin.
  const todayStatus: GetTodayResponse | undefined = todayQuery.isError ? { done: false, standup: null } : todayQuery.data

  const [draft, setDraft] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isQuitOpen, setIsQuitOpen] = useState(false)
  const [isReplaceOpen, setIsReplaceOpen] = useState(false)
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [currentTurn, setCurrentTurn] = useState<StreamTurn | null>(null)
  const [streamError, setStreamError] = useState<StreamErrorDisplay | null>(null)
  const [lastSummary, setLastSummary] = useState<StandupSummary | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [selectedJour, setSelectedJour] = useState<Jour | null>(null)
  const nextId = useRef(0)

  const isStreaming = currentTurn !== null
  const newId = () => `entry-${nextId.current++}`

  async function runTurn(messages: Message[]) {
    let turn = emptyStreamTurn
    setStreamError(null)
    setCurrentTurn(turn)
    try {
      await streamConversation(messages, (event) => {
        turn = applySseEvent(turn, event)
        if (event.type === 'summary') setLastSummary(event.summary)
        setCurrentTurn(turn)
      })
    } catch (error) {
      turn = { ...turn, error: isApiError(error) ? error : outageError }
    }
    const finishedTurn = turn
    if (finishedTurn.reply !== '' || finishedTurn.summary) {
      setEntries((previous) => [
        ...previous,
        { id: newId(), role: 'assistant', content: finishedTurn.reply, summary: finishedTurn.summary ?? undefined },
      ])
    }
    if (finishedTurn.error) setStreamError(streamErrorDisplayFor(finishedTurn.error))
    setCurrentTurn(null)
  }

  // La conversation précédente n'est vidée qu'ici : la vider à la fermeture la ferait disparaître pendant l'animation.
  function startChat() {
    const messages = startConversation(draft)
    setEntries(messages.map((message) => ({ ...message, id: newId() })))
    setLastSummary(null)
    setIsSaved(false)
    setIsChatOpen(true)
    void runTurn(messages)
  }

  function launch() {
    if (todayStatus && shouldConfirmReplacement(todayStatus)) setIsReplaceOpen(true)
    else startChat()
  }

  function send(text: string) {
    const messages = addUserMessage(toMessages(entries), text)
    setEntries((previous) => [...previous, { id: newId(), role: 'user', content: text }])
    void runTurn(messages)
  }

  const saveMutation = useMutation({
    mutationFn: postStandup,
    onSuccess: () => {
      setIsSaved(true)
      setIsChatOpen(false)
      setDraft('')
      void queryClient.invalidateQueries({ queryKey: ['standups'] })
    },
    onError: (error) => toast.error(isApiError(error) ? error.message : dailyContent.outageMessage),
  })

  function closeChat() {
    if (isConversationUnfinished({ messages: toMessages(entries), isSaved })) setIsQuitOpen(true)
    else setIsChatOpen(false)
  }

  function quit() {
    setIsQuitOpen(false)
    setIsChatOpen(false)
  }

  const standupQuery = useQuery({
    queryKey: standupQueryKey(selectedJour ?? ''),
    queryFn: () => fetchStandup(selectedJour as Jour),
    enabled: selectedJour !== null,
    retry: false,
  })
  const pastDaily = summaryDialogStateFor({
    selectedJour,
    status: standupQuery.status,
    data: standupQuery.data,
    error: standupQuery.error,
  })

  // Standup disparu : pas de modale, le message du serveur et un calendrier rechargé (CA45).
  useEffect(() => {
    if (pastDaily.kind !== 'standupGone') return
    toast.error(pastDaily.message)
    setSelectedJour(null)
    void queryClient.invalidateQueries({ queryKey: ['standups'] })
  }, [pastDaily, queryClient])

  const streamingEntry: ChatEntry | null =
    currentTurn && currentTurn.reply !== ''
      ? { id: 'streaming', role: 'assistant', content: currentTurn.reply, summary: currentTurn.summary ?? undefined }
      : null

  return {
    heading: dailyHeadingFor(todayStatus, firstName ?? ''),
    isDailyFilled: todayStatus?.done ?? false,
    entry: {
      value: draft,
      onChange: setDraft,
      isLaunchDisabled: isSendDisabled({ text: draft, isStreaming: false }),
      onLaunch: launch,
    },
    calendar: {
      today,
      state: calendarStateFor({ status: calendar.status, data: calendar.data, error: calendar.error }),
      onOpenDay: setSelectedJour,
    },
    chat: {
      isOpen: isChatOpen,
      entries: streamingEntry ? [...entries, streamingEntry] : entries,
      isAwaitingReply: currentTurn !== null && isAwaitingFirstToken(currentTurn, isStreaming),
      isStreaming,
      error: streamError,
      onRetry: () => void runTurn(toMessages(entries)),
      isValidateDisabled: isValidateDisabled({ summary: lastSummary, isSaving: saveMutation.isPending }),
      onValidate: () => lastSummary && saveMutation.mutate(standupBodyFor(lastSummary)),
      onSend: send,
      onClose: closeChat,
    },
    quit: { isOpen: isQuitOpen, onContinue: () => setIsQuitOpen(false), onQuit: quit },
    replace: {
      isOpen: isReplaceOpen,
      onCancel: () => setIsReplaceOpen(false),
      onConfirm: () => {
        setIsReplaceOpen(false)
        startChat()
      },
    },
    pastDaily: { state: pastDaily, jour: selectedJour, onClose: () => setSelectedJour(null) },
  }
}

export type DailyStandup = ReturnType<typeof useDailyStandup>
