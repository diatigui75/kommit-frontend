# Smokes, KOM-07 « Authentification · frontend »

Scénarios écrits **avant** l'implémentation (test-first), à partir de `testing/inventaire-KOM-07.md`.
Après le code, chaque scénario est transcrit en e2e Playwright par `e2e-test-writer`.
Format : `docs/testing-strategy.md`, section « Format des smokes ». Mêmes paquets, mêmes lignes et même ordre que l'inventaire.

Conventions communes à tous les scénarios :

- **Dev server** : front lancé (`pnpm dev`, http://localhost:5173) et backend lancé (http://localhost:3000), sauf mention contraire.
- **Libellés** : repris de `src/data/` (maquette intégrée). Les libellés des champs du signup portent un astérisque (« Prénom* », « Email* », « Mot de passe* ») : « le champ Prénom » désigne ce champ. Dans le header, « Se connecter » et « Créer un compte » sont des **liens** stylés en bouton, pas des boutons.
- **Compte de test** : « le compte Marc » = un compte existant de prénom « Marc », email « marc@test.dev », mot de passe « motdepasse123 ». Il est créé avant le scénario qui le demande.
- **Email neuf** : un email jamais utilisé, par exemple « marc+<horodatage>@test.dev », pour que le signup ne tombe pas sur `EMAIL_ALREADY_EXISTS`.
- **Messages d'erreur** (cadrage de l'inventaire) : le front affiche toujours le `message` renvoyé par le backend, `INTERNAL_ERROR` compris. Le texte du front « Le serveur ne répond pas. Réessaie dans un instant. » ne sert que pour le serveur injoignable et l'erreur inconnue.
- **Libellé absent** : si un libellé désigné ici n'existe pas à l'écran, le smoke échoue à l'étape qui le cite. C'est soit un écart avec la maquette, soit un livrable manquant.

### 1. Page d'accueil

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| RM1 | 🟠 | Sans session, l'accueil s'affiche en état visiteur, avec les liens « Se connecter » / « Créer un compte » | SM-1 |
| RM2 | 🟠 | Avec une session, le titre affiche le prénom lu dans la vraie session | SM-2 |
| RM15 | 🔴 | Le lien « ViDev » ouvre la chaîne YouTube dans un nouvel onglet | SM-3 |

---

### SM-1 : Visiteur sans session, accueil en état visiteur (RM1)

> ✅ **Ce qu'on vérifie :**
> - Sans cookie de session, l'accueil affiche le message d'accueil et les 2 liens du header.
> - Smoke parce que le `null` vient de la vraie requête de session (Better Auth), pas d'une doublure. La décision « `Session` null → état visiteur » est couverte en unitaire.

Précondition : dev server lancé, aucune session (cookies du site effacés, ou fenêtre de navigation privée).

1. Ouvrir la page /.

Attendu : le titre « Prêt(e) pour ton daily standup ? » et le sous-titre « Track tes résultats pour que les jours ne se ressemblent pas. » s'affichent. Le header montre le lien « Se connecter » et le lien « Créer un compte ». Le bouton « Se déconnecter » n'est pas affiché. Aucun message d'erreur.

- [ ] Vérifié

---

### SM-2 : Utilisateur connecté, titre avec son prénom (RM2)

> ✅ **Ce qu'on vérifie :**
> - Avec une session ouverte, l'accueil affiche « Qu'as-tu fait de beau aujourd'hui, Marc ? », le prénom venant de `SessionUser.name`.
> - Smoke parce que la RM peut échouer avec une composition du titre correcte : il faut que la requête de session parte avec le cookie (`credentials: 'include'`, contrainte technique 3) et que l'API renvoie bien `name`.

Précondition : dev server lancé, compte Marc existant, session ouverte sur ce compte (signin fait plus tôt dans le même navigateur).

1. Ouvrir la page /.

Attendu : le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » et le sous-titre « Renseigne ton daily du jour ci-dessous. » s'affichent. Le header montre le bouton « Se déconnecter », et ni le lien « Se connecter » ni le lien « Créer un compte ».

- [ ] Vérifié

---

### SM-3 : Lien ViDev ouvert dans un nouvel onglet (RM15)

> ✅ **Ce qu'on vérifie :**
> - Le lien « ViDev » du footer ouvre https://www.youtube.com/@videv9858 dans un nouvel onglet, l'onglet de Kommit reste ouvert sur la même page.
> - Smoke parce que l'ouverture d'un onglet est un comportement du navigateur, rien n'est calculé de notre côté.

