# Inventaire de test, KOM-19 « Renseigner son daily standup · frontend »

Doctrine appliquée : `docs/testing-strategy.md`. Codes d'erreur et types lus dans `src/types/apiContract.ts` (section F2).
Paquets 1 à 5 et leur ordre repris du ticket. Les critères groupés sur une même ligne dans le ticket restent groupés.
Le ticket numérote ses règles « CA » ; le contrat d'API cite les mêmes numéros en « RM » (ex. CA25 = RM25). La colonne RM reprend les libellés du ticket.

Hors inventaire : les réponses rapides (« Pas de blocage, RAS », « Oui, je valide le daily »…) et l'en-tête « Daily Standup Assistant / Live Sync Active ». Le ticket les signale lui-même comme absents de tout CA, ils ne sont donc pas classés. Le calendrier relève de KOM-22 ; seules les parties « carré vert » portées par CA6/CA25 et CA41 apparaissent ici.

Aujourd'hui le backend n'expose pas encore les routes `/standups` : aucun smoke qui touche `/standups/today`, `/standups/conversation` ou `POST /standups` n'est jouable avant leur livraison.

### 1. L'accueil et son titre conditionnel

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA1, CA8 | Standup du jour pas fait (`GetTodayResponse.done = false`) : titre « Qu'as-tu fait de beau aujourd'hui, {prénom} ? ». Déjà fait (`done = true`) : « Bravo, tu as renseigné ton standup du jour ! » | 🟠 | Le choix du titre à partir de `done` et du prénom est à nous. La vraie valeur de `done` vient de `GET /standups/today`, dont le serveur calcule « aujourd'hui » en Europe/Paris : la RM peut échouer avec un choix correct. La présence de la zone de saisie dans les 2 cas est du rendu statique, non testé. Doute : les 2 titres du ticket diffèrent de la maquette (`maquettes/F2/FLOW.md` : « Quoi de neuf aujourd'hui, Marc ? » et « Ton daily du jour est déjà renseigné, Marc ! ») | Unitaire (choix du titre) + smoke manuel |
| CA42 | Tant que l'état du jour n'est pas connu, aucun des 2 titres ne s'affiche, un loader les remplace | 🟠 | La décision « état inconnu → loader, pas de titre » est à nous. L'absence réelle de bascule dépend de l'état de chargement de TanStack Query et de la latence du backend (cold start Render) | Unitaire (état inconnu → loader) + smoke manuel |

