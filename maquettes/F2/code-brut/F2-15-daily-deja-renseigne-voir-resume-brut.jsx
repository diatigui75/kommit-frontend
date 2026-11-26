import { HomePage, Overlay, ChatWindow, QuitDialog, ConversationUntilSummary, UserMessage, AssistantMessage, AssistantText, QuickReplies, SummaryBlock, SUMMARY_UPDATED, VALIDATE_OPTIONS } from "./F2-kit-brut";
const TYPED = "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV.";

// État 15 : résumé d'un daily passé, sans champ de saisie.
export default function Screen() {
  return (
    <HomePage alreadyFilled>
      <Overlay>
        <ChatWindow status="En date du mercredi 15 mai 2026" showInput={false}>
          <AssistantMessage>
            <AssistantText>Voici le résumé du daily du mercredi 15 mai 2026</AssistantText>
            <SummaryBlock summary={SUMMARY_UPDATED} />
          </AssistantMessage>
        </ChatWindow>
      </Overlay>
    </HomePage>
  );
}
