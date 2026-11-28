# Smokes, KOM-22 « Consulter son calendrier de standups · frontend »

Scénarios écrits **avant** l'implémentation (test-first), à partir de `testing/inventaire-KOM-22.md`.
Après le code, chaque scénario est transcrit en e2e Playwright par `e2e-test-writer`.
Format : `docs/testing-strategy.md`, section « Format des smokes ». Mêmes paquets, mêmes lignes et même ordre que l'inventaire.

Conventions communes à tous les scénarios :

- **Dev server** : front lancé (`pnpm dev`, http://localhost:5173) et backend lancé (http://localhost:3000). Les routes du standup sont à la racine du backend : `http://localhost:3000/standups...` (pas de préfixe `/api`). Aucun scénario ne passe par l'IA : la clé Groq n'est pas nécessaire, et la transcription e2e relève de la suite déterministe.
- **Libellés** : repris de `src/data/standup.ts` (`calendar`, `summaryDialog`, `summary`) et des composants `src/components/pages/Home/YearCalendar.tsx` et `StandupSummaryDialog.tsx`. Un carré vert est un bouton nommé « Voir le daily du {date} ». Le chargement du calendrier a pour nom accessible « Chargement du calendrier », celui du résumé « Chargement du résumé ». L'erreur du calendrier est en `role="alert"`. La modale résumé a pour titre « Daily Standup Assistant », pour description « En date du {date} », et sa croix s'appelle « Fermer le résumé ».
- **Date en toutes lettres** : « {date du jour} » désigne aujourd'hui (Europe/Paris) au format de la maquette, jour de la semaine compris, par exemple « vendredi 27 novembre 2026 » (la maquette écrit « En date du mercredi 15 mai 2026 »).
- **Compte neuf** : un compte de prénom « Marc » (signup avec un email neuf, par exemple « marc+<horodatage>@test.dev », mot de passe « motdepasse123 »), session ouverte. Un compte neuf n'a aucun standup.
- **Compte avec standup du jour** : le compte neuf, après un `POST http://localhost:3000/standups` envoyé avec le cookie de session et le corps `{"summary":{"fait":["Page de connexion terminée"],"blocages":["Attente de la review backend"],"prevu":["Calendrier"]}}` (helper `e2e/support/standup.ts`). Le contrat ne permet pas de dater un standup (`PostStandupBody` ne porte pas de date) : seul le carré du jour peut être vert, et un 2e `POST` remplace le 1er au lieu d'en ajouter un.
- **Carrés gris** : un carré gris n'a ni texte ni libellé accessible (ce n'est pas un bouton). Il se désigne par sa position par rapport au carré du jour, c'est la seule exception à la règle du libellé visible.
- **Libellé absent** : si un libellé désigné ici n'existe pas à l'écran, le smoke échoue à l'étape qui le cite. C'est soit un écart avec la maquette, soit un livrable manquant.

### 1. Affichage du calendrier

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA11 | 🟠 | Compteur du serveur affiché tel quel, ligne vide au-dessus de « Lun », mois courant en dernier, carré du jour dans la dernière colonne | SM-1 |
| CA12 | 🟠 | Le jour avec standup a le liseré vert (seul bouton « Voir le daily du … »), les autres jours passés sont gris | SM-2 |
| CA13 | 🟢 | Jours futurs de la semaine en cours vides | aucun smoke, couvert en unitaire |
| CA37 | 🟢 | Dates pièges : aucune case décalée, dupliquée ni manquante | aucun smoke, couvert en unitaire |

---

### SM-1 : Compteur du serveur, semaines du dimanche au samedi, aujourd'hui en dernière colonne (CA11)

> ✅ **Ce qu'on vérifie :**
> - L'en-tête affiche le `count` renvoyé par `GET /standups?from&to`, sans recalcul. La grille commence ses semaines le dimanche (ligne vide au-dessus de « Lun ») et se termine sur la semaine en cours.
> - Smoke parce que le `count` vient de la vraie réponse du backend et que l'alignement des lignes est du rendu. La construction de la grille et les bornes `from` / `to` sont couvertes en unitaire.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, onglet Réseau des devtools ouvert et vidé.

