# Inventaire de test, KOM-22 « Consulter son calendrier de standups · frontend »

Doctrine appliquée : `docs/testing-strategy.md`. Codes d'erreur lus dans `src/types/apiContract.ts` (section « F2 — LE STANDUP »).
Paquets 1 à 3 et leur ordre repris du ticket. Le ticket numérote ses règles en `CA` (critères d'acceptance) ; le contrat d'API cite les mêmes numéros en `RM`.

Existant pris en compte : `src/logic/daily/calendarGrid/calendarGrid.ts` et son test couvrent déjà la grille de 53 semaines, le marquage des jours renseignés et les jours à venir vides. 2 écarts avec le ticket sont à corriger (voir CA11) : la semaine y commence le **lundi** au lieu du **dimanche**, et aucune fonction ne calcule « aujourd'hui » en Europe/Paris à partir d'une horloge injectée.

Le nom imposé par le ticket (`construireCalendrier` dans `logic/calendrier.ts`) n'est pas repris : selon `code-naming.md` et `files.md`, le repo garde `calendarGrid` dans `logic/daily/calendarGrid/`.

Aucun smoke n'est jouable tant que le backend n'expose pas les routes `/standups`.

### 1. Affichage du calendrier

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA11 | La grille couvre 53 semaines (52 pleines + la semaine en cours), commence le dimanche et se termine sur la semaine d'aujourd'hui. « Aujourd'hui » est calculé en Europe/Paris à partir d'une horloge injectée. Les bornes `from` / `to` de `GetCalendrierQuery` sont le 1er et le dernier jour de la grille. L'en-tête affiche le `count` du serveur tel quel | 🟠 | La géométrie de la grille, le jour courant en Europe/Paris et les bornes de la requête sont à nous. À compléter dans `calendarGrid` : passage au dimanche (le test « commence la fenêtre un lundi » contredit le ticket) et fonction « horloge → `Jour` Europe/Paris », testée avec une horloge fixée (la CI tourne en UTC). Le `count` n'est pas calculé par le front : sa cohérence avec les cases vertes dépend du backend | Unitaire (grille, jour courant, bornes) + smoke manuel |
| CA12 | Un jour renvoyé dans `jours` donne une case « renseignée » (liseré vert), les autres une case grise | 🟠 | La décision « jour présent dans la réponse → case renseignée » est à nous et déjà couverte (« marque les jours renseignés »). La couleur est du CSS, et le placement d'un vrai standup sur la bonne case dépend du jour imposé par le serveur | Unitaire (décision, existant) + smoke manuel |
| CA13 | Les jours futurs de la semaine en cours sont vides | 🟢 | Calcul pur à partir d'aujourd'hui, déjà couvert (« laisse vides les jours à venir »). À revérifier après le passage au dimanche | Unitaire, test-first |
| CA37 | Sur les dates pièges (changement d'heure du 29 mars et du 25 octobre, 29 février), aucune case n'est décalée, dupliquée ni manquante | 🟢 | Calcul pur avec horloge injectée : tests à ajouter sur ces 3 dates, comme « aujourd'hui » et comme jour à l'intérieur de la fenêtre, y compris une horloge juste après minuit heure de Paris | Unitaire, test-first |

### 2. Consulter le résumé d'un jour

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA14 | Clic sur une case verte : la modale résumé du jour s'ouvre, en lecture seule (pas de champ de saisie) | 🔴 | Quelles cases sont cliquables est déjà couvert par CA12. Reste l'ouverture réelle de la modale (base-ui), l'appel `GET /standups/:jour` et l'absence de champ, qui est du rendu | Manuel (smoke navigateur) |
| CA15 | Clic sur une case grise : rien ne se passe | 🔴 | La décision est couverte par CA12. Ce qu'on vérifie est l'absence réelle de modale et de requête au clic | Manuel (smoke navigateur) |
| CA46 | Pendant le chargement du résumé, la modale affiche un état de chargement | 🟠 | La décision « requête en cours → état de chargement » est à nous, à extraire dans `src/logic/`. L'état en cours réel vient de TanStack Query et du réseau. La 1re puce (le calendrier ne porte pas le contenu) est un choix du contrat, rien à tester | Unitaire (décision d'état) + smoke manuel |
| CA30 | Un résumé contenant du HTML (ex. `<script>`) s'affiche en texte brut, sans exécution. Une catégorie vide (liste `[]`) affiche « Aucun » | 🟠 | « Liste vide → Aucun » est une décision à nous, aujourd'hui écrite dans le JSX de `DailySummary.tsx`, à extraire dans `src/logic/`. Le texte brut vient de l'échappement de React (comme RM23 de KOM-07) : seul le rendu réel le vérifie | Unitaire (catégorie vide) + smoke manuel |
| CA45 | Quand `GET /standups/:jour` renvoie `STANDUP_NOT_FOUND` : aucune modale vide, un message indique que le standup n'existe plus, le calendrier est rafraîchi et la case redevient grise | 🟠 | La suppression est du backend. La réaction du front (code → pas de modale + message + rafraîchir le calendrier) est un mapping à nous ; le code existe dans le contrat. Le rafraîchissement réel et la case redevenue grise dépendent de TanStack Query et du backend. Doute : le texte affiché est-il le `message` du serveur (règle de KOM-07) ou un texte du front ? L'exemple du ticket parle du calendrier mis à jour, que le serveur ne connaît pas | Unitaire (mapping) + smoke manuel |

### 3. Erreurs et isolation

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA43 | Réponse sans jour → grille pleine de cases grises. Échec du chargement → aucune case, un message d'erreur | 🟠 | La décision « succès vide → grille, échec → message » est à nous. L'échec réel (backend coupé, 5xx) ne se confirme qu'en smoke. Le texte du message d'erreur n'est ni dans le ticket ni dans `src/data/daily.ts` | Unitaire (décision d'état) + smoke manuel |

