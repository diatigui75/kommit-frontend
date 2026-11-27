# Smokes, KOM-19 « Renseigner son daily standup · frontend »

Scénarios écrits **avant** l'implémentation (test-first), à partir de `testing/inventaire-KOM-19.md`.
Après le code, chaque scénario est transcrit en e2e Playwright par `e2e-test-writer`.
Format : `docs/testing-strategy.md`, section « Format des smokes ». Mêmes paquets, mêmes lignes et même ordre que l'inventaire.

Conventions communes à tous les scénarios :

- **Dev server** : front lancé (`pnpm dev`, http://localhost:5173) et backend lancé (http://localhost:3000) avec une clé Groq valide, sauf mention contraire. Les routes du standup sont à la racine du backend : `http://localhost:3000/standups/...` (pas de préfixe `/api`).
- **Libellés** : repris de `src/data/standup.ts` et des composants de `src/components/pages/Home/` (maquette F2 intégrée). La zone de saisie de l'accueil a pour libellé accessible « Ton daily du jour ». Le champ de message de la modale a pour libellé « Écrire un message … », son bouton d'envoi « Envoyer », la croix de la modale « Fermer la conversation ». Le loader de l'accueil a pour nom accessible « Chargement du daily du jour ».
- **Bouton de validation** : le ticket écrit « Valider mon standup » (CA6), la maquette et `src/data/standup.ts` écrivent « Oui, je valide le daily ». Les scénarios suivent la maquette, que le ticket reprend dans sa section Maquette.
- **Compte sans standup du jour** : un compte neuf de prénom « Marc » (signup avec un email neuf, par exemple « marc+<horodatage>@test.dev », mot de passe « motdepasse123 »), session ouverte. Un compte neuf n'a aucun standup.
- **Compte avec standup du jour** : le même compte, après un daily validé plus tôt (SM-9), ou après un `POST http://localhost:3000/standups` envoyé avec le cookie de session et le corps `{"summary":{"fait":["Ancien standup : page de connexion"],"blocages":[],"prevu":["Calendrier"]}}`.
- **Texte de départ** : « le texte de départ » = « Hier j'ai terminé la page de connexion. Aucun blocage. Demain je commence le calendrier. ». Il couvre les 3 catégories pour que l'IA arrive vite au récap.
- **Non déterministe** : tout scénario qui attend une vraie réponse de l'IA est marqué « (LLM) ». Sa transcription e2e relève de la suite `*.nondet.test.ts`. L'étape « Répondre aux questions de l'IA jusqu'à l'affichage du récap » regroupe un nombre de tours qui dépend du LLM : à chaque tour, saisir une réponse courte dans le champ « Écrire un message … » puis cliquer sur « Envoyer ».
- **Carré du jour et compteur** : dans `YearCalendar`, les carrés n'ont ni texte ni libellé accessible. Le carré du jour se vérifie à l'œil (liseré vert, comme la légende « Daily enregistré »). Le compteur « N daily renseigné(s) sur l'année » sert de preuve lisible par Playwright.
- **Libellé absent** : si un libellé désigné ici n'existe pas à l'écran, le smoke échoue à l'étape qui le cite. C'est soit un écart avec la maquette, soit un livrable manquant.

### 1. L'accueil et son titre conditionnel

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA1, CA8 | 🟠 | Titre « à faire » avec le prénom, ou « déjà fait », selon le vrai `GET /standups/today`, zone de saisie présente dans les 2 cas | SM-1, SM-2 |
| CA42 | 🟠 | Loader tant que l'état du jour est inconnu, puis le bon titre, sans bascule visible | SM-3 |

---

### SM-1 : Standup du jour pas encore fait, titre avec le prénom (CA1)

> ✅ **Ce qu'on vérifie :**
> - Sans standup du jour, l'accueil affiche « Qu'as-tu fait de beau aujourd'hui, Marc ? » et la zone de saisie.
> - Smoke parce que la valeur de `done` vient du vrai `GET /standups/today`, et que le serveur décide du jour en fuseau Europe/Paris. Le choix du titre à partir de `done` est couvert en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte.

1. Ouvrir la page /.

Attendu : le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » et le sous-titre « Renseigne ton daily du jour ci-dessous. » s'affichent. La zone « Ton daily du jour » est présente avec le bouton « Lancer le daily ». Le titre « Bravo, tu as renseigné ton standup du jour ! » n'est pas affiché. Le compteur affiche « 0 daily renseigné(s) sur l'année ».

- [ ] Vérifié

---

### SM-2 : Standup du jour déjà fait, titre de félicitation (CA8)

> ✅ **Ce qu'on vérifie :**
> - Avec un standup du jour enregistré, l'accueil affiche « Bravo, tu as renseigné ton standup du jour ! », et la zone de saisie reste présente.
> - Smoke pour la même raison que SM-1 : `done` vient du vrai backend.

Précondition : dev server lancé, compte avec standup du jour, session ouverte.

1. Ouvrir la page /.

Attendu : le titre « Bravo, tu as renseigné ton standup du jour ! » et le sous-titre « En renseignant ton daily du jour à nouveau, il remplacera l'existant. » s'affichent. Le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » n'est pas affiché. La zone « Ton daily du jour » et le bouton « Lancer le daily » sont toujours présents. Le carré du jour a le liseré vert.

- [ ] Vérifié

---

### SM-3 : État du jour inconnu, loader à la place du titre (CA42)

> ✅ **Ce qu'on vérifie :**
> - Tant que `GET /standups/today` n'a pas répondu, aucun des 2 titres n'est visible, un loader les remplace. À la réponse, le bon titre apparaît directement, sans passer par l'autre.
> - Smoke parce que la bascule visible dépend du vrai temps de réponse (cold start de Render) et de l'état de chargement réel de TanStack Query. La décision « état inconnu → pas de titre » est couverte en unitaire.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, réseau ralenti (devtools, profil « Slow 3G »).

1. Ouvrir la page /.

Attendu : pendant le chargement, le loader « Chargement du daily du jour » tourne à l'emplacement du titre, et ni « Qu'as-tu fait de beau aujourd'hui, Marc ? » ni « Bravo, tu as renseigné ton standup du jour ! » ne s'affichent. À la réponse, le loader disparaît et « Bravo, tu as renseigné ton standup du jour ! » s'affiche. À aucun moment le titre « Qu'as-tu fait de beau aujourd'hui, Marc ? » n'apparaît, même brièvement.

- [ ] Vérifié

### 2. La conversation en streaming

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA2 | 🟠 | Le texte de l'accueil devient le 1er message de la modale, l'IA enchaîne | SM-4 |
| CA4, CA34 | 🟠 | « L'assistant écrit… » avant le 1er token, puis réponse affichée au fil de l'eau | SM-5 |
| CA39 | 🟢 | Zone vide ou faite d'espaces : bouton d'envoi désactivé, sur l'accueil et dans la modale | aucun smoke, couvert en unitaire |
| CA40 | 🟠 | Pendant que l'IA écrit, « Envoyer » est désactivé, un seul flux part | SM-6 |

---

### SM-4 : Le texte de l'accueil ouvre la conversation (CA2) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Cliquer sur « Lancer le daily » ouvre la modale de conversation, avec le texte tapé comme 1er message de l'utilisateur, puis une réponse de l'IA.
> - Smoke parce que l'ouverture de la modale vient de base-ui et la réponse de l'IA du vrai backend. La construction du corps envoyé est couverte en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, page / ouverte, onglet Réseau des devtools ouvert et vidé.

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».

Attendu : la modale « Daily Standup Assistant » s'ouvre. Le 1er message du fil est le texte de départ, à l'identique, en bulle utilisateur (à droite). Une réponse de l'IA apparaît ensuite en dessous, à gauche. L'onglet Réseau montre un `POST http://localhost:3000/standups/conversation` dont le corps contient `messages` avec ce texte en `role: "user"`.

- [ ] Vérifié

---

### SM-5 : Indicateur d'attente puis réponse au fil de l'eau (CA4, CA34) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Avant le 1er token, « L'assistant écrit… » est visible dans le fil. Ensuite, le texte de l'IA s'allonge progressivement au lieu d'arriver d'un bloc.
> - Smoke parce que l'arrivée progressive réelle dépend de `fetch` + `ReadableStream`, du réseau et du cold start. La lecture du flux, la concaténation et la décision d'afficher l'indicateur sont couvertes en unitaire.

Précondition : dev server lancé, backend **tout juste redémarré** (pour un 1er octet plus lent), compte sans standup du jour, session ouverte, page / ouverte.

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».

Attendu : juste après l'ouverture de la modale, sous le message de l'utilisateur, une bulle de l'IA affiche un spinner et « L'assistant écrit… ». Dès le 1er token, cette bulle est remplacée par le texte de l'IA, qui s'allonge par morceaux successifs jusqu'à la fin de la réponse. « L'assistant écrit… » n'est plus visible une fois le texte commencé.

- [ ] Vérifié

---

### SM-6 : Envoi bloqué pendant que l'IA écrit (CA40) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Tant que la réponse de l'IA est en cours, le bouton « Envoyer » reste désactivé, même avec du texte dans le champ, et la touche Entrée n'envoie rien. Un seul flux part.
> - Smoke parce que l'état « en cours » réel vient de la lecture du flux, et l'absence de 2 flux concurrents se constate sur le réseau. La décision « flux en cours → envoi désactivé » est couverte en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, modale ouverte après SM-4 (la 1re réponse de l'IA est terminée), réseau ralenti (devtools, profil « Slow 3G »), onglet Réseau ouvert et vidé.

1. Saisir « J'ai aussi relu une PR. » dans le champ « Écrire un message … ».
2. Cliquer sur le bouton « Envoyer ».
3. Saisir « Et j'ai fait un point avec l'équipe. » dans le champ « Écrire un message … ».
4. Appuyer sur Entrée.

Attendu : après l'étape 3, tant que l'IA écrit, le bouton « Envoyer » est désactivé alors que le champ contient du texte. Après l'étape 4, aucun nouveau message n'apparaît dans le fil et le texte reste dans le champ. L'onglet Réseau montre **un seul** `POST http://localhost:3000/standups/conversation` depuis l'étape 2. Une fois la réponse de l'IA terminée, « Envoyer » redevient actif.

- [ ] Vérifié

### 3. Le récap et sa validation

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA5, CA10 | 🟠 | Récap en 3 blocs Hier / Blocages / À venir, en lecture seule, « Aucun » sous une catégorie vide | SM-7 |
| CA30 | 🔴 | Du HTML dans le récap s'affiche en texte brut, sans exécution | SM-8 |
| CA26 | 🟢 | Valider poste le `summary` reçu tel quel, sans date | aucun smoke, couvert en unitaire |
| CA6, CA25 | 🟠 | « Oui, je valide le daily » absent avant le récap ; au clic, enregistrement, modale fermée, carré du jour vert | SM-9 |
| CA27 | 🟠 | Double-clic sur « Oui, je valide le daily » : un seul `POST /standups` | SM-10 |

---

### SM-7 : Récap en 3 blocs, « Aucun » pour les blocages (CA5, CA10) (LLM)

> ✅ **Ce qu'on vérifie :**
> - À l'arrivée de l'événement `summary`, le front dessine 3 blocs (Hier, Blocages, À venir) avec leurs puces, sans aucun champ modifiable. La catégorie vide affiche « Aucun ».
> - Smoke parce que l'arrivée réelle d'un `summary` dépend du LLM, et que l'affichage en lecture seule est du rendu. La transformation du récap en sections est couverte en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, page / ouverte.

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Répondre aux questions de l'IA jusqu'à l'affichage du récap, en confirmant qu'il n'y a aucun blocage.

Attendu : une bulle de l'IA affiche « Voici le résumé de ton daily. Tu valides ? », puis 3 blocs titrés HIER, BLOCAGES et À VENIR. Sous HIER, au moins une puce parle de la page de connexion ; sous À VENIR, au moins une puce parle du calendrier ; sous BLOCAGES, une seule puce « Aucun ». Les puces sont du texte : aucun champ, aucune zone éditable dans le récap. Les boutons « Oui, je valide le daily » et « Non, j'aimerais ajouter une info. » sont affichés sous le récap.

Si l'IA produit un blocage malgré la réponse, le smoke n'est pas concluant sur « Aucun » : le rejouer.

- [ ] Vérifié

---

### SM-8 : HTML dans le récap, rendu en texte brut (CA30) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Un texte contenant des balises s'affiche tel quel, balises visibles, dans la bulle de l'utilisateur et dans le récap. Aucun script ne s'exécute.
> - Smoke parce qu'aucun calcul n'est à nous : l'échappement vient de React tant que `dangerouslySetInnerHTML` n'est pas utilisé. Ce qu'on vérifie est le rendu réel.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, page / ouverte.

1. Saisir « Hier j'ai corrigé le composant <b>Navbar</b> et testé <script>alert('xss')</script>. Aucun blocage. Demain je commence le calendrier. » dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Répondre aux questions de l'IA jusqu'à l'affichage du récap.

Attendu :
- Aucune boîte d'alerte du navigateur (« xss ») ne s'ouvre, à aucune étape.
- La bulle de l'utilisateur affiche littéralement le texte de l'étape 1 : `<b>`, `</b>` et `<script>alert('xss')</script>` sont visibles et « Navbar » n'est pas en gras.
- Si le récap reprend les balises dans une puce de HIER, elles y sont aussi visibles en toutes lettres, sans mise en gras ni exécution.

Le LLM peut reformuler ou retirer les balises du récap. Dans ce cas, la partie récap du smoke n'est pas concluante : la bulle utilisateur reste vérifiée, et le récap se vérifie en e2e en injectant un `summary` contenant du HTML.

- [ ] Vérifié

---

### SM-9 : Validation du récap, modale fermée et carré du jour vert (CA6, CA25) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Tant que le récap n'est pas arrivé, le bouton « Oui, je valide le daily » n'existe pas. Au clic, le standup est enregistré, la modale se ferme sans confirmation, et le carré du jour passe en vert une fois la modale fermée.
> - Smoke parce que l'enregistrement réel, la fermeture de la modale (base-ui) et le rafraîchissement du calendrier dépendent du backend et de la librairie. L'activation du bouton et la décision du carré sont couvertes en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, page / ouverte, compteur à « 0 daily renseigné(s) sur l'année ».

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Répondre aux questions de l'IA jusqu'à l'affichage du récap.
4. Cliquer sur le bouton « Oui, je valide le daily ».

Attendu :
- Pendant les étapes 2 et 3, avant l'affichage du récap : aucun bouton « Oui, je valide le daily » dans la modale.
- Pendant que la modale est ouverte, derrière le voile, le carré du jour n'a pas le liseré vert et le compteur reste à 0.
- Après l'étape 4 : la modale « Daily Standup Assistant » se ferme, sans la confirmation « Le daily standup n'est pas encore validé. ». Le carré du jour a le liseré vert, le compteur affiche « 1 daily renseigné(s) sur l'année », et le titre devient « Bravo, tu as renseigné ton standup du jour ! ». La zone « Ton daily du jour » est toujours là.

- [ ] Vérifié

---

### SM-10 : Double-clic sur « Oui, je valide le daily », un seul enregistrement (CA27) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Un double-clic sur le bouton de validation n'envoie qu'un `POST /standups`, le bouton étant désactivé pendant la requête.
> - Smoke parce que la garantie vient du bouton désactivé : ce qu'on vérifie est le comportement du navigateur sur un bouton désactivé et le nombre réel de requêtes. La décision « validation en cours → bouton désactivé » est couverte en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, modale ouverte avec le récap affiché (étapes 1 à 3 de SM-9), réseau ralenti (devtools, profil « Slow 3G »), onglet Réseau ouvert et vidé.

1. Double-cliquer sur le bouton « Oui, je valide le daily ».

Attendu : dès le 1er clic, le bouton « Oui, je valide le daily » est désactivé jusqu'à la réponse. L'onglet Réseau montre **une seule** requête `POST http://localhost:3000/standups`. À la réponse, la modale se ferme et le compteur affiche « 1 daily renseigné(s) sur l'année ».

- [ ] Vérifié

### 4. Fermer ou refaire un standup

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA7, CA44 | 🟠 | Fermer en pleine conversation (×, Échap, voile) ouvre la confirmation, y compris récap reçu non validé ; « Poursuivre » garde le fil, « Quitter » ferme sans rien enregistrer | SM-11, SM-12, SM-13, SM-14 |
| CA9 | 🟠 | Standup du jour existant : alerte de remplacement avant de démarrer ; « Refaire mon daily » démarre, « Annuler » ne démarre rien | SM-15, SM-16 |
| CA41 | 🔴 | Alerte confirmée puis fermeture sans valider : l'ancien standup reste intact, carré du jour vert | SM-17 |

---

### SM-11 : Fermeture par la croix, confirmation puis reprise (CA7) (LLM)

> ✅ **Ce qu'on vérifie :**
> - La croix « Fermer la conversation » ouvre la confirmation au lieu de fermer. « Poursuivre le daily » ramène dans la conversation, fil intact.
> - Smoke parce que l'interception de la fermeture demande un câblage explicite de la modale base-ui : la RM peut échouer avec un prédicat « conversation inachevée » correct (couvert en unitaire).

Précondition : dev server lancé, compte sans standup du jour, session ouverte, modale ouverte après SM-4 (texte de départ + au moins une réponse de l'IA).

1. Cliquer sur le bouton « Fermer la conversation ».
2. Cliquer sur le bouton « Poursuivre le daily ».

Attendu : après l'étape 1, la modale de conversation reste ouverte derrière une confirmation qui affiche « Le daily standup n'est pas encore validé. », le texte « En quittant cette conversation, tout l'échange sera définitivement perdu. Es-tu sûr de vouloir quitter ? », et les boutons « Poursuivre le daily » et « Quitter le daily ». Après l'étape 2, la confirmation disparaît et la modale « Daily Standup Assistant » est toujours ouverte, avec tous les messages précédents.

- [ ] Vérifié

---

### SM-12 : Fermeture par Échap, confirmation puis reprise (CA7) (LLM)

> ✅ **Ce qu'on vérifie :**
> - La touche Échap ouvre la même confirmation au lieu de fermer la modale.
> - Smoke parce que shadcn / base-ui ferme sur Échap par défaut : seul le vrai navigateur montre que la fermeture est bien interceptée.

Précondition : identique à SM-11.

1. Appuyer sur Échap.
2. Cliquer sur le bouton « Poursuivre le daily ».

Attendu : après l'étape 1, la confirmation « Le daily standup n'est pas encore validé. » s'affiche, la modale de conversation n'est pas fermée. Après l'étape 2, la modale « Daily Standup Assistant » est toujours ouverte avec tous les messages.

- [ ] Vérifié

---

### SM-13 : Fermeture par clic sur le voile, confirmation puis abandon (CA7) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Un clic sur le voile assombri ouvre la confirmation. « Quitter le daily » ferme la modale sans rien enregistrer.
> - Smoke parce que shadcn / base-ui ferme sur clic extérieur par défaut, et que l'absence d'enregistrement se constate sur le vrai backend.

Précondition : identique à SM-11. Compteur à « 0 daily renseigné(s) sur l'année ».

1. Cliquer sur le voile assombri, en dehors de la fenêtre de conversation (par exemple dans le coin en haut à gauche de la page).
2. Cliquer sur le bouton « Quitter le daily ».

Attendu : après l'étape 1, la confirmation « Le daily standup n'est pas encore validé. » s'affiche, la modale de conversation n'est pas fermée. Après l'étape 2, la confirmation et la modale « Daily Standup Assistant » se ferment. Le titre reste « Qu'as-tu fait de beau aujourd'hui, Marc ? », le compteur reste à « 0 daily renseigné(s) sur l'année », aucun `POST http://localhost:3000/standups` n'est parti.

Le voile n'a pas de libellé : c'est le seul élément de ces smokes désigné par sa position.

- [ ] Vérifié

---

### SM-14 : Récap reçu mais non validé, la fermeture demande confirmation (CA44) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Une fois le récap affiché, fermer sans valider ouvre quand même la confirmation, et quitter ne sauvegarde rien.
> - Smoke parce que c'est le cas que le ticket isole : « conversation inachevée » n'est pas « aucun récap reçu ». Le prédicat est couvert en unitaire, la fermeture réelle passe par la modale base-ui.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, modale ouverte avec le récap affiché (étapes 1 à 3 de SM-9), compteur à « 0 daily renseigné(s) sur l'année ».

1. Appuyer sur Échap.
2. Cliquer sur le bouton « Quitter le daily ».

Attendu : après l'étape 1, la confirmation « Le daily standup n'est pas encore validé. » s'affiche. Après l'étape 2, la modale se ferme. Le titre reste « Qu'as-tu fait de beau aujourd'hui, Marc ? », le compteur reste à « 0 daily renseigné(s) sur l'année », le carré du jour n'a pas le liseré vert.

- [ ] Vérifié

---

### SM-15 : Standup déjà fait, alerte de remplacement puis nouvelle conversation (CA9) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Avec un standup du jour existant, « Lancer le daily » ouvre d'abord l'alerte de remplacement. « Refaire mon daily » démarre la conversation avec le texte tapé.
> - Smoke parce que l'état réel vient de `GET /standups/today`, et que l'alerte et la conversation sont des modales base-ui. Le prédicat et la décision d'alerte sont couverts en unitaire.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, page / ouverte (titre « Bravo, tu as renseigné ton standup du jour ! »), onglet Réseau ouvert et vidé.

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Cliquer sur le bouton « Refaire mon daily ».

Attendu : après l'étape 2, une alerte affiche « Ton daily du jour est déjà renseigné. », le texte « En le refaisant, le nouveau daily remplacera l'existant une fois validé. », et les boutons « Annuler » et « Refaire mon daily ». La modale « Daily Standup Assistant » n'est pas ouverte et aucun `POST http://localhost:3000/standups/conversation` n'est parti. Après l'étape 3, l'alerte se ferme, la modale « Daily Standup Assistant » s'ouvre avec le texte de départ comme 1er message, et l'IA répond.

- [ ] Vérifié

---

### SM-16 : Standup déjà fait, « Annuler » ne démarre rien (CA9)

> ✅ **Ce qu'on vérifie :**
> - « Annuler » ferme l'alerte sans ouvrir la conversation ni appeler l'IA.
> - Smoke pour la même raison que SM-15 : état réel du jour et modales base-ui.

Précondition : identique à SM-15.

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Cliquer sur le bouton « Annuler ».

Attendu : après l'étape 3, l'alerte « Ton daily du jour est déjà renseigné. » se ferme, la modale « Daily Standup Assistant » ne s'ouvre pas, aucun `POST http://localhost:3000/standups/conversation` n'est parti. Le titre reste « Bravo, tu as renseigné ton standup du jour ! ».

- [ ] Vérifié

---

### SM-17 : Refaire puis quitter sans valider, l'ancien standup reste intact (CA41) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Après « Refaire mon daily » puis un abandon, l'ancien standup est toujours enregistré, avec le même contenu, et le carré du jour reste vert.
> - Smoke parce que rien n'est à calculer côté front : le front n'écrit rien avant « Valider », le remplacement est un upsert du backend au `POST`. Ce qu'on vérifie est l'état réel des données après la fermeture.

Précondition : dev server lancé, compte avec standup du jour créé par le `POST` des conventions (HIER contient « Ancien standup : page de connexion »), session ouverte, page / ouverte, compteur à « 1 daily renseigné(s) sur l'année ».

1. Saisir le texte de départ dans la zone « Ton daily du jour ».
2. Cliquer sur le bouton « Lancer le daily ».
3. Cliquer sur le bouton « Refaire mon daily ».
4. Cliquer sur le bouton « Fermer la conversation », une fois la 1re réponse de l'IA affichée.
5. Cliquer sur le bouton « Quitter le daily ».
6. Ouvrir http://localhost:3000/standups/today dans un nouvel onglet.

Attendu :
- Après l'étape 5 : la modale est fermée, le titre est toujours « Bravo, tu as renseigné ton standup du jour ! », le compteur affiche toujours « 1 daily renseigné(s) sur l'année », le carré du jour a toujours le liseré vert. Aucun `POST http://localhost:3000/standups` n'est parti.
- Après l'étape 6 : la réponse JSON contient `"done": true` et un `summary` dont `fait` vaut `["Ancien standup : page de connexion"]`, inchangé.

Ce scénario a 6 étapes : il dépasse la taille d'un smoke, parce que CA41 enchaîne alerte, conversation, abandon, puis lecture des données.

- [ ] Vérifié

### 5. Les erreurs du flux

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA29, CA31, CA32 | 🟠 | Flux interrompu : message d'erreur et « Réessayer », fil conservé, nouvelle tentative possible. Les codes `LLM_QUOTA_EXCEEDED`, `LLM_UNAVAILABLE` et `SUMMARY_MALFORMED` ne sont confirmés par aucun smoke (couverts en unitaire) | SM-18 |

---

### SM-18 : Backend coupé pendant que l'IA écrit, message et « Réessayer » (CA29, CA31, CA32) (LLM)

> ✅ **Ce qu'on vérifie :**
> - Quand le flux s'interrompt, la modale affiche un message d'erreur et un bouton « Réessayer », sans perdre les messages déjà échangés. « Réessayer » relance le même tour, et l'IA répond une fois le backend revenu.
> - Smoke parce qu'aucun smoke ne peut provoquer à coup sûr un quota Groq, un provider indisponible ou un récap malformé : seule la coupure réelle du flux se joue à la main. Le mapping des 3 codes et la décision « `SUMMARY_MALFORMED` → pas de validation » sont couverts en unitaire.

Précondition : dev server lancé, compte sans standup du jour, session ouverte, modale ouverte après SM-4 (texte de départ + 1re réponse de l'IA terminée), réseau ralenti (devtools, profil « Slow 3G ») pour laisser le temps de couper.

1. Saisir « J'ai aussi relu une PR. » dans le champ « Écrire un message … ».
2. Cliquer sur le bouton « Envoyer ».
3. Arrêter le backend pendant que « L'assistant écrit… » ou le texte de l'IA s'affiche.
4. Relancer le backend.
5. Cliquer sur le bouton « Réessayer ».

Attendu :
- Après l'étape 3 : un message d'erreur s'affiche dans le fil avec le bouton « Réessayer ». Le texte attendu est « Le serveur ne répond pas. Réessaie dans un instant. » (texte de panne du front, repris de F1 : le ticket n'en fixe pas pour F2). Le texte de départ, la 1re réponse de l'IA et « J'ai aussi relu une PR. » sont toujours affichés. Aucun bouton « Oui, je valide le daily » n'apparaît.
- Après l'étape 5 : le message d'erreur disparaît, « L'assistant écrit… » réapparaît puis l'IA répond. « J'ai aussi relu une PR. » n'apparaît qu'une seule fois dans le fil.

Ce scénario a 5 étapes, dont 2 hors navigateur (arrêter et relancer le backend) : il dépasse la taille d'un smoke.

- [ ] Vérifié
