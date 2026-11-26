# Smokes, KOM-22 « Consulter son calendrier de standups · frontend »

Scénarios écrits **avant** l'implémentation (test-first), à partir de `testing/inventaire-KOM-22.md`.
Après le code, chaque scénario est transcrit en e2e Playwright par `e2e-test-writer`.
Format : `docs/testing-strategy.md`, section « Format des smokes ». Mêmes paquets, mêmes lignes et même ordre que l'inventaire.

**Aucun scénario n'est jouable aujourd'hui** : le backend n'expose pas encore les routes `/standups` (`GET /standups?from&to`, `GET /standups/:jour`, `POST /standups`).

Conventions communes à tous les scénarios :

- **Dev server** : front lancé (`pnpm dev`, http://localhost:5173) et backend lancé (http://localhost:3000), sauf mention contraire.
- **Compte de test** : « le compte Marc » = un compte existant de prénom « Marc », email « marc@test.dev », mot de passe « motdepasse123 », avec une session ouverte dans le navigateur (signin fait plus tôt). Sauf mention contraire, il n'a **aucun** standup en base avant le scénario.
- **Jours** : « J » = aujourd'hui en Europe/Paris, « J-1 » = hier, etc. Dans un libellé, un jour s'écrit au format `YYYY-MM-DD` (ex. J = 2026-11-26, J-1 = 2026-11-25). En toutes lettres, il suit le format de la modale (ex. « mercredi 25 novembre 2026 »).
- **Standup en base** : `POST /standups` n'enregistre que pour J (le serveur impose le jour) et il n'existe aucune route de suppression. Un standup daté d'un autre jour que J, ou une suppression, se fait donc **directement en base** (table des standups, rattaché au compte Marc). Les préconditions qui le demandent sont marquées **[base]**. Un standup de J peut passer par `POST /standups` avec la session de Marc, marqué **[API]**.
- **Libellés** : repris de `src/data/daily.ts` et de `maquettes/F2/FLOW.md` (le ticket prime là où ils divergent). Une case verte n'a pas de texte visible : on la désigne par son nom accessible, « Voir le résumé du daily du <jour> » (`calendar.openDayLabel`). Les titres de sections du résumé s'affichent en capitales (« HIER », « BLOCAGES », « À VENIR ») mais leur texte est « Hier », « Blocages », « À venir ».
- **Messages d'erreur** (décision utilisateur) : le front affiche le `message` de l'`ApiError` renvoyée par le backend, comme pour KOM-07. Le texte du front « Le serveur ne répond pas. Réessaie dans un instant. » ne sert que pour le serveur injoignable ou la requête qui n'aboutit pas.
- **Libellé absent** : si un libellé désigné ici n'existe pas à l'écran, le smoke échoue à l'étape qui le cite. C'est soit un écart avec la maquette, soit un livrable manquant.

### 1. Affichage du calendrier

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA11 | 🟠 | L'en-tête affiche le `count` du serveur pour la fenêtre de 53 semaines, égal au nombre de cases vertes ; un standup hors fenêtre n'est ni compté ni affiché | SM-1 |
| CA12 | 🟠 | Le standup de J donne une case verte dans la dernière colonne, les autres jours restent gris | SM-2 |
| CA13 | 🟢 | Jours futurs de la semaine en cours vides | aucun smoke, couvert en unitaire |
| CA37 | 🟢 | Dates pièges (29 mars, 25 octobre, 29 février) sans case décalée, dupliquée ni manquante | aucun smoke, couvert en unitaire |

---

### SM-1 : Compteur du serveur égal aux cases vertes de la fenêtre (CA11)

> ✅ **Ce qu'on vérifie :**
> - L'en-tête du calendrier affiche le `count` renvoyé par `GET /standups?from&to`, tel quel, et ce chiffre est égal au nombre de cases vertes.
> - Un standup plus vieux que la fenêtre de 53 semaines n'est ni compté ni affiché : les bornes `from` / `to` envoyées par le front sont bien celles de la grille.
> - Smoke parce que le `count` n'est pas calculé par le front : sa cohérence avec les cases vertes dépend du backend et des bornes réellement envoyées. La géométrie de la grille (53 semaines, début le dimanche) et les bornes sont couvertes en unitaire.

Précondition : dev server lancé, compte Marc connecté. **[base]** 4 standups pour Marc : J-1, J-8, J-100 (dans la fenêtre) et J-400 (hors fenêtre).

1. Ouvrir la page /.

Attendu : l'en-tête du calendrier affiche « 3 daily renseigné(s) sur l'année ». Exactement 3 cases vertes sont présentes : « Voir le résumé du daily du <J-1> », « Voir le résumé du daily du <J-8> », « Voir le résumé du daily du <J-100> ». Aucune case « Voir le résumé du daily du <J-400> ». Aucun message d'erreur.

- [ ] Vérifié

---

### SM-2 : Standup du jour, case verte dans la dernière colonne (CA12)

> ✅ **Ce qu'on vérifie :**
> - Le jour renvoyé par le serveur pour le standup de J tombe sur la case de J, dans la dernière colonne (semaine en cours), cerclée de vert. Les autres cases restent grises.
> - Smoke parce que le jour est imposé par le serveur en Europe/Paris et que la case est placée par le calcul « aujourd'hui » du front : les 2 doivent coïncider sur un vrai standup. La décision « jour renvoyé → case renseignée » est couverte en unitaire, la couleur est du CSS.

Précondition : dev server lancé, compte Marc connecté. **[API]** 1 standup enregistré pour J via `POST /standups`.

1. Ouvrir la page /.

Attendu : l'en-tête affiche « 1 daily renseigné(s) sur l'année ». La seule case verte est « Voir le résumé du daily du <J> », avec un liseré vert, dans la dernière colonne de la grille, sur la ligne du jour de la semaine de J. Toutes les autres cases passées sont grises. À jouer de préférence entre 00h00 et 02h00 heure de Paris : si la case verte tombe sur J-1 ou si le libellé porte une autre date que J, le front calcule « aujourd'hui » dans un autre fuseau que le serveur.

- [ ] Vérifié

### 2. Consulter le résumé d'un jour

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA14 | 🔴 | Clic sur une case verte : la modale résumé du jour s'ouvre, en lecture seule | SM-3 |
| CA15 | 🔴 | Clic sur une case grise : ni modale ni requête | SM-4 |
| CA46 | 🟠 | Pendant le chargement du résumé, la modale affiche un état de chargement | SM-5 |
| CA30 | 🟠 | Un résumé contenant du HTML s'affiche en texte brut, une catégorie vide affiche « Aucun » | SM-6 |
| CA45 | 🟠 | `STANDUP_NOT_FOUND` : pas de modale, message du serveur, calendrier rafraîchi, case redevenue grise | SM-7 |

---

### SM-3 : Clic sur une case verte, résumé en lecture seule (CA14)

> ✅ **Ce qu'on vérifie :**
> - Le clic sur une case verte appelle `GET /standups/:jour` et ouvre la modale résumé de ce jour, avec sa date et ses 3 sections, sans aucun champ de saisie.
> - Smoke parce que l'ouverture réelle de la modale (base-ui), l'appel au serveur et l'absence de champ sont du rendu et du branchement. Quelles cases sont cliquables est couvert par CA12.

Précondition : dev server lancé, compte Marc connecté. **[base]** 1 standup pour Marc à J-1, résumé : Hier = [« Migration de l'authentification terminée »], Blocages = [« Accès DEV en attente »], À venir = [« Déploiement en DEV »]. Page / ouverte.

1. Cliquer sur la case « Voir le résumé du daily du <J-1> ».

Attendu : une modale s'ouvre avec le titre « Daily Standup Assistant » et la mention « En date du <J-1 en toutes lettres> » (ex. « En date du mercredi 25 novembre 2026 »). Elle affiche « Voici le résumé du daily du <J-1 en toutes lettres> », puis les sections « Hier » (« Migration de l'authentification terminée »), « Blocages » (« Accès DEV en attente ») et « À venir » (« Déploiement en DEV »). Aucun champ « Écrire un message ... », aucun bouton « Envoyer le message ». Le bouton « Fermer » est présent. L'URL reste /.

- [ ] Vérifié

---

### SM-4 : Clic sur une case grise, rien ne se passe (CA15)

> ✅ **Ce qu'on vérifie :**
> - Le clic sur une case grise n'ouvre aucune modale et n'envoie aucune requête `GET /standups/:jour`.
> - Smoke parce que c'est l'absence réelle de modale et de requête au clic qu'on vérifie. La décision « case grise non cliquable » est couverte par CA12.

Précondition : dev server lancé, compte Marc connecté. **[base]** 1 standup pour Marc à J-1, aucun à J-2. Page / ouverte, onglet Réseau des outils de développement ouvert.

1. Cliquer sur la case grise de J-2 (dans la grille, juste avant la case verte « Voir le résumé du daily du <J-1> »).

Attendu : aucune modale ne s'ouvre (pas de « Daily Standup Assistant » à l'écran), aucune requête vers `/standups/<J-2>` n'apparaît dans l'onglet Réseau, la page reste sur / sans changement.

