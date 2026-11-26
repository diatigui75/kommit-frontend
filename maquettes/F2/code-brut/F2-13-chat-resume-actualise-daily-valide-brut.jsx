import { HomePage, Overlay, ChatWindow, QuitDialog, ConversationUntilSummary, UserMessage, AssistantMessage, AssistantText, QuickReplies, SummaryBlock, SUMMARY_UPDATED, VALIDATE_OPTIONS } from "./F2-kit-brut";
const TYPED = "J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV.";

// État 13 : résumé actualisé puis daily validé.
export default function Screen() {
  return (
    <HomePage text={TYPED}>
      <Overlay>
        <ChatWindow>
          <ConversationUntilSummary />
          <QuickReplies options={VALIDATE_OPTIONS} />
          <UserMessage>Non, j'aimerais ajouter une info.</UserMessage>
          <AssistantMessage>
            <AssistantText>Que souhaites-tu ajouter ?</AssistantText>
          </AssistantMessage>
          <UserMessage>Je vais aussi updater le favico avec le nouveau logo.</UserMessage>
          <AssistantMessage>
            <AssistantText>C'est noté, voici le résumé actualisé :</AssistantText>
            <SummaryBlock summary={SUMMARY_UPDATED} />
          </AssistantMessage>
          <QuickReplies options={VALIDATE_OPTIONS} />
          <UserMessage>Oui, je valide le daily</UserMessage>
          <AssistantMessage>
            <AssistantText>Daily validé, il est ajouté à ton calendrier avec succès.</AssistantText>
          </AssistantMessage>
        </ChatWindow>
      </Overlay>
    </HomePage>
  );
}