Précondition : dev server lancé, page / ouverte (état visiteur ou connecté, peu importe).

1. Cliquer sur le lien « ViDev » dans le footer.

Attendu : un nouvel onglet s'ouvre sur https://www.youtube.com/@videv9858. L'onglet d'origine est toujours sur /, inchangé.

- [ ] Vérifié

### 2. Navigation entre les pages

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| RM6 | 🔴 | Clic sur « Créer un compte » : arrivée sur la page de signup | SM-4 |
| RM7 | 🔴 | Clic sur « Se connecter » : arrivée sur la page de signin | SM-5 |

---

### SM-4 : Lien « Créer un compte » vers le signup (RM6)

> ✅ **Ce qu'on vérifie :**
> - Le lien « Créer un compte » du header mène à /signup, avec le formulaire de création de compte.
> - Smoke parce que c'est une navigation réelle, gérée par React Router et le navigateur.

Précondition : dev server lancé, aucune session, page / ouverte.

1. Cliquer sur le lien « Créer un compte » dans le header.

Attendu : l'URL devient /signup. Le titre « Créer un compte » s'affiche, avec les champs Prénom, Email et Mot de passe, et le bouton « Créer un compte ».

- [ ] Vérifié

---

### SM-5 : Lien « Se connecter » vers le signin (RM7)

> ✅ **Ce qu'on vérifie :**
> - Le lien « Se connecter » du header mène à /signin, avec le formulaire de connexion.
> - Smoke parce que c'est une navigation réelle, gérée par React Router et le navigateur.

Précondition : dev server lancé, aucune session, page / ouverte.

1. Cliquer sur le lien « Se connecter » dans le header.

Attendu : l'URL devient /signin. Le titre « Se connecter » s'affiche, avec les champs Email et Mot de passe, et le bouton « Me connecter ».

- [ ] Vérifié

### 3. Formulaire d'authentification

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| RM32 | 🟢 | Bouton « Me connecter » désactivé tant qu'un des 2 champs est vide | aucun smoke, couvert en unitaire |
| RM33 | 🟢 | Bouton « Créer un compte » désactivé tant qu'un champ requis est vide, prénom trimé | aucun smoke, couvert en unitaire |
| RM10, RM11, RM20 | 🟢 | Critères de validation au signup, aucun contrôle au signin | aucun smoke, couvert en unitaire |
| RM30 | 🟠 | Erreurs de format affichées à la 1re soumission, puis mises à jour pendant la saisie | SM-6 |
| RM17 | 🟠 | Pendant l'appel, bouton désactivé avec spinner et libellé aria (signin puis signup) | SM-7, SM-8 |
| RM16 | 🔴 | Un double-clic n'envoie qu'une seule requête | SM-9 |
| RM9, RM13 | 🟢 | `EMAIL_ALREADY_EXISTS` / `INVALID_CREDENTIALS` → `message` du serveur, sous le champ Email ou en message global | aucun smoke, couvert en unitaire |
| RM8, RM12 | 🔴 | Signup ou signin réussi : retour à l'accueil, connecté | SM-10, SM-11 |

---

### SM-6 : Signup invalide, erreurs à la soumission puis mises à jour à la saisie (RM30)

> ✅ **Ce qu'on vérifie :**
> - Aucune erreur de format n'est visible avant la 1re soumission. Après la soumission, chaque champ invalide montre son erreur. Ensuite, corriger un champ fait disparaître son erreur pendant la saisie, sans resoumettre.
> - Smoke parce que le branchement sur les vrais événements de saisie et l'affichage sous les champs sont réels. La décision « quand une erreur est visible » est couverte en unitaire.

Précondition : dev server lancé, aucune session, page /signup ouverte.

1. Saisir « Marc » dans le champ « Prénom ».
2. Saisir « marc » dans le champ « Email ».
3. Saisir « abc » dans le champ « Mot de passe ».
4. Cliquer sur le bouton « Créer un compte ».
5. Ajouter « defgh » à la fin du champ « Mot de passe » (il contient alors « abcdefgh », 8 caractères).