### 2. La conversation en streaming

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA2 | À l'envoi depuis l'accueil, la modale s'ouvre avec le texte saisi comme 1er message (`role: 'user'`), et l'IA répond | 🟠 | La construction du fil initial (`PostConversationBody.messages` avec le texte saisi) est à nous. L'ouverture de la modale (base-ui) et la réponse de l'IA sont réelles | Unitaire (construction du 1er message) + smoke manuel |
| CA4, CA34 | Les événements `token` s'affichent au fil de l'eau, et un indicateur d'attente est visible avant le 1er octet | 🟠 | À nous : le découpage du flux lu en `fetch` + `ReadableStream` en événements `SseEvent` (morceaux coupés n'importe où), l'accumulation des `token` dans le message de l'IA, et la décision « aucun token reçu → indicateur ». Réel : le streaming effectif (aucun buffering par le réseau ou l'hébergeur), le cold start. Doute : le contrat type les événements mais ne fixe pas leur format sur le fil (lignes `event:` / `data:`, JSON dans `data:`). Le test unitaire mocke une forme qu'aucun smoke ne peut confirmer tant que le backend n'a pas la route | Unitaire (lecture du flux, accumulation, décision d'attente) + smoke manuel |
| CA39 | Zone de saisie vide ou faite uniquement d'espaces : bouton d'envoi désactivé, aucune conversation ne démarre | 🟢 | Décision d'état calculée à partir du texte, trim compris. Le refus serveur (`VALIDATION_ERROR`, RM39 du contrat) est du backend. Doute : le ticket ne parle que de la zone de l'accueil ; la même règle vaut probablement pour le champ « Écrire un message ... » de la modale | Unitaire, test-first |
| CA40 | Pendant que l'IA écrit, l'envoi d'un nouveau message est bloqué : jamais 2 flux concurrents | 🟠 | La décision « flux en cours → envoi désactivé » est à nous. La fin réelle du flux (fermeture du `ReadableStream`) et le blocage effectif d'un clic sur un bouton désactivé sont réels | Unitaire (décision d'état) + smoke manuel |

### 3. Le récap et sa validation

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA5, CA10 | À partir du `StandupSummary` reçu, le front produit les 3 blocs (HIER / BLOCAGES / À VENIR) ; une catégorie vide (`[]`) s'affiche « Aucun », et « Aucun » n'est jamais ajouté aux données | 🟢 | Transformation pure des 3 listes en blocs affichables. « Aucun » est un libellé d'affichage, jamais un item : vérifiable en unitaire sur la sortie. La lecture seule est du rendu statique, non testé | Unitaire, test-first |
| CA30 | Un récap contenant du HTML (`<script>…`) s'affiche en texte brut, sans exécution | 🔴 | Aucun calcul à nous : l'échappement vient de React tant qu'on n'utilise pas `dangerouslySetInnerHTML` (contrainte technique « contenu non fiable »). Ce qu'on vérifie est le rendu réel | Manuel (smoke navigateur) |
| CA26 | À la validation, le corps envoyé à `POST /standups` est `{ summary }` avec le récap reçu dans l'événement `summary`, tel quel, sans date | 🟢 | Construction pure de `PostStandupBody` à partir du dernier `summary` reçu. Le fait qu'on ne rappelle pas l'IA découle du chemin de code. Doute : la maquette (état 13) montre un récap actualisé après un ajout ; le ticket ne dit pas explicitement que c'est le dernier `summary` reçu qui part, c'est l'hypothèse retenue | Unitaire, test-first |
| CA6, CA25 | « Valider mon standup » n'est actif qu'après l'événement `summary`. Au clic, le standup est enregistré, la modale se ferme, et le carré du jour ne passe au vert qu'après la fermeture | 🟠 | La décision « `summary` reçu → bouton actif » est à nous. L'enregistrement réel, la fermeture de la modale et le carré vert (calendrier de KOM-22) sont réels. Doute : la maquette (état 13) valide par la réponse rapide « Oui, je valide le daily » et laisse le chat ouvert avec « Daily validé… », alors que le ticket ferme la modale | Unitaire (décision d'état) + smoke manuel |
| CA27 | Un re-clic sur « Valider » avant la réponse du serveur est ignoré (bouton désactivé) | 🟠 | La décision « enregistrement en cours → bouton désactivé » est à nous. L'état en cours réel vient de la requête, et le nombre réel de `POST` envoyés ne se voit qu'en navigateur | Unitaire (décision d'état) + smoke manuel |

### 4. Fermer ou refaire un standup

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA7, CA44 | Fermer la modale en pleine conversation (×, Échap, clic sur l'overlay) ouvre la confirmation « Le daily standup n'est pas encore validé. » | 🟠 | Le prédicat « conversation inachevée = au moins 1 message envoyé et standup pas encore enregistré » (contrainte technique, récap reçu mais non validé compris) est à nous. L'interception de Échap et du clic sur l'overlay est un comportement de base-ui qu'il faut câbler : il ne se vérifie qu'en navigateur, pour les 3 moyens de fermeture | Unitaire (prédicat) + smoke manuel |
| CA9 | Standup du jour déjà fait : resoumettre affiche une alerte de remplacement ; à la confirmation, une nouvelle conversation démarre | 🟠 | La décision « standup du jour existant → alerte avant de démarrer » est à nous. L'état réel vient de `GET /standups/today`, l'alerte est une modale base-ui. Le remplacement en base (upsert) est du backend | Unitaire (décision d'alerte) + smoke manuel |
| CA41 | Après confirmation de l'alerte, fermer sans valider laisse l'ancien standup intact et le carré du jour vert | 🔴 | Reformulée côté front : rien n'est envoyé au serveur avant « Valider ». Ce qu'on vérifie est la persistance réelle de l'ancien standup et l'affichage du calendrier (KOM-22), il n'y a rien à calculer de notre côté | Manuel (smoke navigateur) |

### 5. Les erreurs du flux

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA29, CA31, CA32 | Un événement SSE `error` affiche un message et un bouton « Réessayer » sans perdre le fil. `LLM_QUOTA_EXCEEDED` et `LLM_UNAVAILABLE` donnent des messages distincts d'une erreur métier. Après `SUMMARY_MALFORMED`, « Valider » reste désactivé | 🟠 | À nous : le mapping code → message et type d'erreur, la conservation de l'historique, le fil renvoyé tel quel par « Réessayer », et la décision « `SUMMARY_MALFORMED` → pas de validation ». Les 4 codes existent dans le contrat. Mais la forme `{ type: 'error', error: ApiError }` au milieu du flux n'est confirmée par aucun smoke tant que la route n'existe pas, et le quota Groq ou un récap malformé ne se provoquent pas à la demande. Doute : le ticket ne dit pas si le front affiche le `message` du serveur (choix de KOM-07) ou ses propres textes | Unitaire (mapping, historique conservé, décision d'état) + smoke manuel |

## Récap

**Test unitaire automatisé (→ `unit-test-writer`)**
- CA39 : bouton d'envoi désactivé si la zone est vide ou faite d'espaces.
- CA5, CA10 : `StandupSummary` → 3 blocs, « Aucun » pour une liste vide, jamais dans les données.
- CA26 : corps du `POST /standups` = `{ summary }` du dernier événement `summary`, sans date.

**Couverture partielle 🟠 (unitaire + smoke manuel)**
- CA1, CA8 : unitaire sur le choix du titre selon `done`. Smoke : ouvrir l'accueil sans standup du jour, voir le titre « à faire » ; valider un standup, recharger, voir le titre « déjà fait » et la zone de saisie toujours présente.
- CA42 : unitaire sur « état inconnu → loader ». Smoke : réseau ralenti, ouvrir l'accueil, voir le loader puis directement le bon titre, sans bascule.
- CA2 : unitaire sur la construction du 1er message. Smoke : taper un texte sur l'accueil, cliquer « Lancer le daily », voir la modale avec ce texte en 1er message, puis la réponse de l'IA.
- CA4, CA34 : unitaire sur la lecture du flux, l'accumulation des tokens et la décision d'attente. Smoke : envoyer un message, voir l'indicateur d'attente, puis la réponse s'écrire progressivement.
- CA40 : unitaire sur « flux en cours → envoi désactivé ». Smoke : pendant que l'IA écrit, voir le bouton d'envoi désactivé.
- CA6, CA25 : unitaire sur « `summary` reçu → Valider actif ». Smoke : avant le récap, voir « Valider » désactivé ; après, cliquer, voir la modale se fermer et le carré du jour passer au vert.
- CA27 : unitaire sur « enregistrement en cours → bouton désactivé ». Smoke : réseau ralenti, double-cliquer sur « Valider », constater un seul `POST /standups`.
- CA7, CA44 : unitaire sur le prédicat « conversation inachevée ». Smoke : après 1 message, fermer par la croix, par Échap, puis par un clic sur l'overlay : la confirmation apparaît à chaque fois ; idem avec un récap reçu non validé.
- CA9 : unitaire sur « standup existant → alerte ». Smoke : standup du jour déjà fait, lancer le daily, voir l'alerte de remplacement, confirmer, voir une nouvelle conversation démarrer.
- CA29, CA31, CA32 : unitaire sur le mapping des 4 codes, l'historique conservé et le blocage de « Valider ». Smoke : provoquer `LLM_UNAVAILABLE` (clé LLM invalide côté backend), voir le message et « Réessayer », cliquer, voir la conversation reprendre avec le fil intact.

**Vérifié à la main (→ `smoke-test-writer`)**
- CA30 : récap contenant `<script>` affiché en texte brut.
- CA41 : standup existant, confirmer l'alerte, fermer sans valider, l'ancien standup et le carré vert restent.
