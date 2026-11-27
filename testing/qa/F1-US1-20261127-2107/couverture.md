# Couverture e2e, run F1-US1-20261127-2107

Une ligne par RM et par ticket. Repris du run F1-US1-20261127-1135 : les 2 tickets n'ont pas changé depuis (dernière édition le 24/11 pour KOM-06, le 26/11 pour KOM-07). Aucun nouvel e2e. Bilan : 37 lignes, 34 couvertes par un e2e existant, 3 non déclenchables, 0 RM déclenchable sans e2e.

| RM | Ticket | Déclenchable ? | Couverte par | Remarque |
|---|---|---|---|---|
| RM8 | KOM-06 | Oui | `signup.test.ts › SM-10` | Compte créé et session ouverte : accueil connecté après le signup. |
| RM12 | KOM-06 | Oui | `signin.test.ts › SM-11` | |
| RM5 | KOM-06 | Oui | `signout.test.ts › SM-17` | |
| RM10 | KOM-06 | Oui (max 128 seulement) | `qa-signup.test.ts › QA-4` | Email mal formé et mot de passe < 8 sont bloqués par le front (SM-6) avant d'atteindre le serveur. Seul le maximum de 128 passe le front et se voit à l'écran. |
| RM11 | KOM-06 | Non | | Le bouton « Créer un compte » est grisé sans prénom (RM33) : aucune requête ne part, le refus serveur n'est atteignable que par un appel direct à l'API. |
| RM20 | KOM-06 | Non | | Même raison que RM11 : un prénom d'espaces grise le bouton (RM33). |
| RM9 | KOM-06 | Oui | `qa-signup.test.ts › QA-2` | Message du serveur sous le champ Email. |
| RM21 | KOM-06 | Oui | `qa-signup.test.ts › QA-3` | Email existant saisi en majuscules avec des espaces autour. Le front normalise aussi l'email, donc le test ne prouve pas à lui seul la normalisation côté serveur. |
| RM13 | KOM-06 | Oui | `qa-signin.test.ts › QA-6` | |
| RM18, RM19 | KOM-06 | Oui (partiel) | `signin.test.ts › SM-19` | SM-19 coupe le backend (serveur injoignable). Un vrai `INTERNAL_ERROR` 5xx du serveur n'est pas provocable depuis l'app déployée. |
| RM2 (401) | KOM-06 | Non | | Aucune route protégée n'a d'écran en F1 ; le 401 n'est visible que par un appel direct à l'API. |
| RM1 | KOM-07 | Oui | `home.test.ts › SM-1` | |
| RM2 | KOM-07 | Oui | `home.test.ts › SM-2` | |
| RM15 | KOM-07 | Oui | `home.test.ts › SM-3` | |
| RM6 | KOM-07 | Oui | `navigation.test.ts › SM-4` | |
| RM7 | KOM-07 | Oui | `navigation.test.ts › SM-5` | |
| RM32 | KOM-07 | Oui | `qa-signin.test.ts › QA-5` | Couverte en unitaire dans l'inventaire, sans e2e jusqu'ici. |
| RM33 | KOM-07 | Oui | `qa-signup.test.ts › QA-1` | Inclut le prénom fait d'espaces. |
| RM10 | KOM-07 | Oui | `signup.test.ts › SM-6` | Email mal formé et mot de passe < 8 à la soumission. |
| RM10 (clause signin) | KOM-07 | Oui | `qa-signin-format.test.ts › QA-7` | « Au signin, aucun format n'est vérifié, des identifiants faux sont signalés par le serveur (RM13) ». Interprété comme : un email mal formé part au serveur et revient avec le message générique de RM13. KO au run 1121 (`VALIDATION_ERROR` du backend), OK au run 1135 après correctif. |
| RM11 | KOM-07 | Oui | `qa-signup.test.ts › QA-1` | Prénom vide : bouton grisé, aucune requête. |
| RM20 | KOM-07 | Oui | `qa-signup.test.ts › QA-1` | Prénom d'espaces : bouton grisé, aucune requête. |
| RM30 | KOM-07 | Oui | `signup.test.ts › SM-6` | |
| RM17 | KOM-07 | Oui | `signin.test.ts › SM-7`, `signup.test.ts › SM-8` | |
| RM16 | KOM-07 | Oui | `signin.test.ts › SM-9`, `doubleSubmit.test.ts` (signup et signin) | `doubleSubmit.test.ts` couvre désormais le signup, absent au run précédent. |
| RM9 | KOM-07 | Oui | `qa-signup.test.ts › QA-2` | |
| RM13 | KOM-07 | Oui | `qa-signin.test.ts › QA-6` | Vérifie aussi qu'aucun champ n'est marqué invalide (message générique). |
| RM8 | KOM-07 | Oui | `signup.test.ts › SM-10` | |
| RM12 | KOM-07 | Oui | `signin.test.ts › SM-11` | |
| RM3 | KOM-07 | Oui | `arrivalToast.test.ts › SM-12` | |
| RM4 | KOM-07 | Oui | `arrivalToast.test.ts › SM-13` | |
| RM24 | KOM-07 | Oui | `arrivalToast.test.ts › SM-14`, `SM-15` | |
| RM25 | KOM-07 | Oui | `arrivalToast.test.ts › SM-16` | |
| RM5 | KOM-07 | Oui | `signout.test.ts › SM-17` | |
| RM31 | KOM-07 | Oui | `sessionExpiry.test.ts › SM-18` | Écrit en base via `E2E_DATABASE_URL`. |
| RM23 | contrat | Oui | `signup.test.ts › SM-20` | Prénom contenant du HTML rendu en texte brut. |
| Contrainte 9 (min 8 aux 3 endroits) | KOM-06 | Oui (partiel) | `signup.test.ts › SM-6` | SM-6 vérifie le message d'erreur ; l'indication affichée avant validation n'est vérifiée par aucun e2e. Non comptée dans le bilan. |