1. Ouvrir la page /.

Attendu :
- L'en-tête du calendrier affiche « 1 daily renseigné(s) sur l'année ».
- L'onglet Réseau montre un `GET http://localhost:3000/standups?from=…&to=…` dont la réponse contient `"count": 1`, et `to` vaut la date du jour.
- Dans la colonne des libellés de jours, la 1re ligne est vide, puis « Lun », vide, « Mer », vide, « Ven », vide.
- Le dernier libellé de mois à droite est celui du mois courant (« nov. » en novembre).
- Le bouton « Voir le daily du {date du jour} » est dans la dernière colonne de la grille.

- [ ] Vérifié

---

### SM-2 : Le jour renseigné a le liseré vert, les autres sont gris (CA12)

> ✅ **Ce qu'on vérifie :**
> - Le jour qui a un standup s'affiche en carré à liseré vert, cliquable. Les jours passés sans standup s'affichent en carrés gris.
> - Smoke parce que les `jours` réels viennent du backend et que le gris et le liseré vert sont du CSS calculé par le navigateur. La décision `empty` / `filled` est couverte en unitaire.

Précondition : dev server lancé, compte avec standup du jour, session ouverte.

1. Ouvrir la page /.

Attendu : un seul bouton « Voir le daily du … » existe dans le calendrier, et c'est « Voir le daily du {date du jour} ». Son carré a le liseré vert, identique au carré de la légende « Daily enregistré ». Tous les autres carrés jusqu'à aujourd'hui sont gris, identiques au carré de la légende « Daily non renseigné ».

- [ ] Vérifié

### 2. Consulter le résumé d'un jour

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA14 | 🔴 | Clic sur un carré vert : modale résumé du jour, en lecture seule | SM-3 |
| CA15 | 🔴 | Clic sur un carré gris : aucune modale, aucune requête | SM-4 |
| CA46 | 🔴 | Le calendrier ne charge pas les résumés ; au clic, « Chargement du résumé » puis le résumé | SM-5 |
| CA30 | 🟠 | HTML du résumé rendu en texte brut, sans exécution ; « Aucun » sous une catégorie vide | SM-6 |
| CA45 | 🟠 | Standup disparu : message, calendrier rafraîchi, carré redevenu gris, aucune modale vide | SM-7 |

---

### SM-3 : Clic sur un carré vert, modale résumé en lecture seule (CA14)

> ✅ **Ce qu'on vérifie :**
> - Le clic sur le carré du jour ouvre la modale résumé de ce jour, datée, avec les 3 blocs Hier / Blocages / À venir, sans aucun champ modifiable.
> - Smoke parce que rien n'est à calculer côté front au-delà de l'état `filled` : l'ouverture vient de la modale base-ui, le contenu du vrai `GET /standups/:jour`, et la lecture seule est du rendu.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, page / ouverte.

1. Cliquer sur le bouton « Voir le daily du {date du jour} ».

Attendu : la modale « Daily Standup Assistant » s'ouvre avec la description « En date du {date du jour} » et le texte « Voici le résumé du daily du {date du jour} ». Elle affiche 3 blocs titrés HIER, BLOCAGES et À VENIR, avec respectivement les puces « Page de connexion terminée », « Attente de la review backend » et « Calendrier ». La modale ne contient aucun champ de saisie ni bouton d'envoi ou de validation (« Envoyer », « Oui, je valide le daily » absents) : seul le bouton « Fermer le résumé » est cliquable.

- [ ] Vérifié

---

### SM-4 : Clic sur un carré gris, rien ne se passe (CA15)

> ✅ **Ce qu'on vérifie :**
> - Un clic sur un carré gris n'ouvre aucune modale et n'envoie aucune requête de résumé.
> - Smoke parce que l'état `empty` est couvert en unitaire (CA12) : ce qu'on vérifie ici est l'absence réelle de modale et de requête au clic, observable seulement dans le navigateur.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, page / ouverte, onglet Réseau ouvert et vidé.

