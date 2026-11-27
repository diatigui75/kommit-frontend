# Inventaire de test, KOM-19 « Renseigner son daily standup · frontend »

Doctrine appliquée : `docs/testing-strategy.md`. Codes d'erreur lus dans `src/types/apiContract.ts` (section F2).
Le ticket parle de critères d'acceptation (CA), pas de RM. Paquets 1 à 5 et leur ordre repris du ticket. Les CA groupés sur une même ligne dans le ticket restent groupés. Le ticket contient 22 CA (sur une numérotation qui va jusqu'à CA44) : les numéros absents ne sont pas dans ce ticket.
Les numéros de CA reprennent ceux des RM citées dans le contrat (ex. RM25, RM31, RM32). Les RM du contrat qui ne figurent pas dans le ticket (RM11, RM12, RM14, RM38, RM45, RM46 : calendrier et relecture d'un jour) ne sont pas ajoutées ici.
Les smokes qui passent par une vraie réponse du LLM sont non déterministes : leur transcription e2e relève de la suite `*.nondet.test.ts`.

Emplacement prévu de la logique pure, selon `files.md` et `code-naming.md` (le ticket écrit `logic/standup.ts`, `standupExistePour`, `conversationInachevee` : on garde le comportement, pas les noms) :
- `src/logic/standup/today/` : « standup existe pour aujourd'hui » (`hasTodayStandup`, à partir de `GetTodayResponse`) et état du titre (chargement, à faire, déjà fait).
- `src/logic/standup/conversation/` : « conversation inachevée » (`isConversationUnfinished`), corps de `PostConversationBody`.
- `src/logic/standup/sse/` : lecture du flux en `SseEvent`.
- `src/logic/standup/summary/` : sections affichées du récap et corps de `PostStandupBody`.
- `src/logic/standup/buttons/` : activation des boutons d'envoi et de validation.
- `src/logic/standup/error/` : `ApiError` reçue dans l'événement `error` → message et conséquences.

Ambiguïtés tranchées par l'inventaire (au plus près du ticket) :
- `conversationInachevee(messages)` : le ticket ne passe que les messages, mais sa définition exige aussi « standup pas encore enregistré ». La fonction prend donc 2 entrées : les messages et l'état enregistré. Comme le premier message part dès l'ouverture (CA2), elle vaut `true` dès que la modale est ouverte, jusqu'à l'enregistrement.
- CA39 : la règle « vide ou espaces → envoi désactivé » s'applique à la zone de l'accueil et au champ de message de la modale. Le backend refuse un message blanc dans les 2 cas (`VALIDATION_ERROR`, RM39 du contrat).
- CA2 : le premier message est envoyé tel que tapé, sans trim. Le ticket dit « ce texte comme premier message » et ne demande aucune normalisation.
- CA29, CA31, CA32 : le message affiché est le `message` de l'`ApiError`, comme l'arbitrage de KOM-07. « Distinct d'une erreur métier » se lit comme un classement en panne, pas comme un texte écrit par le front. `src/data/standup.ts` ne contient aucun texte d'erreur.
- Les boutons de réponse rapide et « Non, j'aimerais ajouter une info » de la maquette ne sont dans aucun CA (le ticket les renvoie aux trous) : non classés.

### 1. L'accueil et son titre conditionnel

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA1, CA8 | `GetTodayResponse.done` à `false` donne « Qu'as-tu fait de beau aujourd'hui, {prénom} ? », à `true` donne « Bravo, tu as renseigné ton standup du jour ! ». La zone de saisie reste présente dans les 2 cas | 🟠 | Le choix du titre à partir de `done` est à nous. La valeur réelle de `done` vient de `GET /standups/today`, et le serveur décide du jour en fuseau Europe/Paris : la RM peut échouer avec un choix correct. La présence de la zone de saisie est du rendu statique, non testé | Unitaire (choix du titre) + smoke manuel |
| CA42 | Tant que l'état du jour n'est pas connu, aucun des 2 titres n'est affiché, un loader le remplace | 🟠 | « État inconnu → ni titre à faire ni titre déjà fait » est une décision à nous. L'absence de bascule visible dépend du vrai temps de réponse (cold start de Render) et de l'état de chargement réel de TanStack Query | Unitaire (état chargement → pas de titre) + smoke manuel |

### 2. La conversation en streaming

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA2 | Le texte tapé sur l'accueil devient le premier message (`role: 'user'`) de la conversation, la modale s'ouvre et l'IA enchaîne. À chaque tour, tout l'historique est renvoyé | 🟠 | La construction de `PostConversationBody` (premier message, historique complet à chaque tour, contrainte « serveur sans état ») est à nous. L'ouverture de la modale vient de base-ui, la réponse de l'IA vient du vrai backend | Unitaire (corps de la conversation) + smoke manuel |
| CA4, CA34 | Les événements `token` s'affichent au fil de l'eau, et un indicateur d'attente (« L'assistant écrit… ») est visible avant le premier octet | 🟠 | La lecture du flux en `SseEvent` (y compris un événement coupé entre 2 morceaux), la concaténation des tokens et la décision « aucun token reçu → indicateur visible » sont à nous. L'arrivée progressive réelle dépend de `fetch` + `ReadableStream` (contrainte technique), du réseau et du cold start | Unitaire (lecture SSE, concaténation, décision d'indicateur) + smoke manuel |
| CA39 | Zone de saisie vide ou faite d'espaces : bouton d'envoi désactivé, aucune conversation ne démarre | 🟢 | Décision d'état calculée à partir du texte, trim compris. « Aucune conversation ne démarre » découle du bouton désactivé. Appliqué à la zone de l'accueil et au champ de la modale (ambiguïté tranchée, voir en tête) | Unitaire, test-first |
| CA40 | Pendant que l'IA écrit, l'envoi d'un nouveau message est bloqué | 🟠 | « Flux en cours → envoi désactivé » est une décision à nous. L'état « en cours » réel vient de la lecture du flux, et l'absence de 2 flux concurrents se constate sur le réseau | Unitaire (décision d'état) + smoke manuel |

