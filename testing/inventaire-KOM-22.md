# Inventaire de test, KOM-22 « Consulter son calendrier de standups · frontend »

Doctrine appliquée : `docs/testing-strategy.md`. Codes d'erreur lus dans `src/types/apiContract.ts` (section F2).
Le ticket parle de critères d'acceptation (CA), pas de RM. Paquets 1 à 3 et leur ordre repris du ticket. Le ticket contient 10 CA (CA11, CA12, CA13, CA37, CA14, CA15, CA46, CA30, CA45, CA43), chacun sur sa ligne.
La légende de la 1re capture cite aussi CA16, absent du tableau des CA du ticket : non classé.
La contrainte « isolation entre utilisateurs » est tenue par le serveur (`GetCalendrierQuery` et `GetStandupResponse` scopés par la session, `STANDUP_NOT_FOUND` pour le standup d'autrui) : le front ne la vérifie pas, aucune ligne ne lui est attribuée.
Aucun smoke de ce ticket ne passe par une vraie réponse du LLM : un standup se crée par `POST /standups` (helper `e2e/support/standup.ts`), leur transcription e2e relève de la suite déterministe.

Emplacement prévu de la logique pure, selon `files.md` et `code-naming.md` (le ticket écrit `construireCalendrier(aujourdhui, joursAvecStandup)` dans `logic/calendrier.ts` : on garde le comportement, pas les noms) :
- `src/logic/standup/calendar/calendar.ts` : une fonction pure, nommée en anglais (ex. `buildCalendar(now, standupDays)`), sans import de React. Elle reçoit l'instant courant injecté et les `jours` de `GetCalendrierResponse`, calcule en Europe/Paris, et rend les 53 semaines du dimanche au samedi (chaque jour avec son `Jour` et son état `empty` / `filled` / `future`), les libellés de mois et les bornes `from` / `to` de `GetCalendrierQuery`.
- `src/logic/standup/summary/` : `summarySectionsFor` existe déjà (KOM-19, CA10) et couvre « Aucun » pour une catégorie vide.
- `src/logic/standup/error/` : la réaction à `STANDUP_NOT_FOUND` sur `GET /standups/:jour` (message, fermeture de la modale, rafraîchissement du calendrier).

Ambiguïtés tranchées par l'inventaire (au plus près du ticket) :
- `calendar.ts` contient déjà `calendarWeeksFor`, écrit pour KOM-19 avec les semaines **du lundi au dimanche** (`WEEKDAY_INDEX` lundi = 0). CA11 impose le dimanche en premier : la nouvelle fonction remplace ce calcul, elle ne s'y ajoute pas.
- « aujourd'hui » est injecté comme un instant (`Date`), pas comme un `Jour` déjà calculé : c'est la fonction qui le lit en Europe/Paris. Sinon le cas « 00h30 à Paris = 23h30 UTC la veille », qui motive la contrainte, ne serait pas testable.
- Le compteur (CA11) : le ticket dit « de cette fenêtre de l'année en cours », la maquette « sur l'année », le contrat « sur la fenêtre demandée ». On affiche le `count` du serveur tel quel, la fenêtre étant celle que le front demande par `from` / `to`. Borne haute retenue : `to` = aujourd'hui à Paris (les jours suivants sont vides, CA13).
- CA45 : le message affiché est le texte du front (`summaryDialog.notFoundMessage` dans `src/data/standup.ts`), pas le `message` de l'`ApiError`. Le ticket exige d'annoncer le rafraîchissement du calendrier, ce que le serveur ne sait pas. Cela s'écarte de l'arbitrage de KOM-19 (message serveur tel quel).
- CA45 : la façon d'afficher le message (toast ou autre) n'est pas précisée. Seule la règle « jamais de modale vide » est tenue.

### 1. Affichage du calendrier

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA11 | Fenêtre glissante de 53 semaines (52 pleines + la semaine en cours) ancrée sur aujourd'hui, semaines du dimanche au samedi. L'en-tête affiche le `count` du serveur, jamais recalculé | 🟠 | La construction de la grille (53 colonnes, dimanche en premier, aujourd'hui dans la dernière colonne, en Europe/Paris avec horloge injectée) et les bornes `from` / `to` sont à nous. Le `count` vient de `GET /standups` : on vérifie qu'on l'affiche tel quel, ce qui dépend de la vraie réponse. L'alignement visuel des lignes (ligne vide au-dessus de « Lun ») est du rendu | Unitaire (grille, bornes) + smoke manuel |
| CA12 | Chaque jour est un carré gris (pas de standup) ou à liseré vert (standup renseigné) | 🟠 | La décision `empty` / `filled` à partir des `jours` reçus est à nous. Le gris et le liseré vert sont du CSS calculé par le navigateur, et les `jours` réels viennent du backend | Unitaire (état de chaque jour) + smoke manuel |
| CA13 | Les jours futurs de la semaine en cours sont vides | 🟢 | Décision d'état `future` calculée à partir de l'instant injecté lu en Europe/Paris. Aucune dépendance : le composant rend un carré sans fond pour cet état | Unitaire, test-first |
| CA37 | Sur les dates pièges (changement d'heure du 29 mars et du 25 octobre, 29 février), aucune case décalée, dupliquée ni manquante | 🟢 | Pure arithmétique de dates à nous, horloge injectée (la CI tourne en UTC). Chaque date piège donne exactement 7 jours par semaine, des `Jour` consécutifs sans doublon ni trou | Unitaire, test-first |

### 2. Consulter le résumé d'un jour

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA14 | Un clic sur un carré à liseré vert ouvre la modale résumé de ce jour, en lecture seule | 🔴 | Rien à calculer de notre côté au-delà de l'état `filled` (couvert par CA12) : l'ouverture vient de la modale base-ui, le contenu de `GET /standups/:jour` sur le vrai backend, la lecture seule est du rendu (aucun champ modifiable) | Manuel (smoke navigateur) |
| CA15 | Un clic sur un carré gris ne fait rien | 🔴 | L'état `empty` est couvert par CA12. Ce qu'on vérifie est l'absence réelle de modale et de requête au clic, observable seulement dans le navigateur | Manuel (smoke navigateur) |
| CA46 | Le calendrier ne porte que les jours renseignés, pas leur contenu. Au clic sur un carré vert, un état de chargement s'affiche pendant que le résumé est demandé | 🔴 | « Pas de contenu dans le calendrier » est fixé par le contrat (`GetCalendrierResponse` = `count` + `jours`), il n'y a rien à calculer. L'état de chargement vient de TanStack Query et du vrai temps de réponse du serveur | Manuel (smoke navigateur) |
| CA30 | Un résumé contenant du HTML (`<script>…`) s'affiche en texte brut, sans exécution. Une catégorie vide affiche « Aucun » | 🟠 | « Aucun » pour une liste vide est à nous : `summarySectionsFor` le fait déjà (KOM-19, CA10), son test unitaire existant couvre cette moitié. L'échappement du HTML vient de React tant qu'on n'utilise pas `dangerouslySetInnerHTML` : c'est du rendu réel. Contrairement à KOM-19, le smoke est sûr de faire apparaître le HTML : un standup se poste directement avec un item `<script>` (le serveur valide la forme, pas la provenance) | Unitaire (« Aucun », existant) + smoke manuel |
| CA45 | Clic sur un carré vert dont le standup n'existe plus : le message « Ce standup n'existe plus, le calendrier a été mis à jour. » s'affiche, le calendrier se rafraîchit, le carré redevient gris, aucune modale vide | 🟠 | La réaction à `STANDUP_NOT_FOUND` (code présent dans le contrat) est à nous : message affiché, modale fermée, calendrier à recharger. Le test unitaire mocke la forme `ApiError`. Aucun smoke ne peut provoquer le cas de façon fiable : le contrat n'a pas de route de suppression, il faudrait effacer la ligne en base entre le chargement du calendrier et le clic. Le retour au gris dépend aussi du vrai rechargement | Unitaire (réaction au code) + smoke manuel |

### 3. Erreurs et isolation

| RM | Ce qu'on vérifie | Testable unitaire ? | Pourquoi | Comment |
|---|---|---|---|---|
| CA43 | « Aucun standup » affiche la grille pleine de cases grises ; « échec de chargement » n'affiche aucune case mais un message d'erreur | 🟠 | La décision est à nous : `jours` vide donne 53 semaines de cases `empty` (et `future` pour la fin de semaine), un échec donne l'état `error` sans grille. L'échec réel vient de la requête `GET /standups` (réseau, backend), et l'état d'erreur de TanStack Query | Unitaire (grille vide, choix de l'état affiché) + smoke manuel |

## Récap

**Test unitaire automatisé (→ `unit-test-writer`)**
- CA13 : jours après aujourd'hui (Europe/Paris, horloge injectée) en état `future`, y compris à 00h30 Paris quand l'UTC est encore la veille.
- CA37 : grille construite sur le 29 mars, le 25 octobre et un 29 février, 53 × 7 cases, `Jour` consécutifs, sans doublon ni trou.

**Couverture partielle 🟠 (unitaire + smoke manuel)**
- CA11 : unitaire sur la grille (53 semaines, dimanche en premier, aujourd'hui en dernière colonne) et les bornes `from` / `to`. Smoke : compte avec 2 standups postés par l'API, ouvrir l'accueil, voir « 2 daily renseigné(s) sur l'année », la ligne vide au-dessus de « Lun », le mois courant en dernier.
- CA12 : unitaire sur l'état `empty` / `filled` de chaque jour. Smoke : compte avec un standup du jour, voir son carré à liseré vert (bouton « Voir le daily du … ») et les autres jours en gris.
- CA30 : unitaire existant sur « Aucun » (`summarySectionsFor`). Smoke : poster par l'API un standup dont un item vaut `<script>alert(1)</script>` et dont `blocages` est vide, cliquer son carré, voir le texte `<script>alert(1)</script>` affiché tel quel, aucune alerte, « Aucun » sous Blocages.
- CA45 : unitaire sur la réaction à `STANDUP_NOT_FOUND`. Smoke : supprimer en base le standup d'un jour après le chargement de l'accueil, cliquer son carré, voir « Ce standup n'existe plus, le calendrier a été mis à jour. », aucune modale, le carré redevenu gris. Le code `STANDUP_NOT_FOUND` lui-même n'est confirmé par aucun smoke tant qu'il n'existe pas de moyen fiable de supprimer le standup.
- CA43 : unitaire sur la grille vide et le choix de l'état affiché. Smoke : compte neuf, voir la grille entièrement grise et « 0 daily renseigné(s) sur l'année » ; puis bloquer `GET /standups`, recharger, voir « Ton calendrier n'a pas pu être chargé. Réessaie dans un instant. » et aucune case.

**Vérifié à la main (→ `smoke-test-writer`)**
- CA14 : cliquer un carré à liseré vert, voir la modale « En date du … » avec Hier / Blocages / À venir, sans champ modifiable.
- CA15 : cliquer un carré gris, aucune modale ne s'ouvre.
- CA46 : réseau ralenti, cliquer un carré vert, voir « Chargement du résumé » puis le résumé.
