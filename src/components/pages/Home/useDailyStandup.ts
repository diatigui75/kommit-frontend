import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { saveStandup, streamConversation, todayStandupQueryKey, fetchTodayStandup } from '@/lib/api/standup'
import { authContent } from '@/data/auth'
import { isSendDisabled, isValidateDisabled } from '@/logic/standup/buttons/buttons'
import { calendarWeeksFor, parisWeekdayIndex } from '@/logic/standup/calendar/calendar'
import {
  addAssistantMessage,
  addUserMessage,
  conversationBodyFor,
  isConversationUnfinished,
} from '@/logic/standup/conversation/conversation'
import { standupErrorDisplayFor } from '@/logic/standup/error/error'
import { appendTokens, readSseChunk } from '@/logic/standup/sse/sse'
import { standupBodyFor } from '@/logic/standup/summary/summary'
import { hasTodayStandup, isTodaySquareFilled } from '@/logic/standup/today/today'
import type { ApiError, Message, StandupSummary } from '@/types/apiContract'

// Câble le daily de l'accueil connecté (KOM-19) : état du jour, conversation SSE, validation et confirmations.
export function useDailyStandup(isConnected: boolean) {
  const queryClient = useQueryClient()
  const todayQuery = useQuery({
    queryKey: todayStandupQueryKey,
    queryFn: fetchTodayStandup,
    enabled: isConnected,
    retry: false,
  })
  const today = todayQuery.data

  const [draft, setDraft] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [summary, setSummary] = useState<StandupSummary | null>(null)
  const [streamError, setStreamError] = useState<ApiError | null>(null)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [wasDoneBeforeOpening, setWasDoneBeforeOpening] = useState(false)
  const [isQuitConfirmOpen, setIsQuitConfirmOpen] = useState(false)
  const [isReplaceConfirmOpen, setIsReplaceConfirmOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  // Garde synchrone du re-clic sur Valider (CA27) : isPending n'est à jour qu'au rendu suivant.
  const isSavingRef = useRef(false)

  // Une ApiError du contrat garde son message ; un échec réseau prend le texte de panne de F1.
  const showError = (error: unknown) => {
    if (error !== null && typeof error === 'object' && 'code' in error) setStreamError(error as ApiError)
    else setNetworkError(authContent.outageMessage)
  }

  const runTurn = async (history: Message[]) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setIsStreaming(true)
    setStreamingText('')
    setSummary(null)
    setStreamError(null)
    setNetworkError(null)

    let rest = ''
    let reply = ''
    try {
      for await (const chunk of streamConversation(conversationBodyFor(history), controller.signal)) {
        const read = readSseChunk(rest, chunk)
        rest = read.rest
        reply = appendTokens(reply, read.events)
        setStreamingText(reply)
        for (const event of read.events) {
          if (event.type === 'summary') setSummary(event.summary)
          if (event.type === 'error') setStreamError(event.error)
        }
      }
      if (reply !== '') setMessages(addAssistantMessage(history, reply))
    } catch (error) {
      if (!controller.signal.aborted) showError(error)
    } finally {
      if (abortRef.current === controller) {
        setStreamingText('')
        setIsStreaming(false)
      }
    }
  }

  const resetChat = () => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsChatOpen(false)
    setIsQuitConfirmOpen(false)
    setMessages([])
    setStreamingText('')
    setIsStreaming(false)
    setSummary(null)
    setStreamError(null)
    setNetworkError(null)
  }

  const startConversation = (text: string) => {
    const history = addUserMessage([], text)
    setWasDoneBeforeOpening(today ? hasTodayStandup(today) : false)
    setIsSaved(false)
    setMessages(history)
    setDraft('')
    setIsReplaceConfirmOpen(false)
    setIsChatOpen(true)
    void runTurn(history)
  }

  const saveMutation = useMutation({
    mutationFn: saveStandup,
    onSuccess: async () => {
      setIsSaved(true)
      resetChat()
      await queryClient.invalidateQueries({ queryKey: todayStandupQueryKey })
      isSavingRef.current = false
    },
    onError: (error) => {
      isSavingRef.current = false
      showError(error)
    },
  })

  const isLaunchDisabled = isSendDisabled({ text: draft, isStreaming: false })
  const errorMessage = streamError ? standupErrorDisplayFor(streamError).message : networkError
  const isTodayFilled = isTodaySquareFilled({
    wasDoneBeforeOpening: isChatOpen ? wasDoneBeforeOpening : today ? hasTodayStandup(today) : false,
    isSavedDuringConversation: isSaved,
    isConversationOpen: isChatOpen,
  })

  return {
    today,
    // Un échec de lecture ne doit pas bloquer l'accueil sur son loader : on retombe sur l'état « à faire ».
    isTodayFailed: todayQuery.isError,
    draft,
    setDraft,
    isLaunchDisabled,
    calendarCount: isTodayFilled ? 1 : 0,
    calendarWeeks: calendarWeeksFor(parisWeekdayIndex(new Date()), isTodayFilled),
    launch: () => {
      if (isLaunchDisabled) return
      // Un standup existe déjà : l'alerte prévient qu'il sera remplacé une fois le nouveau validé (CA9).
      if (today && hasTodayStandup(today)) setIsReplaceConfirmOpen(true)
      else startConversation(draft)
    },
    chat: {
      open: isChatOpen,
      messages,
      streamingText,
      isStreaming,
      summary,
      errorMessage,
      isValidateDisabled: isValidateDisabled({ summary, isSaving: saveMutation.isPending, streamError }),
      onRequestClose: () => {
        if (isConversationUnfinished(messages, isSaved)) setIsQuitConfirmOpen(true)
        else resetChat()
      },
      onSend: (text: string) => {
        if (isSendDisabled({ text, isStreaming })) return
        const history = addUserMessage(messages, text)
        setMessages(history)
        void runTurn(history)
      },
      onValidate: () => {
        if (!summary || isSavingRef.current) return
        isSavingRef.current = true
        saveMutation.mutate(standupBodyFor(summary))
      },
      onRetry: () => void runTurn(messages),
    },
    quitConfirm: {
      open: isQuitConfirmOpen,
      onCancel: () => setIsQuitConfirmOpen(false),
      onConfirm: resetChat,
    },
    replaceConfirm: {
      open: isReplaceConfirmOpen,
      onCancel: () => setIsReplaceConfirmOpen(false),
      onConfirm: () => startConversation(draft),
    },
  }
}