Note : une case grise n'a aujourd'hui ni texte visible ni nom accessible, l'étape ne peut donc pas la désigner par un libellé. Pour la transcription en e2e, il faudra lui donner un nom accessible (voir le rapport).

- [ ] Vérifié

---

### SM-5 : État de chargement pendant la demande du résumé (CA46)

> ✅ **Ce qu'on vérifie :**
> - Entre le clic sur une case verte et la réponse de `GET /standups/:jour`, la modale affiche un état de chargement, puis le résumé le remplace.
> - Smoke parce que l'état « requête en cours » réel vient de TanStack Query et du réseau. La décision « requête en cours → état de chargement » est couverte en unitaire.

Précondition : dev server lancé, compte Marc connecté. **[base]** 1 standup pour Marc à J-1 (résumé quelconque). Page / ouverte. Réseau ralenti dans les outils de développement (profil « Slow 3G ») ; en e2e, réponse de `GET /standups/<J-1>` retardée de quelques secondes.

1. Cliquer sur la case « Voir le résumé du daily du <J-1> ».

Attendu : la modale « Daily Standup Assistant » s'ouvre tout de suite et affiche un état de chargement à la place du résumé, sans sections « Hier » / « Blocages » / « À venir » et sans modale vide. Quand la réponse arrive, l'état de chargement disparaît et le résumé de J-1 s'affiche. Le libellé de l'état de chargement n'existe ni dans le ticket ni dans `src/data/daily.ts` : il reste à fixer, et le scénario devra le citer.

