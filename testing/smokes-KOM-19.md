# Smokes, KOM-19 « Renseigner son daily standup · frontend »

Scénarios écrits **avant** l'implémentation (test-first), à partir de `testing/inventaire-KOM-19.md`.
Après le code, chaque scénario est transcrit en e2e Playwright par `e2e-test-writer`.
Format : `docs/testing-strategy.md`, section « Format des smokes ». Mêmes paquets, mêmes lignes et même ordre que l'inventaire.

**Aucun scénario n'est jouable aujourd'hui** : le backend n'expose pas encore `GET /standups/today`, `POST /standups/conversation` ni `POST /standups`.

Conventions communes à tous les scénarios :

- **Dev server** : front lancé (`pnpm dev`, http://localhost:5173) et backend lancé (http://localhost:3000), sauf mention contraire.
- **Marc sans standup du jour** : un compte **neuf** de prénom « Marc » (email neuf, mot de passe « motdepasse123 »), créé et connecté juste avant le scénario. Un compte réutilisé peut déjà avoir un standup du jour, que le serveur garde jusqu'au lendemain (Europe/Paris).
- **Ancien standup** : le standup du jour de Marc, enregistré avant le scénario par un `POST /standups` direct sur l'API, avec la session de Marc et le corps `{ "summary": { "fait": ["Revue de code de la PR 42"], "blocages": [], "prevu": ["Préparer la démo"] } }`. Pas besoin de passer par l'IA : le serveur valide la forme du résumé, pas sa provenance (contrat, `PostStandupBody`).
- **Texte de daily** : « Hier j'ai terminé la migration de l'authentification. Aucun blocage. Aujourd'hui je déploie en DEV. » Il donne les 3 catégories d'un coup, pour que l'IA arrive vite au récap.
- **Mener la conversation jusqu'au récap** : répondre à chaque question de l'assistant dans le champ « Écrire un message ... » puis cliquer sur le bouton « Envoyer le message », jusqu'à ce que le récap s'affiche dans le fil (3 blocs titrés « Hier », « Blocages », « À venir », affichés en petites capitales). Le nombre de tours dépend de l'IA : cette étape est une boucle, pas une action unique.
- **Fin d'une réponse de l'IA** : le bouton « Envoyer le message » redevient actif (CA40).
- **Case du jour** : la case du calendrier pour aujourd'hui (Europe/Paris). Verte, c'est le bouton « Voir le résumé du daily du AAAA-MM-JJ ». Grise, elle n'a pas de bouton.
- **Réponses rapides** : hors périmètre (décision utilisateur). Aucun scénario ne les utilise, la validation passe uniquement par le bouton « Valider mon standup ».
- **Messages d'erreur** (décision utilisateur, comme KOM-07) : le front affiche le `message` de l'`ApiError` reçue dans l'événement SSE `error`, tel quel. Le backend n'étant pas écrit, le texte exact n'est pas connu : les « Attendu » citent « le `message` du serveur ».
- **Suite e2e** : chaque scénario indique sa suite. Tout scénario qui appelle l'IA va dans la suite non déterministe (`*.nondet.test.ts`).
- **Libellés** : repris de `src/data/daily.ts` et `src/data/home.ts`. Là où la maquette et le ticket divergent, le ticket prime. Libellés cités ici qui **n'existent pas encore dans le code** : le titre « Bravo, tu as renseigné ton standup du jour ! » (le code a celui de la maquette), le bouton « Valider mon standup », le bouton « Réessayer ». Éléments sans libellé fixé, désignés ici par leur rôle : le loader du titre (CA42), l'indicateur d'attente du chat (CA34), l'alerte de remplacement et son bouton de confirmation (CA9).
- **Libellé absent** : si un libellé désigné ici n'existe pas à l'écran, le smoke échoue à l'étape qui le cite. C'est soit un écart avec le ticket, soit un livrable manquant.

### 1. L'accueil et son titre conditionnel

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA1, CA8 | 🟠 | Titre « à faire » sans standup du jour, titre « déjà fait » avec, la zone de saisie présente dans les 2 cas | SM-1, SM-2 |
| CA42 | 🟠 | Tant que l'état du jour est inconnu, un loader remplace le titre, sans bascule d'un titre à l'autre | SM-3 |

---

### SM-1 : Standup du jour pas fait, titre « à faire » (CA1)

> ✅ **Ce qu'on vérifie :**
> - Sans standup du jour, l'accueil affiche « Qu'as-tu fait de beau aujourd'hui, Marc ? » et la zone de saisie.
> - Smoke parce que la valeur de `done` vient du vrai `GET /standups/today`, dont le serveur calcule « aujourd'hui » en Europe/Paris. Le choix du titre selon `done` est couvert en unitaire.

Suite : déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté.

1. Ouvrir la page /.

Attendu : le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » et le sous-titre « Renseigne ton daily du jour ci-dessous. » s'affichent. Le champ « Ton daily du jour » est vide et le bouton « Lancer le daily » est présent. La case du jour est grise.

- [ ] Vérifié

---

### SM-2 : Standup du jour déjà fait, titre « déjà fait » (CA8)

> ✅ **Ce qu'on vérifie :**
> - Avec un standup du jour, l'accueil affiche « Bravo, tu as renseigné ton standup du jour ! » (texte du ticket, décision utilisateur), et la zone de saisie reste présente.
> - Smoke pour la même raison que SM-1 : `done = true` doit venir du vrai serveur, sur le même jour que celui où le standup a été enregistré.

Suite : déterministe.

Précondition : dev server lancé, Marc connecté, ancien standup enregistré.

1. Ouvrir la page /.

Attendu : le titre « Bravo, tu as renseigné ton standup du jour ! » et le sous-titre « En renseignant ton daily du jour à nouveau, il remplacera l'existant. » s'affichent. Le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » n'est pas affiché. Le champ « Ton daily du jour » et le bouton « Lancer le daily » sont présents. La case du jour est verte.

Si le titre affiché est « Ton daily du jour est déjà renseigné, Marc ! », c'est le texte de la maquette, resté dans `src/data/daily.ts` : le smoke échoue.

- [ ] Vérifié

---

### SM-3 : Chargement de l'accueil, loader puis directement le bon titre (CA42)

> ✅ **Ce qu'on vérifie :**
> - Tant que `GET /standups/today` n'a pas répondu, aucun des 2 titres n'est affiché : un loader est à leur place. À la réponse, le titre « déjà fait » apparaît directement, sans passer par le titre « à faire ».
> - Smoke parce que l'absence réelle de bascule dépend de l'état de chargement de TanStack Query et de la latence du backend (cold start Render). La décision « état inconnu → loader » est couverte en unitaire.
> - Le scénario part d'un standup existant : le titre qui risque de s'afficher à tort pendant le chargement est « à faire », celui d'un `done` par défaut à `false`.

Suite : déterministe.

Précondition : dev server lancé, Marc connecté, ancien standup enregistré, réseau ralenti (devtools, profil « Slow 3G ») pour que le chargement dure assez longtemps pour être observé.

1. Ouvrir la page /.

Attendu : pendant le chargement, un loader occupe la place du titre, et ni « Qu'as-tu fait de beau aujourd'hui, Marc ? » ni « Bravo, tu as renseigné ton standup du jour ! » ne sont affichés. À la fin du chargement, le loader disparaît et « Bravo, tu as renseigné ton standup du jour ! » s'affiche. Le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » n'apparaît **à aucun moment**.

Le loader n'a pas de libellé dans le ticket ni dans `src/data/` : pour que l'e2e le cible, il lui faut un nom accessible (par exemple un rôle `status` avec un texte masqué).

- [ ] Vérifié

### 2. La conversation en streaming

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA2 | 🟠 | À l'envoi depuis l'accueil, la modale s'ouvre avec le texte saisi en 1er message, et l'IA répond | SM-4 |
| CA4, CA34 | 🟠 | Indicateur d'attente avant le 1er octet, puis réponse affichée au fil de l'eau | SM-5 |
| CA39 | 🟢 | Zone vide ou faite d'espaces : bouton d'envoi désactivé. Vaut pour la zone de l'accueil et pour le champ « Écrire un message ... » (décision utilisateur) | aucun smoke, couvert en unitaire |
| CA40 | 🟠 | Pendant que l'IA écrit, l'envoi d'un nouveau message est bloqué | SM-6 |

---

### SM-4 : Lancer le daily, la modale s'ouvre avec le texte saisi (CA2)

> ✅ **Ce qu'on vérifie :**
> - Le texte tapé sur l'accueil devient le 1er message du fil, côté utilisateur, et l'IA y répond.
> - Smoke parce que l'ouverture de la modale (base-ui) et la réponse de l'IA sont réelles. La construction du 1er message (`PostConversationBody.messages`) est couverte en unitaire.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».

Attendu : la modale « Daily Standup Assistant » s'ouvre. Le 1er message du fil est une bulle utilisateur (à droite, fond bleu) avec exactement le texte de daily. Ensuite une réponse de l'assistant (à gauche, fond bleu clair), non vide, s'affiche sous ce message.

- [ ] Vérifié

---

### SM-5 : Indicateur d'attente, puis réponse au fil de l'eau (CA4, CA34)

> ✅ **Ce qu'on vérifie :**
> - Entre l'envoi et le 1er morceau de réponse, un indicateur d'attente est visible dans le fil. Ensuite la réponse de l'IA s'écrit progressivement, au lieu d'apparaître d'un bloc.
> - Smoke parce que le streaming effectif (aucune mise en mémoire tampon par le réseau, un proxy ou l'hébergeur) et le cold start sont réels. La lecture du flux, l'accumulation des `token` et la décision d'attente sont couvertes en unitaire.
> - C'est aussi le seul endroit qui confirme le format réel des événements SSE sur le fil, que le contrat ne fixe pas.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte, réseau ralenti (devtools, profil « Slow 3G ») pour que l'attente soit observable.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».

Attendu : juste après l'ouverture de la modale, sous le 1er message, un indicateur d'attente est visible et aucune réponse de l'assistant n'est encore affichée. Dès que le 1er morceau de réponse arrive, l'indicateur disparaît et la bulle de l'assistant s'allonge en plusieurs fois avant d'être complète.

Si la réponse apparaît d'un coup après une longue attente, le flux est mis en mémoire tampon quelque part (lecture côté front, proxy de Vite ou hébergeur). L'indicateur n'a pas de libellé dans le ticket ni dans `src/data/` : l'e2e a besoin d'un nom accessible pour le cibler.

- [ ] Vérifié

---

### SM-6 : Envoi bloqué pendant que l'IA écrit (CA40)

> ✅ **Ce qu'on vérifie :**
> - Tant que la réponse de l'IA arrive, le bouton « Envoyer le message » est désactivé et la touche Entrée dans le champ n'envoie rien : jamais 2 flux en parallèle dans le même fil.
> - Smoke parce que la fin réelle du flux et le blocage effectif d'un envoi (clic ou Entrée sur un formulaire dont le bouton est désactivé) se vérifient dans le navigateur. La décision « flux en cours → envoi désactivé » est couverte en unitaire.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte, réseau ralenti (devtools, profil « Slow 3G ») pour que la réponse dure assez longtemps, onglet Réseau des devtools ouvert et vidé.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Pendant que la réponse de l'assistant s'écrit, saisir « Encore une chose » dans le champ « Écrire un message ... ».
4. Appuyer sur Entrée.

Attendu : pendant toute la réponse, le bouton « Envoyer le message » est désactivé. Après l'étape 4, aucune bulle utilisateur « Encore une chose » n'apparaît dans le fil, la réponse en cours continue de s'écrire, et l'onglet Réseau ne montre qu'**une seule** requête POST vers `http://localhost:3000/standups/conversation`. À la fin de la réponse, le bouton « Envoyer le message » redevient actif.

- [ ] Vérifié

### 3. Le récap et sa validation

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA5, CA10 | 🟢 | `StandupSummary` → 3 blocs, « Aucun » pour une liste vide, jamais dans les données | aucun smoke, couvert en unitaire |
| CA30 | 🔴 | Un récap contenant du HTML s'affiche en texte brut, sans exécution | SM-7 |
| CA26 | 🟢 | Le corps du `POST /standups` est `{ summary }` du dernier récap reçu, tel quel, sans date (décision utilisateur) | aucun smoke, couvert en unitaire |
| CA6, CA25 | 🟠 | « Valider mon standup » désactivé avant le récap ; au clic après le récap, enregistrement, fermeture de la modale, puis case du jour verte | SM-8, SM-9 |
| CA27 | 🟠 | Un re-clic sur « Valider mon standup » pendant l'enregistrement est ignoré | SM-10 |

---

### SM-7 : Récap avec une balise `<script>`, affiché en texte brut (CA30)

> ✅ **Ce qu'on vérifie :**
> - Un item du récap qui contient `<script>alert('xss')</script>` s'affiche tel quel, en texte, et le script ne s'exécute pas.
> - Smoke parce qu'il n'y a rien à calculer de notre côté : l'échappement vient de React tant que le code n'utilise pas `dangerouslySetInnerHTML`. Ce qu'on vérifie est le rendu réel.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir « Hier j'ai ajouté <script>alert('xss')</script> dans la page de test. Aucun blocage. Aujourd'hui je déploie en DEV. » dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Mener la conversation jusqu'au récap.

Attendu : dans le bloc « Hier » du récap, un item contient le texte littéral `<script>alert('xss')</script>`, chevrons visibles. Aucune boîte d'alerte du navigateur ne s'ouvre, ni pendant la conversation ni à l'affichage du récap. La 1re bulle utilisateur montre elle aussi la balise en texte.

Le scénario n'est **pas concluant** si l'IA a reformulé l'item sans recopier la balise : ce n'est pas un échec, il faut le rejouer.

- [ ] Vérifié

---

### SM-8 : « Valider mon standup » désactivé tant que le récap n'est pas arrivé (CA25)

> ✅ **Ce qu'on vérifie :**
> - Avant l'événement `summary`, le bouton « Valider mon standup » est visible mais désactivé.
> - Smoke parce que l'arrivée réelle de l'événement `summary` dans le flux est ce qui doit l'activer. La décision « `summary` reçu → bouton actif » est couverte en unitaire.
> - Le texte saisi ici est volontairement incomplet, pour que l'IA pose une question au lieu de produire le récap tout de suite.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir « Hier j'ai avancé sur l'authentification. » dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».

Attendu : dès l'ouverture de la modale, le bouton « Valider mon standup » est visible et désactivé. À la fin de la 1re réponse de l'assistant, si le fil ne contient pas de récap (pas de blocs « Hier », « Blocages », « À venir »), le bouton est toujours désactivé.

Si l'IA produit le récap dès sa 1re réponse, seule la 1re partie de l'attendu (pendant l'écriture de la réponse) est vérifiable.

- [ ] Vérifié

---

### SM-9 : Valider le standup, la modale se ferme puis la case du jour passe au vert (CA6, CA25)

> ✅ **Ce qu'on vérifie :**
> - Une fois le récap affiché, « Valider mon standup » est actif. Au clic, le standup est enregistré, la modale se ferme, et la case du jour passe au vert seulement après la fermeture.
> - Smoke parce que l'enregistrement réel, la fermeture de la modale et l'affichage du calendrier (KOM-22) sont réels. La décision d'activer le bouton est couverte en unitaire.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte. La case du jour est grise.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Mener la conversation jusqu'au récap.
4. Cliquer sur le bouton « Valider mon standup ».

Attendu : avant l'étape 4, le bouton « Valider mon standup » est actif et la case du jour, derrière la modale, est toujours grise. Après l'étape 4, la modale « Daily Standup Assistant » se ferme, sans confirmation « Le daily standup n'est pas encore validé. ». Sur l'accueil, la case du jour est verte (bouton « Voir le résumé du daily du AAAA-MM-JJ » présent pour aujourd'hui) et l'en-tête du calendrier indique « 1 daily renseigné(s) sur l'année ». Aucun message d'erreur.

- [ ] Vérifié

---

### SM-10 : Double-clic sur « Valider mon standup », un seul enregistrement (CA27)

> ✅ **Ce qu'on vérifie :**
> - Un double-clic sur « Valider mon standup » n'envoie qu'un `POST /standups` : le bouton est désactivé dès le 1er clic, tant que le serveur n'a pas répondu.
> - Smoke parce que l'état « en cours » vient de la vraie requête, et le nombre réel de requêtes ne se voit que dans le navigateur. La décision « enregistrement en cours → bouton désactivé » est couverte en unitaire.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte, réseau ralenti (devtools, profil « Slow 3G »), onglet Réseau des devtools ouvert.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Mener la conversation jusqu'au récap.
4. Double-cliquer sur le bouton « Valider mon standup ».

Attendu : tant que la réponse du serveur n'est pas arrivée, le bouton « Valider mon standup » est désactivé. L'onglet Réseau montre **une seule** requête POST vers `http://localhost:3000/standups`. À la réponse, la modale se ferme et la case du jour est verte.

- [ ] Vérifié

### 4. Fermer ou refaire un standup

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA7, CA44 | 🟠 | Fermer en pleine conversation (×, Échap, clic sur le voile), récap reçu non validé compris, ouvre la confirmation « Le daily standup n'est pas encore validé. » | SM-11, SM-12, SM-13, SM-14 |
| CA9 | 🟠 | Standup du jour existant : relancer affiche une alerte de remplacement ; à la confirmation, une nouvelle conversation démarre | SM-15 |
| CA41 | 🔴 | Après confirmation de l'alerte, fermer sans valider laisse l'ancien standup intact et la case du jour verte | SM-16 |

---

### SM-11 : Fermer par la croix en pleine conversation, confirmation (CA7, CA44)

> ✅ **Ce qu'on vérifie :**
> - Après au moins 1 message envoyé, le bouton « Fermer » du chat ouvre la confirmation au lieu de fermer la modale.
> - Smoke parce que l'interception de la fermeture par base-ui doit être câblée, et seul le navigateur montre qu'elle l'est. Le prédicat « conversation inachevée » est couvert en unitaire.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Une fois la 1re réponse de l'assistant terminée, cliquer sur le bouton « Fermer » de la modale « Daily Standup Assistant ».

Attendu : une popup s'ouvre au-dessus du chat, avec le titre « Le daily standup n'est pas encore validé. », le texte « En quittant cette conversation, tout l'échange sera définitivement perdu. Es-tu sûr de vouloir quitter ? » et les boutons « Poursuivre le daily » et « Quitter le daily ». Le chat reste ouvert derrière, avec ses messages.

- [ ] Vérifié

---

### SM-12 : Fermer par Échap en pleine conversation, confirmation (CA7, CA44)

> ✅ **Ce qu'on vérifie :**
> - Après au moins 1 message envoyé, la touche Échap ouvre la confirmation au lieu de fermer la modale.
> - Smoke parce que base-ui ferme sur Échap par défaut : seul le navigateur montre que la fermeture est interceptée.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Une fois la 1re réponse de l'assistant terminée, appuyer sur Échap.

Attendu : la popup « Le daily standup n'est pas encore validé. » s'ouvre, avec les boutons « Poursuivre le daily » et « Quitter le daily ». Le chat reste ouvert derrière, avec ses messages.

- [ ] Vérifié

---

### SM-13 : Fermer par un clic sur le voile en pleine conversation, confirmation (CA7, CA44)

> ✅ **Ce qu'on vérifie :**
> - Après au moins 1 message envoyé, un clic en dehors de la modale ouvre la confirmation au lieu de fermer la modale.
> - Smoke parce que base-ui ferme sur un clic extérieur par défaut : seul le navigateur montre que la fermeture est interceptée.

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Une fois la 1re réponse de l'assistant terminée, cliquer sur le voile assombri, en dehors de la modale (coin en haut à gauche de la fenêtre).

Attendu : la popup « Le daily standup n'est pas encore validé. » s'ouvre, avec les boutons « Poursuivre le daily » et « Quitter le daily ». Le chat reste ouvert derrière, avec ses messages.

Le voile n'a pas de libellé : c'est la seule étape du fichier qui se désigne par une position à l'écran.

- [ ] Vérifié

---

### SM-14 : Fermer avec un récap reçu mais non validé, confirmation (CA7, CA44)

> ✅ **Ce qu'on vérifie :**
> - Un récap affiché mais pas validé est perdu si on ferme : la confirmation s'ouvre aussi dans ce cas.
> - Smoke pour la même raison que SM-11 à SM-13. C'est le cas que la contrainte technique signale (« ce n'est pas "aucun récap reçu" »).

Suite : non déterministe.

Précondition : dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Mener la conversation jusqu'au récap.
4. Appuyer sur Échap.

Attendu : la popup « Le daily standup n'est pas encore validé. » s'ouvre, avec les boutons « Poursuivre le daily » et « Quitter le daily ». Le chat reste ouvert derrière, avec le récap et le bouton « Valider mon standup » actif.

- [ ] Vérifié

---

### SM-15 : Relancer un standup déjà fait, alerte de remplacement puis nouvelle conversation (CA9)

> ✅ **Ce qu'on vérifie :**
> - Avec un standup du jour existant, cliquer sur « Lancer le daily » ouvre d'abord une alerte qui prévient que le nouveau standup remplacera l'actuel. À la confirmation, la conversation démarre.
> - Smoke parce que l'état réel vient de `GET /standups/today` et que l'alerte est une modale base-ui. La décision « standup existant → alerte » est couverte en unitaire.

Suite : non déterministe.

Précondition : dev server lancé, Marc connecté, ancien standup enregistré, page / ouverte (titre « Bravo, tu as renseigné ton standup du jour ! »).

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Cliquer sur le bouton de confirmation de l'alerte.

Attendu : après l'étape 2, une alerte s'ouvre et dit que le nouveau standup remplacera celui du jour. La modale « Daily Standup Assistant » n'est pas encore ouverte. Après l'étape 3, l'alerte se ferme, la modale « Daily Standup Assistant » s'ouvre avec le texte de daily en 1er message, et l'assistant répond.

Ni le ticket ni la maquette ne donnent le titre, le texte ni les libellés des boutons de cette alerte : l'étape 3 ne pourra être transcrite qu'une fois ces libellés fixés dans `src/data/daily.ts`.

- [ ] Vérifié

---

### SM-16 : Relancer puis quitter sans valider, l'ancien standup reste intact (CA41)

> ✅ **Ce qu'on vérifie :**
> - Confirmer l'alerte de remplacement puis quitter la conversation sans valider ne touche pas à l'ancien standup : la case du jour reste verte et son résumé est inchangé, y compris après un rechargement.
> - Smoke parce qu'il n'y a rien à calculer de notre côté (rien n'est envoyé avant « Valider ») : ce qu'on vérifie est la persistance réelle côté serveur et l'affichage réel du calendrier (KOM-22).

Suite : non déterministe.

Précondition : dev server lancé, Marc connecté, ancien standup enregistré, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Cliquer sur le bouton de confirmation de l'alerte.
4. Cliquer sur le bouton « Fermer » de la modale « Daily Standup Assistant ».
5. Cliquer sur le bouton « Quitter le daily ».
6. Recharger la page (F5).
7. Cliquer sur la case du jour (bouton « Voir le résumé du daily du AAAA-MM-JJ »).

Attendu :
- Après l'étape 5 : les 2 modales sont fermées, la case du jour est toujours verte.
- Après l'étape 6 : le titre « Bravo, tu as renseigné ton standup du jour ! » s'affiche, la case du jour est verte, l'en-tête du calendrier indique « 1 daily renseigné(s) sur l'année ».
- Après l'étape 7 : le résumé du jour montre l'ancien standup, « Revue de code de la PR 42 » sous « Hier », « Aucun » sous « Blocages », « Préparer la démo » sous « À venir ». Aucun item tiré du texte de daily (migration de l'authentification, déploiement en DEV).

Ce scénario a 7 étapes : il dépasse la taille d'un smoke, parce que CA41 enchaîne l'alerte de CA9, la fermeture de CA7 et une vérification après rechargement.

- [ ] Vérifié

### 5. Les erreurs du flux

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA29, CA31, CA32 | 🟠 | Un événement SSE `error` affiche le `message` du serveur et « Réessayer », sans perdre le fil. `LLM_QUOTA_EXCEEDED` et `LLM_UNAVAILABLE` donnent des messages distincts. Après `SUMMARY_MALFORMED`, « Valider mon standup » reste désactivé | SM-17, SM-18, SM-19 |

---

### SM-17 : IA indisponible, message et « Réessayer » sans perdre le fil (CA29, CA31)

> ✅ **Ce qu'on vérifie :**
> - Quand le provider LLM ne répond pas, le chat affiche le `message` du serveur pour `LLM_UNAVAILABLE` et un bouton « Réessayer », sans effacer le 1er message. « Réessayer » renvoie le même fil et la conversation reprend.
> - Smoke parce que la forme réelle de l'erreur au milieu du flux (`{ type: 'error', error: ApiError }` après des en-têtes `200`) n'est confirmée que par le vrai backend. Le mapping, la conservation de l'historique et le fil renvoyé sont couverts en unitaire.

Suite : non déterministe.

Précondition : front lancé, Marc sans standup du jour, connecté, page / ouverte. Backend lancé avec un provider LLM injoignable (URL du provider pointée sur un port fermé, ou clé d'API invalide : voir la note), onglet Réseau des devtools ouvert.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Hors navigateur, rétablir la configuration du provider LLM et redémarrer le backend.
4. Cliquer sur le bouton « Réessayer ».

Attendu :
- Après l'étape 2 : la modale reste ouverte, le 1er message (texte de daily) est toujours dans le fil, le `message` du serveur pour `LLM_UNAVAILABLE` s'affiche avec le bouton « Réessayer ». Le bouton « Valider mon standup » est désactivé.
- Après l'étape 4 : le message d'erreur et le bouton « Réessayer » disparaissent, le 1er message est toujours là, **une seule fois**, et l'assistant répond. L'onglet Réseau montre une nouvelle requête POST vers `http://localhost:3000/standups/conversation` dont le corps contient le même fil (le texte de daily en 1er message `user`).

L'étape 3 n'est pas une action dans le navigateur : l'e2e devra la remplacer (par exemple 2 backends, ou un interrupteur côté backend). À confirmer côté backend : une clé invalide (401 du provider) donne-t-elle bien `LLM_UNAVAILABLE`, et en événement SSE plutôt qu'en code HTTP ? Le contrat ne cite que 500, 503 et timeout.

- [ ] Vérifié

---

### SM-18 : Quota LLM dépassé, message distinct (CA29, CA32)

> ✅ **Ce qu'on vérifie :**
> - Quand le quota du provider est dépassé, le chat affiche le `message` du serveur pour `LLM_QUOTA_EXCEEDED`, différent de celui de `LLM_UNAVAILABLE` (SM-17), avec le bouton « Réessayer », sans perdre le fil.
> - Smoke pour la même raison que SM-17 : forme réelle de l'erreur dans le flux.

Suite : non déterministe.

Précondition : **impossible à provoquer à la demande.** Il faut une clé d'API dont le quota Groq est épuisé (le quota est par clé, contrat `LLM_QUOTA_EXCEEDED`). Dev server lancé avec cette clé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».

Attendu : la modale reste ouverte, le 1er message est toujours dans le fil, le `message` du serveur pour `LLM_QUOTA_EXCEEDED` s'affiche avec le bouton « Réessayer ». Ce texte est différent de celui affiché dans SM-17. Le bouton « Valider mon standup » est désactivé.

Comme le front affiche le `message` du serveur, la distinction entre les 2 messages est garantie par le backend, pas par le front.

- [ ] Vérifié

---

### SM-19 : Récap non conforme, validation impossible (CA29, CA32)

> ✅ **Ce qu'on vérifie :**
> - Quand l'IA produit un récap qui ne respecte pas la forme d'un `StandupSummary`, le chat affiche le `message` du serveur pour `SUMMARY_MALFORMED` et « Réessayer », aucun récap n'est dessiné, et « Valider mon standup » reste désactivé.
> - Smoke pour la même raison que SM-17. La décision « `SUMMARY_MALFORMED` → pas de validation » est couverte en unitaire.

Suite : non déterministe.

Précondition : **impossible à provoquer à la demande.** Il faut que le LLM rende un récap mal formé (JSON invalide, catégorie manquante), ce qu'aucune saisie ne garantit. Dev server lancé, Marc sans standup du jour, connecté, page / ouverte.

1. Saisir le texte de daily dans le champ « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Mener la conversation jusqu'au moment où le récap devrait arriver.

Attendu : à la place du récap, le `message` du serveur pour `SUMMARY_MALFORMED` s'affiche avec le bouton « Réessayer ». Aucun bloc « Hier », « Blocages », « À venir » n'est dessiné. Les messages précédents sont toujours dans le fil. Le bouton « Valider mon standup » est désactivé.

- [ ] Vérifié
