import { HomePage, Overlay, ChatWindow, QuitDialog, ConversationUntilSummary, UserMessage, AssistantMessage, AssistantText, QuickReplies, SummaryBlock, SUMMARY_UPDATED, VALIDATE_OPTIONS } from "./F2-kit-brut";
const TYPED = "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV.";

// État 12 : variante de l'état 11, seul le texte du champ change.
export default function Screen() {
  return (
    <HomePage text={TYPED}>
      <Overlay>
        <ChatWindow input="Je vais aussi updater le nouveau logo du Designer reçu hier.">
          <ConversationUntilSummary />
          <QuickReplies options={VALIDATE_OPTIONS} />
          <UserMessage>Non, j'aimerais ajouter une info.</UserMessage>
          <AssistantMessage>
            <AssistantText>Que souhaites-tu ajouter ?</AssistantText>
          </AssistantMessage>
        </ChatWindow>
      </Overlay>
    </HomePage>
  );
}