- [ ] Vérifié

---

### SM-6 : Résumé contenant du HTML affiché en texte brut, catégorie vide « Aucun » (CA30)

> ✅ **Ce qu'on vérifie :**
> - Un item contenant des balises HTML s'affiche littéralement, sans exécution de script ni mise en forme.
> - Une catégorie dont la liste est vide (`[]`) affiche « Aucun ».
> - Smoke parce que le texte brut vient de l'échappement de React, que seul le rendu réel vérifie. La décision « liste vide → Aucun » est couverte en unitaire.

Précondition : dev server lancé, compte Marc connecté. **[API]** 1 standup enregistré pour J via `POST /standups`, résumé : Hier = [« <script>alert(1)</script> », « <b>gras</b> »], Blocages = [], À venir = [« Déploiement en DEV »]. Page / ouverte.

1. Cliquer sur la case « Voir le résumé du daily du <J> ».

Attendu : la modale résumé s'ouvre. Sous « Hier », les items « <script>alert(1)</script> » et « <b>gras</b> » s'affichent tels quels, balises comprises, et « gras » n'est pas en gras. Aucune boîte d'alerte du navigateur ne s'ouvre. Sous « Blocages », l'item « Aucun » s'affiche. Sous « À venir », « Déploiement en DEV ».

- [ ] Vérifié

---

### SM-7 : Standup disparu, message du serveur et calendrier rafraîchi (CA45)

