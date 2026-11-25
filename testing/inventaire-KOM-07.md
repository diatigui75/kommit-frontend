# Inventaire de test, KOM-07 « Authentification · frontend »

Doctrine appliquée : `docs/testing-strategy.md`. Codes d'erreur lus dans `src/types/apiContract.ts`.
Paquets 1 à 5 et leur ordre repris du ticket. Les RM groupées sur une même ligne dans le ticket restent groupées.
Le paquet 6 ne vient pas du ticket : ses RM sont citées par le contrat d'API (`src/types/apiContract.ts`) et ajoutées sur arbitrage de l'utilisateur.
Le paquet 7 ne vient ni du ticket ni du contrat : ses 4 règles ont été tranchées par l'utilisateur.

Cadrage des messages d'erreur, tranché par l'utilisateur : le front affiche toujours le `message` renvoyé par le backend, `INTERNAL_ERROR` compris. Le texte de panne écrit dans le front (« Le serveur ne répond pas. Réessaie dans un instant. ») ne sert que pour le serveur injoignable et l'erreur inconnue.

### 1. Page d'accueil

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| RM1 | Une session `null` donne l'état visiteur de l'accueil (message d'accueil, boutons « Se connecter » / « Créer un compte ») | 🟠 | La décision « `Session` null → état visiteur » est à nous. Le fait que la vraie requête de session renvoie `null` sans cookie dépend de Better Auth. Le texte affiché est du rendu statique, non testé | Unitaire (décision d'état) + smoke manuel |
| RM2 | Le titre « Qu'as-tu fait de beau aujourd'hui, {prénom} ? » est composé à partir de `SessionUser.name` | 🟠 | La composition du titre est à nous. La présence réelle de `name` dans la session dépend de l'API et du cookie envoyé avec `credentials: 'include'` (contrainte technique 3) : la RM peut échouer avec une composition correcte | Unitaire (composition du titre) + smoke manuel |
| RM15 | Le lien « ViDev » du footer ouvre la chaîne YouTube dans un nouvel onglet | 🔴 | L'ouverture d'un nouvel onglet est un comportement du navigateur, rien à calculer de notre côté | Manuel (smoke navigateur) |

### 2. Navigation entre les pages

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| RM6 | Clic sur « Créer un compte » : on arrive sur la page de signup | 🔴 | Navigation réelle, comportement de React Router et du navigateur | Manuel (smoke navigateur) |
| RM7 | Clic sur « Se connecter » : on arrive sur la page de signin | 🔴 | Navigation réelle, comportement de React Router et du navigateur | Manuel (smoke navigateur) |

### 3. Formulaire d'authentification

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| RM32 | Le bouton « Me connecter » est désactivé tant qu'un des 2 champs est vide | 🟢 | Décision d'état calculable à partir des valeurs des champs. « Aucune requête ne part » découle du bouton désactivé (comportement navigateur), pas d'une logique supplémentaire | Unitaire, test-first |
| RM33 | Le bouton « Créer un compte » est désactivé tant qu'un champ requis est vide, un prénom fait uniquement d'espaces comptant comme vide | 🟢 | Décision d'état à partir des valeurs, trim compris | Unitaire, test-first |
| RM10, RM11, RM20 | Au signup : prénom trimé non vide, email bien formé, mot de passe d'au moins 8 caractères. Au signin : aucun contrôle de format | 🟢 | Validation client, fonctions pures. L'absence de contrôle au signin se vérifie aussi en unitaire (identifiants mal formés acceptés) | Unitaire, test-first |
| RM30 | Les erreurs de format apparaissent à la 1re soumission, puis se mettent à jour pendant la saisie | 🟠 | La règle « erreurs visibles à partir de la 1re soumission, recalculées à chaque saisie » est codée dans `src/logic/`, pas confiée au mode de validation de react-hook-form : c'est une décision à nous. Le branchement sur les événements de saisie et l'affichage sous les champs sont réels | Unitaire (décision de visibilité des erreurs) + smoke manuel |
| RM17 | Pendant un appel signin ou signup, le bouton est désactivé et son libellé remplacé par un spinner, avec « Connexion en cours » / « Création du compte en cours » en aria | 🟠 | « Requête en cours → bouton désactivé » est une décision à nous. L'état en cours réel vient de la requête et de TanStack Query, le spinner et le libellé aria sont du rendu | Unitaire (décision d'état) + smoke manuel |
| RM16 | Un double-clic sur le bouton n'envoie qu'une seule requête | 🔴 | Le ticket dit que c'est le bouton désactivé de RM17 qui le garantit : ce qu'on vérifie est le comportement du navigateur sur un bouton désactivé et le nombre réel de requêtes réseau | Manuel (smoke navigateur) |
| RM9, RM13 | Quand l'API renvoie `EMAIL_ALREADY_EXISTS`, son `message` s'affiche sous le champ Email. Quand elle renvoie `INVALID_CREDENTIALS`, son `message` (générique) s'affiche en message global du formulaire | 🟢 | Reformulée du point de vue du front : l'unicité de l'email et la vérification des identifiants sont du backend. Ce que le front fait, c'est le routage code → emplacement (champ ou global), décidé dans le contrat, en reprenant le `message` du serveur. Les 2 codes existent dans `apiContract.ts` | Unitaire, test-first |
| RM8, RM12 | Après un signup ou un signin réussi, l'utilisateur revient sur l'accueil, connecté | 🔴 | Dépend de la vraie création de compte ou ouverture de session, du cookie joint grâce à `credentials: 'include'` (contrainte technique 3) et de la navigation réelle | Manuel (smoke navigateur) |