1. Cliquer sur le carré gris de la veille (juste au-dessus du carré du jour dans la même colonne, ou en bas de la colonne précédente si aujourd'hui est un dimanche).

Attendu : aucune modale ne s'ouvre (pas de « Daily Standup Assistant », pas de « En date du »). L'onglet Réseau ne montre aucun `GET http://localhost:3000/standups/…`. La page reste sur /, sans changement.

Le carré gris n'a pas de libellé accessible : c'est le seul élément de ces smokes désigné par sa position.

- [ ] Vérifié

---

### SM-5 : Le résumé est demandé au clic, avec un état de chargement (CA46)

> ✅ **Ce qu'on vérifie :**
> - Le chargement de l'accueil ne récupère que les jours renseignés, pas les résumés. Au clic sur un carré vert, « Chargement du résumé » s'affiche dans la modale pendant la requête, puis le résumé le remplace.
> - Smoke parce que « pas de contenu dans le calendrier » est fixé par le contrat (`GetCalendrierResponse` = `count` + `jours`) et que l'état de chargement vient de TanStack Query et du vrai temps de réponse du serveur.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, réseau ralenti (devtools, profil « Slow 3G »), onglet Réseau ouvert et vidé.

1. Ouvrir la page /.
2. Cliquer sur le bouton « Voir le daily du {date du jour} ».

Attendu :
- Après l'étape 1 : la réponse de `GET http://localhost:3000/standups?from=…&to=…` ne contient que `count` et `jours`, aucun texte de résumé. Aucun `GET http://localhost:3000/standups/{jour}` n'est parti.
- Après l'étape 2 : la modale s'ouvre avec « En date du {date du jour} » et un loader « Chargement du résumé » à la place des blocs. Un `GET http://localhost:3000/standups/{jour}` part. À sa réponse, le loader disparaît et les blocs HIER, BLOCAGES et À VENIR s'affichent.

- [ ] Vérifié

---

### SM-6 : HTML dans le résumé rendu en texte brut, « Aucun » pour une catégorie vide (CA30)

> ✅ **Ce qu'on vérifie :**
> - Un item contenant des balises s'affiche tel quel, balises visibles, sans exécution ni mise en forme. Une catégorie vide affiche « Aucun ».
> - Smoke parce que l'échappement vient de React tant que `dangerouslySetInnerHTML` n'est pas utilisé : c'est du rendu réel. Contrairement à KOM-19, le HTML apparaît à coup sûr, car le standup est posté directement par l'API. « Aucun » est déjà couvert en unitaire (`summarySectionsFor`, KOM-19).

Précondition : dev server lancé, compte neuf, session ouverte, puis un `POST http://localhost:3000/standups` avec le cookie de session et le corps `{"summary":{"fait":["Testé <script>alert('xss')</script> sur le composant <b>Navbar</b>"],"blocages":[],"prevu":["Calendrier"]}}`, page / ouverte.

1. Cliquer sur le bouton « Voir le daily du {date du jour} ».

Attendu :
- Aucune boîte d'alerte du navigateur (« xss ») ne s'ouvre.
- Sous HIER, la puce affiche littéralement « Testé <script>alert('xss')</script> sur le composant <b>Navbar</b> » : les balises sont visibles et « Navbar » n'est pas en gras.
- Sous BLOCAGES, une seule puce « Aucun ».
- Sous À VENIR, la puce « Calendrier ».

- [ ] Vérifié

---

### SM-7 : Standup disparu entre le chargement et le clic, message et calendrier rafraîchi (CA45)

> ✅ **Ce qu'on vérifie :**
> - Si le standup d'un carré vert n'existe plus au clic (`STANDUP_NOT_FOUND` sur `GET /standups/:jour`), le message « Ce standup n'existe plus, le calendrier a été mis à jour. » s'affiche, aucune modale vide ne reste ouverte, le calendrier se recharge et le carré redevient gris.
> - Smoke parce que le retour au gris dépend du vrai rechargement de `GET /standups`. La réaction au code `STANDUP_NOT_FOUND` (message, modale fermée, calendrier à recharger) est couverte en unitaire.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, page / ouverte (compteur à « 1 daily renseigné(s) sur l'année »), puis la ligne de ce standup supprimée directement en base (le contrat n'a pas de route de suppression), sans recharger la page.

1. Cliquer sur le bouton « Voir le daily du {date du jour} ».

Attendu : le message « Ce standup n'existe plus, le calendrier a été mis à jour. » s'affiche. Aucune modale « Daily Standup Assistant » ne reste ouverte, et à aucun moment une modale sans résumé (loader ou blocs vides) ne reste affichée après la réponse. Le calendrier se recharge : le compteur affiche « 0 daily renseigné(s) sur l'année », le bouton « Voir le daily du {date du jour} » n'existe plus et le carré du jour est gris.

La suppression en base est une manipulation hors navigateur, faite à la main : sa transcription e2e demande soit un accès à la base de test, soit de simuler la réponse `STANDUP_NOT_FOUND` de `GET /standups/:jour` (et alors le retour au gris ne se vérifie qu'avec un `GET /standups` simulé lui aussi). Le ticket n'impose pas la forme du message (toast ou autre) : seul le texte est vérifié.

- [ ] Vérifié

### 3. Erreurs et isolation

| RM | Inventaire | Ce qu'on vérifie | Scénario |
|---|---|---|---|
| CA43 | 🟠 | « Aucun standup » : grille entièrement grise et compteur à 0 ; « échec de chargement » : message d'erreur, aucune case | SM-8, SM-9 |

---

### SM-8 : Aucun standup, grille pleine de cases grises (CA43)

> ✅ **Ce qu'on vérifie :**
> - Un compte sans standup voit la grille complète, toutes cases grises, et le compteur à 0, sans message d'erreur.
> - Smoke parce que la réponse vide réelle vient du backend, et l'affichage de l'état « prêt » de TanStack Query. La grille vide et le choix de l'état affiché sont couverts en unitaire.

Précondition : dev server lancé, compte neuf, session ouverte.

1. Ouvrir la page /.

Attendu : l'en-tête du calendrier affiche « 0 daily renseigné(s) sur l'année ». La grille est affichée en entier, avec les libellés de mois et de jours, et tous les carrés jusqu'à aujourd'hui sont gris. Aucun bouton « Voir le daily du … » n'existe. Le message « Ton calendrier n'a pas pu être chargé. Réessaie dans un instant. » n'est pas affiché.

- [ ] Vérifié

---

### SM-9 : Échec de chargement, message d'erreur et aucune case (CA43)

> ✅ **Ce qu'on vérifie :**
> - Quand `GET /standups?from&to` échoue, le calendrier n'affiche ni grille ni compteur, mais un message d'erreur, pour que l'utilisateur ne croie pas n'avoir aucun standup.
> - Smoke parce que l'échec réel vient de la requête réseau et l'état d'erreur de TanStack Query. Le choix de l'état affiché est couvert en unitaire.

Précondition : dev server lancé, compte avec standup du jour, session ouverte, page / ouverte, requêtes bloquées dans les devtools (onglet Réseau, « Bloquer l'URL de requête ») sur le motif `localhost:3000/standups?from=*` uniquement, pour ne pas bloquer `GET /standups/today`.

1. Recharger la page /.

Attendu : à la place de la grille, le message « Ton calendrier n'a pas pu être chargé. Réessaie dans un instant. » s'affiche. Aucun carré, aucun libellé de mois ou de jour, aucune légende, aucun compteur « … daily renseigné(s) sur l'année » ne sont affichés. Le titre « Bravo, tu as renseigné ton standup du jour ! » reste affiché, ce qui montre que seul le calendrier est en échec.

Le client TanStack Query garde ses réglages par défaut (`src/lib/queryClient.ts`) : il retente 3 fois avant de passer en erreur, le message peut donc mettre environ 7 secondes à s'afficher, « Chargement du calendrier » tournant pendant ce temps.

- [ ] Vérifié
