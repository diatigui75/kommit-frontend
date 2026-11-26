import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ChatEntry } from '@/components/pages/Home/ChatMessage'
import { dailyContent } from '@/data/daily'
import { isApiError } from '@/logic/apiError/apiError'
import { isSendDisabled } from '@/logic/daily/composer/composer'
import { addUserMessage, startConversation } from '@/logic/daily/conversation/conversation'
import { isConversationUnfinished } from '@/logic/daily/quitConfirmation/quitConfirmation'
import { standupBodyFor } from '@/logic/daily/standupBody/standupBody'
import { streamErrorDisplayFor, type StreamErrorDisplay } from '@/logic/daily/streamError/streamError'
import { applySseEvent, emptyStreamTurn, isAwaitingFirstToken, type StreamTurn } from '@/logic/daily/streamTurn/streamTurn'
import { shouldConfirmReplacement } from '@/logic/daily/todayStatus/todayStatus'
import { isValidateDisabled } from '@/logic/daily/validateButton/validateButton'
import { postStandup, streamConversation } from '@/lib/api/standup'
import type { ApiError, GetTodayResponse, Message, StandupSummary } from '@/types/apiContract'

const outageError: ApiError = { code: 'INTERNAL_ERROR', message: dailyContent.outageMessage }

const toMessages = (entries: ChatEntry[]): Message[] => entries.map(({ role, content }) => ({ role, content }))

// Saisie, conversation SSE, validation et popups quitter / remplacer (KOM-19).
export function useDailyConversation(todayStatus: GetTodayResponse | undefined) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isQuitOpen, setIsQuitOpen] = useState(false)
  const [isReplaceOpen, setIsReplaceOpen] = useState(false)
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [currentTurn, setCurrentTurn] = useState<StreamTurn | null>(null)
  const [streamError, setStreamError] = useState<StreamErrorDisplay | null>(null)
  const [lastSummary, setLastSummary] = useState<StandupSummary | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const nextId = useRef(0)
  const streamAbort = useRef<AbortController | null>(null)

  const isStreaming = currentTurn !== null
  const newId = () => `entry-${nextId.current++}`

  // Coupe le flux en cours : un tour abandonné n'écrit plus rien dans l'état de la conversation suivante.
  function abortStream() {
    streamAbort.current?.abort()
    streamAbort.current = null
    setCurrentTurn(null)
  }

  useEffect(() => () => streamAbort.current?.abort(), [])

  async function runTurn(messages: Message[]) {
    streamAbort.current?.abort()
    const controller = new AbortController()
    streamAbort.current = controller
    let turn = emptyStreamTurn
    setStreamError(null)
    setCurrentTurn(turn)
    try {
      await streamConversation(
        messages,
        (event) => {
          if (controller.signal.aborted) return
          turn = applySseEvent(turn, event)
          if (event.type === 'summary') setLastSummary(event.summary)
          setCurrentTurn(turn)
        },
        controller.signal,
      )
    } catch (error) {
      turn = { ...turn, error: isApiError(error) ? error : outageError }
    }
    if (controller.signal.aborted) return
    streamAbort.current = null
    const finishedTurn = turn
    // Une réponse coupée par une erreur n'entre pas dans le fil : « Réessayer » renvoie l'historique sans elle.
    if (!finishedTurn.error && (finishedTurn.reply !== '' || finishedTurn.summary)) {
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
    abortStream()
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
    abortStream()
    setIsQuitOpen(false)
    setIsChatOpen(false)
  }

  const streamingEntry: ChatEntry | null =
    currentTurn && currentTurn.reply !== ''
      ? { id: 'streaming', role: 'assistant', content: currentTurn.reply, summary: currentTurn.summary ?? undefined }
      : null

  return {
    entry: {
      value: draft,
      onChange: setDraft,
      isLaunchDisabled: isSendDisabled({ text: draft, isStreaming: false }),
      onLaunch: launch,
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
  }
}