> ✅ **Ce qu'on vérifie :**
> - Quand `GET /standups/:jour` renvoie `STANDUP_NOT_FOUND`, aucune modale ne s'ouvre (ni vide, ni en chargement qui reste), le `message` de l'`ApiError` s'affiche, et le calendrier est rechargé : la case redevient grise et le compteur baisse.
> - Smoke parce que la suppression est du backend et que le rafraîchissement réel dépend de TanStack Query et du serveur. Le mapping « `STANDUP_NOT_FOUND` → pas de modale, message, rafraîchir » est couvert en unitaire.

Précondition : dev server lancé, compte Marc connecté. **[base]** 1 standup pour Marc à J-1. La suppression de l'étape 2 se fait aussi **[base]** (aucune route de suppression).

1. Ouvrir la page /.
2. Supprimer en base le standup de Marc à J-1, sans recharger la page.
3. Cliquer sur la case « Voir le résumé du daily du <J-1> ».

Attendu : aucune modale « Daily Standup Assistant » ne s'ouvre. Le `message` de l'`ApiError` `STANDUP_NOT_FOUND` renvoyé par le backend s'affiche (texte exact à reprendre du backend quand la route existera ; le ticket donne en exemple « ce standup n'existe plus, le calendrier a été mis à jour »). Le calendrier se met à jour sans rechargement de la page : l'en-tête affiche « 0 daily renseigné(s) sur l'année » et la case « Voir le résumé du daily du <J-1> » n'existe plus.

Note : en jeu manuel, revenir sur le navigateur après l'étape 2 peut déclencher le rechargement automatique du calendrier au retour du focus (TanStack Query) : la case serait déjà grise avant l'étape 3 et le scénario ne testerait plus rien. Faire la suppression sans quitter la fenêtre du navigateur (script lancé en arrière-plan) ; en e2e, la suppression passe par un script, sans changement de focus.

- [ ] Vérifié

### 3. Erreurs et isolation

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA43 | 🟠 | Compte sans standup : grille pleine de cases grises. Échec du chargement : aucune case, un message d'erreur | SM-8, SM-9 |

---

### SM-8 : Compte sans standup, grille grise (CA43)

> ✅ **Ce qu'on vérifie :**
> - Une réponse réussie sans aucun jour affiche le calendrier complet, toutes cases grises, avec « 0 » dans l'en-tête et sans message d'erreur.
> - Smoke parce que la réponse vide vient du vrai backend. La décision « succès vide → grille grise » est couverte en unitaire.

Précondition : dev server lancé, compte Marc connecté, aucun standup pour Marc.

1. Ouvrir la page /.

Attendu : le calendrier s'affiche avec l'en-tête « 0 daily renseigné(s) sur l'année », les libellés de mois, les libellés de lignes « Lun », « Mer », « Ven », la légende « Daily non renseigné » / « Daily enregistré » et une grille de cases grises. Aucune case « Voir le résumé du daily du … ». Aucun message d'erreur.

- [ ] Vérifié

---

### SM-9 : Échec du chargement du calendrier, message au lieu de la grille (CA43)

> ✅ **Ce qu'on vérifie :**
> - Quand `GET /standups?from&to` n'aboutit pas, le calendrier n'affiche aucune case ni compteur, mais un message d'erreur : l'utilisateur ne peut pas confondre l'échec avec « aucun standup ».
> - Smoke parce que l'échec réel (requête bloquée, serveur en panne) ne se confirme que dans le navigateur. La décision « échec → message » est couverte en unitaire.

Précondition : dev server lancé, compte Marc connecté. Dans les outils de développement, requêtes bloquées sur le motif `*/standups?*` (seul le calendrier échoue : la session reste lisible, sinon l'accueil passerait en état visiteur). En e2e, même blocage par interception de la route.

1. Ouvrir la page /.

Attendu : l'accueil connecté s'affiche (titre avec « Marc »), mais à la place de la grille le message « Le serveur ne répond pas. Réessaie dans un instant. » s'affiche. Aucune case grise ni verte, et pas d'en-tête « 0 daily renseigné(s) sur l'année ». Variante si le backend répond une erreur 5xx au lieu d'être bloqué : c'est le `message` de l'`ApiError` (`INTERNAL_ERROR`) qui s'affiche, avec le même reste d'écran.

- [ ] Vérifié