Attendu :
- Pendant les étapes 1 à 3 : aucun message d'erreur sous les champs.
- Après l'étape 4 : le message « Renseigne un email valide. » s'affiche sous le champ Email et le message « Ton mot de passe doit contenir au moins 8 caractères. » sous le champ Mot de passe, les 2 champs passent en bordure rouge. Aucun message sous le champ Prénom. Aucune requête de signup ne part, on reste sur /signup.
- Après l'étape 5, sans recliquer : le message et la bordure rouge du champ Mot de passe disparaissent. Ceux du champ Email restent.

Si une bulle native du navigateur (« Veuillez inclure "@"… ») s'affiche à l'étape 4 à la place des messages, le formulaire laisse le navigateur valider le champ Email avant notre validation.

Le message du prénom (« Renseigne ton prénom. ») n'est pas joué ici : un prénom vide ou fait d'espaces désactive le bouton (RM33), il est couvert en unitaire.

Ce scénario a 5 étapes : il dépasse la taille d'un smoke, parce que RM30 décrit 2 temps (soumission, puis saisie).

- [ ] Vérifié

---

### SM-7 : Signin en cours, bouton désactivé avec spinner (RM17, signin)

> ✅ **Ce qu'on vérifie :**
> - Pendant l'appel de signin, le bouton est désactivé, son libellé visible est remplacé par un spinner, et son nom accessible est « Connexion en cours ».
> - Smoke parce que l'état « en cours » vient de la vraie requête et de TanStack Query. La décision « requête en cours → bouton désactivé » est couverte en unitaire.

Précondition : dev server lancé, compte Marc existant, aucune session, page /signin ouverte, réseau ralenti (devtools, profil « Slow 3G ») pour que l'appel dure assez longtemps pour être observé.

1. Saisir « marc@test.dev » dans le champ « Email ».
2. Saisir « motdepasse123 » dans le champ « Mot de passe ».
3. Cliquer sur le bouton « Me connecter ».