L'isolation entre utilisateurs (contrainte technique) est tenue par le serveur (`STANDUP_NOT_FOUND` pour le standup d'autrui, RM38 du contrat) : ce n'est pas une RM frontend, aucune ligne.

## Récap

**Test unitaire automatisé (→ `unit-test-writer`)**
- CA13 : jours futurs de la semaine en cours vides (existant, à revérifier après le passage au dimanche).
- CA37 : 29 mars, 25 octobre, 29 février, sans case décalée, dupliquée ni manquante.

**Couverture partielle 🟠 (unitaire + smoke manuel)**
- CA11 : unitaire sur la grille (53 semaines, début dimanche), le jour courant en Europe/Paris avec horloge injectée et les bornes `from` / `to`. Smoke : avec des standups en base, voir l'en-tête « N daily renseigné(s) sur l'année » égal au nombre de cases vertes.
- CA12 : unitaire sur « jour renvoyé → case renseignée » (existant). Smoke : un standup enregistré aujourd'hui, voir la case du jour cerclée de vert dans la dernière colonne.
- CA46 : unitaire sur « requête en cours → chargement ». Smoke : réseau ralenti, cliquer une case verte, voir l'état de chargement avant le résumé.
- CA30 : unitaire sur « liste vide → Aucun ». Smoke : un standup dont un item contient `<script>alert(1)</script>`, ouvrir son résumé, voir la balise en texte et aucune alerte ; une catégorie vide affiche « Aucun ».
- CA45 : unitaire sur `STANDUP_NOT_FOUND` → pas de modale, message, rafraîchissement. Smoke : supprimer un standup en base pendant que l'accueil est ouvert, cliquer sa case, voir le message et la case redevenir grise.
- CA43 : unitaire sur « succès vide → grille grise, échec → message ». Smoke : couper le backend, ouvrir l'accueil, voir le message d'erreur et aucune case ; compte sans standup, voir la grille grise.

**Vérifié à la main (→ `smoke-test-writer`)**
- CA14 : clic sur une case verte, modale résumé en lecture seule.
- CA15 : clic sur une case grise, rien ne se passe.
