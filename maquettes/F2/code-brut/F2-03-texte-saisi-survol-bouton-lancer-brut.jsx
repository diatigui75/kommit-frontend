import { HomePage, Overlay, ChatWindow, QuitDialog, ConversationUntilSummary, UserMessage, AssistantMessage, AssistantText, QuickReplies, SummaryBlock, SUMMARY_UPDATED, VALIDATE_OPTIONS } from "./F2-kit-brut";
const TYPED = "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV.";

// État 03 : survol de « Lancer le daily » (curseur main = annotation).
export default function Screen() {
  return (
    <HomePage text={TYPED} buttonState="Hover" />
  );
}
