import { HomePage, Overlay, ChatWindow, QuitDialog, ConversationUntilSummary, UserMessage, AssistantMessage, AssistantText, QuickReplies, SummaryBlock, SUMMARY_UPDATED, VALIDATE_OPTIONS } from "./F2-kit-brut";
const TYPED = "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV.";

// État 06 : survol de la croix du chat.
export default function Screen() {
  return (
    <HomePage text={TYPED}>
      <Overlay>
        <ChatWindow closeState="Hover">
          <ConversationUntilSummary />
        </ChatWindow>
      </Overlay>
    </HomePage>
  );
}