### 3. Le récap et sa validation

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA5, CA10 | Le JSON de l'événement `summary` donne 3 blocs (Hier, Blocages, À venir) avec leurs puces, en lecture seule. Une catégorie vide (`[]`) s'affiche « Aucun », qui n'est jamais un item envoyé au serveur | 🟠 | La transformation `StandupSummary` → sections affichées, avec « Aucun » pour une liste vide sans modifier la donnée, est à nous. L'arrivée réelle d'un `summary` dépend du LLM, et l'affichage en lecture seule est du rendu. Le « jamais envoyé » est aussi couvert par CA26 | Unitaire (sections du récap) + smoke manuel |
| CA30 | Un récap contenant du HTML (`<script>…`) s'affiche en texte brut, sans exécution | 🔴 | Aucun calcul à nous : l'échappement vient de React tant qu'on n'utilise pas `dangerouslySetInnerHTML`. Ce qu'on vérifie est le rendu réel. Doute : le LLM peut reformuler le HTML tapé, le smoke n'est pas garanti de le faire apparaître dans le récap | Manuel (smoke navigateur) |
| CA26 | Valider poste le `summary` reçu tel quel (`PostStandupBody`), sans date, sans régénération ni nouvel appel à l'IA | 🟢 | Construction du corps à partir du récap gardé, fonction pure : même contenu que le `summary` reçu, listes vides comprises, aucun champ de date (contrainte technique) | Unitaire, test-first |
| CA6, CA25 | « Oui, je valide le daily » n'est actif qu'une fois `summary` reçu. Au clic, le standup est enregistré, la modale se ferme, et le carré du jour ne passe en vert qu'une fois la modale fermée | 🟠 | Les décisions « `summary` reçu → bouton actif » et « carré vert seulement modale fermée » sont à nous. L'enregistrement réel, la fermeture de la modale (base-ui) et le rafraîchissement du calendrier dépendent du backend et de la librairie | Unitaire (activation du bouton, décision du carré) + smoke manuel |
| CA27 | Un re-clic sur « Valider » avant la réponse du serveur est ignoré (bouton désactivé) | 🟠 | « Requête de validation en cours → bouton désactivé » est une décision à nous. Le nombre réel de `POST /standups` partis se constate sur le réseau, avec le comportement du navigateur sur un bouton désactivé | Unitaire (décision d'état) + smoke manuel |

### 4. Fermer ou refaire un standup

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA7, CA44 | Fermer la modale en pleine conversation (×, Échap, clic sur l'overlay) ouvre la confirmation « Le daily standup n'est pas encore validé. », y compris quand le récap est reçu mais pas validé | 🟠 | Le prédicat « conversation inachevée » (au moins un message envoyé ET standup pas encore enregistré) est à nous. L'interception d'Échap et du clic extérieur demande un câblage explicite de la modale shadcn / base-ui (le ticket le signale) : la RM peut échouer avec un prédicat correct | Unitaire (prédicat) + smoke manuel |
| CA9 | Standup du jour déjà fait : relancer un daily affiche l'alerte de remplacement ; à la confirmation, une nouvelle conversation démarre | 🟠 | Le prédicat « standup existe pour aujourd'hui » et la décision « existe → alerte avant de démarrer » sont à nous. L'état réel vient de `GET /standups/today`, l'alerte et l'ouverture de la conversation sont des modales base-ui | Unitaire (prédicat, décision d'alerte) + smoke manuel |
| CA41 | Après confirmation de l'alerte puis fermeture sans valider, l'ancien standup reste intact et le carré du jour reste vert | 🔴 | Reformulée côté front : le front n'envoie aucune écriture avant « Valider ». Le remplacement est un upsert du backend au `POST`. Ce qu'on vérifie est l'état réel des données après la fermeture, rien à calculer de notre côté | Manuel (smoke navigateur) |

### 5. Les erreurs du flux

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA29, CA31, CA32 | Un événement SSE `error` affiche un message et un bouton « Réessayer », sans perdre la conversation. `LLM_QUOTA_EXCEEDED` et `LLM_UNAVAILABLE` sont classés à part des erreurs métier. Après `SUMMARY_MALFORMED`, « Valider » reste désactivé | 🟠 | Le mapping code → message et classement, la décision « Réessayer renvoie le même historique » et la décision « `SUMMARY_MALFORMED` → pas de validation » sont à nous. Les 3 codes existent dans le contrat. Mais le test unitaire mocke la forme `{ type: 'error', error: ApiError }` : aucun smoke ne peut provoquer à coup sûr un quota Groq, un provider indisponible ou un récap malformé | Unitaire (mapping + décisions) + smoke manuel |

## Récap

**Test unitaire automatisé (→ `unit-test-writer`)**
- CA39 : bouton d'envoi désactivé si le texte est vide ou fait d'espaces, sur l'accueil et dans la modale.
- CA26 : `PostStandupBody` = le `summary` reçu tel quel, sans date.

**Couverture partielle 🟠 (unitaire + smoke manuel)**
- CA1, CA8 : unitaire sur `done` → titre. Smoke : compte sans standup du jour, voir « Qu'as-tu fait de beau aujourd'hui, {prénom} ? » ; après validation, voir « Bravo, tu as renseigné ton standup du jour ! », la zone de saisie toujours là.
- CA42 : unitaire sur « état inconnu → pas de titre ». Smoke : réseau ralenti, ouvrir l'accueil, voir le loader puis le bon titre, sans jamais voir l'autre.
- CA2 : unitaire sur le corps de la conversation. Smoke : taper un texte, cliquer « Lancer le daily », voir la modale avec ce texte en premier message puis la réponse de l'IA.
- CA4, CA34 : unitaire sur la lecture SSE, la concaténation et l'indicateur. Smoke : envoyer un message, voir « L'assistant écrit… » puis le texte de l'IA apparaître progressivement.
- CA40 : unitaire sur « flux en cours → envoi désactivé ». Smoke : pendant que l'IA écrit, voir le bouton « Envoyer » désactivé.
- CA5, CA10 : unitaire sur les sections du récap. Smoke : finir une conversation sans blocage, voir les 3 blocs Hier / Blocages / À venir, « Aucun » sous Blocages, sans champ modifiable.
- CA6, CA25 : unitaire sur l'activation de « Valider » et la décision du carré. Smoke : bouton absent ou désactivé avant le récap, puis cliquer « Oui, je valide le daily », voir la modale se fermer et le carré du jour passer en vert.
- CA27 : unitaire sur « validation en cours → bouton désactivé ». Smoke : réseau ralenti, double-cliquer « Oui, je valide le daily », un seul `POST /standups` part.
- CA7, CA44 : unitaire sur le prédicat « conversation inachevée ». Smoke : fermer par la croix, puis par Échap, puis par clic sur l'overlay, voir à chaque fois la confirmation ; « Poursuivre le daily » garde le fil, « Quitter le daily » ferme. Refaire avec un récap reçu non validé.
- CA9 : unitaire sur le prédicat et la décision d'alerte. Smoke : standup déjà fait, taper un texte, cliquer « Lancer le daily », voir « Ton daily du jour est déjà renseigné. », cliquer « Refaire mon daily », voir la conversation démarrer ; « Annuler » ne démarre rien.
- CA29, CA31, CA32 : unitaire sur le mapping des 3 codes et les décisions. Smoke : couper le backend pendant que l'IA écrit, voir un message et « Réessayer », le fil conservé. Les 3 codes eux-mêmes ne sont confirmés par aucun smoke.

**Vérifié à la main (→ `smoke-test-writer`)**
- CA30 : récap contenant du HTML affiché en texte brut.
- CA41 : alerte confirmée puis fermeture sans valider, l'ancien standup et le carré vert restent.