Attendu : tant que la réponse n'est pas arrivée, le bouton est désactivé, le texte « Me connecter » n'est plus visible, un spinner tourne à sa place, et le bouton a pour nom accessible « Connexion en cours » (texte non visible à l'écran). À l'arrivée de la réponse, on est ramené sur l'accueil connecté (SM-11).

- [ ] Vérifié

---

### SM-8 : Signup en cours, bouton désactivé avec spinner (RM17, signup)

> ✅ **Ce qu'on vérifie :**
> - Pendant l'appel de signup, le bouton est désactivé, son libellé visible est remplacé par un spinner, et son nom accessible est « Création du compte en cours ».
> - Smoke pour la même raison que SM-7 : l'état « en cours » est celui de la vraie requête.

Précondition : dev server lancé, aucune session, page /signup ouverte, réseau ralenti (devtools, profil « Slow 3G »).

1. Saisir « Marc » dans le champ « Prénom ».
2. Saisir un email neuf dans le champ « Email ».
3. Saisir « motdepasse123 » dans le champ « Mot de passe ».
4. Cliquer sur le bouton « Créer un compte ».

Attendu : tant que la réponse n'est pas arrivée, le bouton est désactivé, le texte « Créer un compte » n'est plus visible dans le formulaire, un spinner tourne à sa place, et le bouton a pour nom accessible « Création du compte en cours » (texte non visible à l'écran). À l'arrivée de la réponse, on est ramené sur l'accueil connecté (SM-10).

- [ ] Vérifié

---

### SM-9 : Double-clic sur « Me connecter », une seule requête (RM16)

> ✅ **Ce qu'on vérifie :**
> - Un double-clic sur le bouton de soumission n'envoie qu'une requête de signin.
> - Smoke parce que la garantie vient du bouton désactivé de RM17 : ce qu'on vérifie est le comportement du navigateur sur un bouton désactivé et le nombre réel de requêtes réseau.

Précondition : dev server lancé, compte Marc existant, aucune session, page /signin ouverte, onglet Réseau des devtools ouvert et vidé.

1. Saisir « marc@test.dev » dans le champ « Email ».
2. Saisir « motdepasse123 » dans le champ « Mot de passe ».
3. Double-cliquer sur le bouton « Me connecter ».

Attendu : l'onglet Réseau montre **une seule** requête POST vers `http://localhost:3000/api/auth/sign-in/email`. On est ramené sur l'accueil connecté.

- [ ] Vérifié

---

### SM-10 : Signup réussi, retour à l'accueil connecté (RM8)

> ✅ **Ce qu'on vérifie :**
> - Après une création de compte réussie, on arrive sur / en état connecté, avec le prénom saisi.
> - Smoke parce que ça dépend de la vraie création de compte, du cookie de session joint aux requêtes suivantes grâce à `credentials: 'include'` (contrainte technique 3), et de la navigation réelle.

Précondition : dev server lancé, aucune session, page /signup ouverte.

1. Saisir « Marc » dans le champ « Prénom ».
2. Saisir un email neuf dans le champ « Email ».
3. Saisir « motdepasse123 » dans le champ « Mot de passe ».
4. Cliquer sur le bouton « Créer un compte ».

Attendu : l'URL devient /. Le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » s'affiche et le header montre le bouton « Se déconnecter ». Si l'accueil s'affiche en état visiteur, le cookie n'a pas été joint à la requête de session.

- [ ] Vérifié

---

### SM-11 : Signin réussi, retour à l'accueil connecté (RM12)

> ✅ **Ce qu'on vérifie :**
> - Après une connexion réussie, on arrive sur / en état connecté, avec le prénom du compte.
> - Smoke pour la même raison que SM-10 : vraie ouverture de session, cookie joint, navigation réelle.

Précondition : dev server lancé, compte Marc existant, aucune session, page /signin ouverte.

1. Saisir « marc@test.dev » dans le champ « Email ».
2. Saisir « motdepasse123 » dans le champ « Mot de passe ».
3. Cliquer sur le bouton « Me connecter ».

Attendu : l'URL devient /. Le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » s'affiche et le header montre le bouton « Se déconnecter ».

- [ ] Vérifié

### 4. Le toast d'arrivée

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| RM3, RM4 | 🟠 | Toast « Bienvenue Marc, ton compte est créé. » après un signup, « Content de te revoir Marc. » après un signin | SM-12, SM-13 |
| RM24, RM25 | 🟠 | Pas de toast après un rechargement, un « retour » navigateur, ou une ouverture directe de l'accueil avec session persistée | SM-14, SM-15, SM-16 |

---

### SM-12 : Toast d'arrivée après un signup (RM3)

> ✅ **Ce qu'on vérifie :**
> - En arrivant sur l'accueil après une création de compte, un toast affiche « Bienvenue Marc, ton compte est créé. ».
> - Smoke parce que le transport de l'origine « signup » jusqu'à l'accueil (contrainte technique 2) et l'affichage par Sonner sont réels. Le choix du message est couvert en unitaire.

Précondition : dev server lancé, aucune session, page /signup ouverte.

1. Saisir « Marc » dans le champ « Prénom ».
2. Saisir un email neuf dans le champ « Email ».
3. Saisir « motdepasse123 » dans le champ « Mot de passe ».
4. Cliquer sur le bouton « Créer un compte ».

Attendu : sur /, un toast s'affiche en haut à droite avec le texte « Bienvenue Marc, ton compte est créé. » et une croix pour le fermer. Un seul toast.

- [ ] Vérifié

---

### SM-13 : Toast d'arrivée après un signin (RM4)

> ✅ **Ce qu'on vérifie :**
> - En arrivant sur l'accueil après une connexion, un toast affiche « Content de te revoir Marc. ».
> - Smoke pour la même raison que SM-12 : transport réel de l'origine « signin » et affichage réel du toast.

Précondition : dev server lancé, compte Marc existant, aucune session, page /signin ouverte.

1. Saisir « marc@test.dev » dans le champ « Email ».
2. Saisir « motdepasse123 » dans le champ « Mot de passe ».
3. Cliquer sur le bouton « Me connecter ».

Attendu : sur /, un toast s'affiche en haut à droite avec le texte « Content de te revoir Marc. » (sans virgule avant le prénom) et une croix pour le fermer. Aucun toast « Bienvenue ».

- [ ] Vérifié

---

### SM-14 : Pas de toast après un rechargement (RM24)

> ✅ **Ce qu'on vérifie :**
> - Après l'arrivée avec toast, recharger la page n'affiche pas de nouveau toast.
> - Smoke parce que selon le moyen de transport de l'origine (contrainte technique 2), l'information peut survivre à un rechargement. Seul le vrai navigateur le montre.

Précondition : dev server lancé, SM-13 vient d'être joué : on est sur / connecté, le toast « Content de te revoir Marc. » a été affiché puis a disparu (fermé par la croix ou expiré).

1. Recharger la page (F5).

Attendu : l'accueil connecté s'affiche (« Qu'as-tu fait de beau aujourd'hui, Marc ? »), et aucun toast n'apparaît.

- [ ] Vérifié

---

### SM-15 : Pas de toast après un « retour » puis « suivant » navigateur (RM24)

> ✅ **Ce qu'on vérifie :**
> - Revenir sur l'accueil par l'historique du navigateur n'affiche pas de nouveau toast.
> - Smoke parce que l'historique du navigateur restaure l'état associé à chaque entrée : si l'origine est rangée dans cet état, le toast réapparaît. Seul le vrai navigateur le montre.

Précondition : dev server lancé, SM-13 vient d'être joué : on est sur / connecté, le toast a été affiché puis a disparu.

1. Cliquer sur le bouton « Précédent » du navigateur.
2. Cliquer sur le bouton « Suivant » du navigateur.

Attendu : après l'étape 2, l'URL est / et l'accueil connecté s'affiche, sans aucun toast.

- [ ] Vérifié

---

### SM-16 : Session persistée, ouverture directe de l'accueil sans toast (RM25)

> ✅ **Ce qu'on vérifie :**
> - Un utilisateur dont la session est persistée qui ouvre directement l'accueil voit la page personnalisée, sans toast.
> - Smoke parce qu'il faut une vraie session persistée par cookie et une vraie ouverture de page, sans passer par le signin ou le signup.

Précondition : dev server lancé, compte Marc existant, session ouverte sur ce compte, onglet de Kommit fermé.

1. Ouvrir la page / dans un nouvel onglet.

Attendu : le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » s'affiche, et aucun toast n'apparaît.

- [ ] Vérifié

### 5. Sign out et fin de session

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| RM5 | 🔴 | Clic sur « Se déconnecter » : session fermée, accueil en état visiteur, sans modale ni toast | SM-17 |
| RM31 | 🔴 | Session expirée : au chargement suivant, accueil en état visiteur, sans message | SM-18 |

---

### SM-17 : Déconnexion silencieuse (RM5)

> ✅ **Ce qu'on vérifie :**
> - Le clic sur « Se déconnecter » ferme la session côté serveur et l'accueil repasse en état visiteur, sans modale de confirmation ni toast.
> - Smoke parce que la fermeture de session est faite par l'API et que l'accueil doit se rafraîchir. Le rechargement de l'étape 2 confirme que la session est bien fermée côté serveur, et pas seulement masquée à l'écran.

Précondition : dev server lancé, compte Marc existant, session ouverte, page / ouverte en état connecté.

1. Cliquer sur le bouton « Se déconnecter ».
2. Recharger la page (F5).

Attendu : après l'étape 1, sans modale ni toast, l'accueil affiche « Prêt(e) pour ton daily standup ? » et le header montre les liens « Se connecter » et « Créer un compte ». Après l'étape 2, l'accueil est toujours en état visiteur.

- [ ] Vérifié

---

### SM-18 : Session expirée, accueil visiteur sans message (RM31)

> ✅ **Ce qu'on vérifie :**
> - Quand la session a expiré, le chargement suivant de l'accueil donne l'état visiteur, sans message d'erreur ni toast.
> - Smoke parce que c'est le backend qui doit traiter une session expirée comme absente, et le front qui ne doit rien afficher en erreur. La décision « session null → visiteur » est couverte en unitaire.

Précondition : dev server lancé, compte Marc existant, session ouverte, page / ouverte en état connecté. Puis, côté base, la date d'expiration (`expiresAt`) de cette session est passée dans le passé (Prisma Studio ou requête SQL sur la table des sessions). Le cookie reste présent dans le navigateur.

1. Recharger la page (F5).

Attendu : l'accueil affiche « Prêt(e) pour ton daily standup ? » avec les liens « Se connecter » et « Créer un compte ». Aucun toast, aucun message d'erreur, aucune redirection.

- [ ] Vérifié

### 6. RM issues du contrat d'API (hors ticket)

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| `TOO_MANY_ATTEMPTS` (sans n°) | 🟢 | Message du serveur affiché tel quel, en message global du formulaire | aucun smoke, couvert en unitaire |
| RM18, RM19 | 🟠 | Serveur injoignable : texte de panne du front en message global, bouton de nouveau utilisable. Le cas `INTERNAL_ERROR` (`message` du serveur) est couvert en unitaire | SM-19 |
| RM21 | 🟢 | Email normalisé (trim + minuscules) avant l'envoi | aucun smoke, couvert en unitaire |
| RM23 | 🔴 | Un prénom contenant du HTML s'affiche en texte brut dans le titre et le toast | SM-20 |

---

### SM-19 : Backend coupé, message de panne et action re-tentable (RM18, RM19)

> ✅ **Ce qu'on vérifie :**
> - Quand le serveur ne répond pas, le formulaire affiche un message de panne distinct des erreurs métier (pas le message d'identifiants invalides), et le bouton redevient utilisable pour réessayer.
> - Serveur injoignable est l'un des 2 seuls cas où le front affiche son propre texte (avec l'erreur inconnue). Toute réponse du backend, `INTERNAL_ERROR` compris, affiche son `message` tel quel : ce cas est couvert en unitaire, pas joué ici.
> - Smoke parce que l'échec réseau réel de `fetch` (backend coupé) n'a pas de code dans le contrat : le test unitaire en mocke la forme, seul le vrai navigateur la confirme.

Précondition : front lancé (`pnpm dev`), **backend arrêté**, aucune session, page /signin ouverte.

1. Saisir « marc@test.dev » dans le champ « Email ».
2. Saisir « motdepasse123 » dans le champ « Mot de passe ».
3. Cliquer sur le bouton « Me connecter ».
4. Cliquer de nouveau sur le bouton « Me connecter ».

Attendu :
- Après l'étape 3 : le message « Le serveur ne répond pas. Réessaie dans un instant. » s'affiche en haut du formulaire (pas sous un champ). Ce n'est pas le message d'identifiants invalides de RM13. On reste sur /signin, les champs gardent leur saisie, le bouton « Me connecter » est de nouveau actif (plus de spinner).
- Après l'étape 4 : une nouvelle tentative part (le spinner réapparaît brièvement), puis le même message s'affiche, une seule fois.

Si l'écran affiche seulement « Le serveur ne répond pas. » (le texte de l'`Error` levée par `src/lib/api/apiClient.ts`), l'erreur réseau est affichée brute au lieu de passer par le message de panne.

- [ ] Vérifié

---

### SM-20 : Prénom contenant du HTML, rendu en texte brut (RM23)

> ✅ **Ce qu'on vérifie :**
> - Un prénom « <b>Marc</b> » s'affiche tel quel, balises comprises, dans le titre de l'accueil et dans le toast, sans être mis en gras.
> - Smoke parce qu'aucun calcul n'est à nous : l'échappement vient de React (tant que `dangerouslySetInnerHTML` n'est pas utilisé). Ce qu'on vérifie est le rendu réel.