### 4. Le toast d'arrivée

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| RM3, RM4 | Arrivée depuis le signup : « Bienvenue {prénom}, ton compte est créé. ». Arrivée depuis le signin : « Content de te revoir {prénom}. » | 🟠 | Le choix du message à partir de l'origine (signup / signin) et du prénom est à nous. Le transport de l'origine jusqu'à l'accueil (contrainte technique 2) et l'affichage du toast par Sonner sont réels | Unitaire (choix du message) + smoke manuel |
| RM24, RM25 | Pas de toast après un rechargement, un « retour » navigateur, ou une ouverture directe de l'accueil avec session persistée | 🟠 | « Pas d'origine → pas de toast » est une décision à nous. Mais le risque principal est le navigateur : selon le moyen de transport choisi (contrainte technique 2), l'information peut survivre à un rechargement ou à un « retour ». Seul le smoke le vérifie | Unitaire (pas d'origine → pas de toast) + smoke manuel |

### 5. Sign out et fin de session

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| RM5 | Clic sur « Se déconnecter » : la session est fermée, l'accueil repasse en état visiteur, sans modale ni toast | 🔴 | Fermeture réelle de la session par l'API et rafraîchissement de l'accueil. Le passage à l'état visiteur est déjà couvert en unitaire par RM1. Le ticket écrit « Déconnexion » ; l'utilisateur a retenu « Se déconnecter », le libellé de la maquette | Manuel (smoke navigateur) |
| RM31 | Session expirée : au chargement suivant, l'accueil s'affiche en état visiteur, sans message | 🔴 | Ce qu'on vérifie est que le backend traite la session expirée comme absente et que rien ne s'affiche en erreur. La décision « session null → visiteur » est déjà couverte par RM1 | Manuel (smoke navigateur) |

### 6. RM issues du contrat d'API (hors ticket)

Ces RM ne figurent pas dans le ticket KOM-07. Elles sont citées dans les commentaires de `src/types/apiContract.ts`, dont la formulation est reprise entre guillemets.

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| `TOO_MANY_ATTEMPTS` (sans n°) | Contrat : « Signin ou signup, trop d'essais ratés depuis la même IP → 429. Le front affiche le message tel quel. » Côté front : quand l'API renvoie ce code, le `message` du serveur s'affiche sans transformation, en message global du formulaire | 🟢 | Le blocage après trop d'essais est du backend. La réaction du front est un mapping code → (message du serveur, emplacement global), le code existe dans le contrat | Unitaire, test-first |
| RM18, RM19 | Contrat : « Panne serveur (5xx). Le front en fait un message DISTINCT des erreurs métier, et laisse l'action re-tentable. » Côté front : `INTERNAL_ERROR` → le `message` du serveur s'affiche en message global, classé en panne (distinct des erreurs métier). Serveur injoignable → le texte du front « Le serveur ne répond pas. Réessaie dans un instant. » en message global. Dans les 2 cas, le bouton de soumission redevient utilisable | 🟠 | Le classement en panne, le choix entre message du serveur et texte du front, et la décision « après une erreur, le bouton redevient actif » sont à nous. Le cas « serveur injoignable » n'a pas de code dans le contrat : c'est l'échec réseau de `fetch`, aujourd'hui converti par `src/lib/api/apiClient.ts` en `Error('Le serveur ne répond pas.')`. Le test unitaire mocke cette forme, seul un smoke (backend coupé) la confirme | Unitaire (mapping + décision d'état) + smoke manuel |
| RM21 | Contrat : « Insensible à la casse et aux espaces : ` MARC@x.com ` == `marc@x.com` ». Côté front : l'email saisi est ramené en minuscules et sans espaces autour avant l'envoi | 🟢 | Le contrat décrit l'insensibilité du contrôle d'unicité, qui est du backend. Reformulée côté front, la RM devient une normalisation (trim + minuscules), fonction pure. La réaction au doublon reste couverte par RM9 | Unitaire, test-first |
| RM23 | Contrat : « le front le rend comme texte brut ». Côté front : un prénom contenant du HTML (ex. `<b>Marc</b>`) s'affiche tel quel dans le titre et le toast, sans être interprété | 🔴 | Aucun calcul à nous : l'échappement vient de React, qui rend une chaîne comme du texte tant qu'on n'utilise pas `dangerouslySetInnerHTML`. Ce qu'on vérifie est le rendu réel | Manuel (smoke navigateur) |

### 7. Règles tranchées par l'utilisateur (hors ticket, hors contrat)

Ces 4 règles ne figurent ni dans le ticket KOM-07 ni dans `src/types/apiContract.ts`. Elles viennent d'un arbitrage de l'utilisateur. Elles n'ont pas de numéro de RM.

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| Arbitrage 1 (sans n°) | Un email ou un mot de passe fait uniquement d'espaces compte comme vide : bouton de soumission grisé, au signin comme au signup | 🟢 | Décision d'état calculée à partir des valeurs, trim compris. Étend RM32 et RM33 aux champs Email et Mot de passe | Unitaire, test-first |
| Arbitrage 2 (sans n°) | Au signup, un email sans extension de domaine (ex. `marc@test`) est invalide | 🟢 | Validation client, fonction pure. Précise le « email bien formé » de RM11 | Unitaire, test-first |
| Arbitrage 3 (sans n°) | Quand l'API renvoie `VALIDATION_ERROR`, son `message` s'affiche en message global, en haut du formulaire | 🟢 | Le contrôle serveur (Zod) est du backend. La réaction du front est un mapping code → (message du serveur, emplacement global). Le code existe dans le contrat | Unitaire, test-first |
| Arbitrage 4 (sans n°) | Toute erreur inconnue (ni code `ApiError` du contrat, ni échec réseau) est traitée comme une panne : le texte du front « Le serveur ne répond pas. Réessaie dans un instant. » s'affiche en haut du formulaire | 🟢 | La décision de classer en panne une forme non reconnue est entièrement à nous, et les entrées (erreur JavaScript, code hors contrat, valeur sans forme d'erreur) se fabriquent en test. Aucune dépendance réelle ne produit ce cas de façon reproductible, donc pas de smoke à faire. Étend RM18 | Unitaire, test-first |

