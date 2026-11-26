type QuickRepliesProps = {
  replies: string[]
  onPick: (reply: string) => void
}

// Réponses rapides proposées sous une bulle de l'assistant.
export default function QuickReplies({ replies, onPick }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 self-start">
      {replies.map((reply) => (
        <button
          key={reply}
          type="button"
          onClick={() => onPick(reply)}
          className="cursor-pointer rounded-full border border-border bg-white px-3 py-1.5 text-[10px] leading-4 font-medium text-blue-text hover:bg-bubble"
        >
          {reply}
        </button>
      ))}
    </div>
  )
}