Précondition : dev server lancé, aucune session, page /signup ouverte.

1. Saisir « <b>Marc</b> » dans le champ « Prénom ».
2. Saisir un email neuf dans le champ « Email ».
3. Saisir « motdepasse123 » dans le champ « Mot de passe ».
4. Cliquer sur le bouton « Créer un compte ».

Attendu : sur /, le titre affiche littéralement « Qu'as-tu fait de beau aujourd'hui, <b>Marc</b> ? » et le toast affiche littéralement « Bienvenue <b>Marc</b>, ton compte est créé. ». Les caractères `<b>` et `</b>` sont visibles et « Marc » n'est pas en gras.

- [ ] Vérifié

### 7. Règles tranchées par l'utilisateur (hors ticket, hors contrat)

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| Arbitrage 1 (sans n°) | 🟢 | Email ou mot de passe fait uniquement d'espaces : bouton de soumission grisé, au signin comme au signup | aucun smoke, couvert en unitaire |
| Arbitrage 2 (sans n°) | 🟢 | Au signup, un email sans extension de domaine (`marc@test`) est invalide | aucun smoke, couvert en unitaire |
| Arbitrage 3 (sans n°) | 🟢 | `VALIDATION_ERROR` → `message` du serveur en message global, en haut du formulaire | aucun smoke, couvert en unitaire |
| Arbitrage 4 (sans n°) | 🟢 | Erreur inconnue → traitée comme une panne, texte du front « Le serveur ne répond pas. Réessaie dans un instant. » en haut du formulaire | aucun smoke, couvert en unitaire |