## Récap

**Test unitaire automatisé (→ `unit-test-writer`)**
- RM32 : bouton « Me connecter » désactivé si un champ est vide.
- RM33 : bouton « Créer un compte » désactivé si un champ requis est vide, prénom trimé.
- RM10, RM11, RM20 : critères de validation signup, aucun contrôle au signin.
- RM9, RM13 : `EMAIL_ALREADY_EXISTS` / `INVALID_CREDENTIALS` → emplacement (champ Email ou global), avec le `message` du serveur.
- `TOO_MANY_ATTEMPTS` : message du serveur affiché tel quel, en message global.
- RM21 : normalisation de l'email (trim + minuscules) avant l'envoi.
- Arbitrage 1 : email ou mot de passe fait uniquement d'espaces → bouton grisé, au signin et au signup.
- Arbitrage 2 : au signup, email sans extension de domaine invalide.
- Arbitrage 3 : `VALIDATION_ERROR` → message du serveur en haut du formulaire.
- Arbitrage 4 : erreur inconnue → panne, texte du front en haut du formulaire.

**Couverture partielle 🟠 (unitaire + smoke manuel)**
- RM1 : unitaire sur « session null → état visiteur ». Smoke : ouvrir l'accueil sans session, voir le message d'accueil et les 2 boutons.
- RM2 : unitaire sur la composition du titre. Smoke : se connecter, voir le titre avec le bon prénom.
- RM30 : unitaire sur la visibilité des erreurs. Smoke : soumettre un signup invalide, voir les erreurs, corriger un champ, voir son erreur disparaître sans resoumettre.
- RM17 : unitaire sur « requête en cours → bouton désactivé ». Smoke : réseau ralenti, soumettre, voir le bouton désactivé avec le spinner.
- RM3, RM4 : unitaire sur le choix du message. Smoke : créer un compte puis voir le toast « Bienvenue », se reconnecter puis voir le toast « Content de te revoir ».
- RM24, RM25 : unitaire sur « pas d'origine → pas de toast ». Smoke : après l'arrivée avec toast, recharger la page, puis faire « retour », puis ouvrir l'accueil directement : aucun toast.
- RM18, RM19 : unitaire sur `INTERNAL_ERROR` → message du serveur classé en panne, échec réseau → texte du front, et sur le bouton réactivé. Smoke : couper le backend, soumettre le signin, voir « Le serveur ne répond pas. Réessaie dans un instant. » et pouvoir resoumettre.

**Vérifié à la main (→ `smoke-test-writer`)**
- RM15 : lien « ViDev » en nouvel onglet.
- RM6 : navigation vers le signup.
- RM7 : navigation vers le signin.
- RM16 : double-clic, une seule requête.
- RM8, RM12 : succès du signup et du signin, retour à l'accueil connecté.
- RM5 : clic sur « Se déconnecter », déconnexion silencieuse.
- RM31 : session expirée, accueil visiteur sans message.
- RM23 : prénom contenant du HTML affiché en texte brut.
