import { HomePage, Overlay, ChatWindow, QuitDialog, ConversationUntilSummary, UserMessage, AssistantMessage, AssistantText, QuickReplies, SummaryBlock, SUMMARY_UPDATED, VALIDATE_OPTIONS } from "./F2-kit-brut";
const TYPED = "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV.";

// État 05 : chat ouvert, conversation jusqu'au résumé (le bas est coupé par le défilement).
export default function Screen() {
  return (
    <HomePage text={TYPED}>
      <Overlay>
        <ChatWindow>
          <ConversationUntilSummary />
        </ChatWindow>
      </Overlay>
    </HomePage>
  );
}
