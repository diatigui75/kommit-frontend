# Rapport QA : F1-US1 Authentification

- **Run** : `F1-US1-20261127-1121`
- **Tickets testés** :
  - [KOM-06 Authentification · backend](https://app.notion.com/b2b9e90ff3c982529aec011ae302c1e3)
  - [KOM-07 Authentification · frontend](https://app.notion.com/b139e90ff3c983c2a079818cc7643919)
- **Lien testé** : https://kommit-frontend-diatigui-dev.vercel.app (backend : https://kommit-backend-diatigui-dev.onrender.com)
- **Début** : 2026-11-27 11:21:51 (10:21:51 UTC)
- **Fin** : 2026-11-27 11:25 (10:25 UTC)
- **Durée** : 4 minutes, pour une limite de 20

Ce run suit le correctif des 6 KO du run [F1-US1-20261127-0034](../F1-US1-20261127-0034/rapport.md).

## Bilan

- **Passe 1, cas simples : ❌ échouée.** 36 OK, 1 KO, 0 sauté sur 37 tests : les 36 e2e existants (dont les 10 qui verrouillent les correctifs du run précédent), plus 1 nouveau (QA-7).
- **Passe 2, cas tordus : non faite.** La passe 1 a 1 KO, donc la RM9 interdit de passer à la passe 2.
- **KO par gravité** : 0 ⛔ bloquant, 1 ⚠️ non bloquant, 0 💡 amélioration.

Les 6 KO du run précédent ne réapparaissent pas : leurs 10 e2e passent tous sur le lien de DEV.

La gravité est choisie par le workflow. Tu peux la corriger en relisant.

## KO par gravité

### ⛔ Bloquant pour le déploiement

Aucun.

### ⚠️ Non bloquant

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| QA-7 | 1 | Signin avec un email mal formé (`pas-un-email`) | Message générique « Email ou mot de passe incorrect. », sans désigner de champ (RM13) | Le backend répond `VALIDATION_ERROR` et l'écran affiche « L'email n'est pas valide. » | [capture](captures/P1-qa-signin-format-qa-7-signin-avec-un-email-mal-forme-requete-envoyee-et-messa.png) |

**À trancher** : ce KO vient peut-être de l'interprétation du test plutôt que de l'app. La RM13 de KOM-06 veut un message générique pour « un email ou un mot de passe incorrect ». Mais la contrainte technique 7 demande au serveur de valider toutes les saisies avec Zod, signin compris, et le front affiche le message de `VALIDATION_ERROR` comme le prévoit l'arbitrage 3 de KOM-07. 2 issues possibles :
- le backend renvoie `INVALID_CREDENTIALS` pour un email mal formé au signin ;
- c'est le comportement voulu, et tu supprimes `e2e/qa-signin-format.test.ts`.

### 💡 Amélioration optionnelle

Aucun.

## Passe 1 : les cas simples

Couverture RM par RM : [couverture.md](couverture.md). Sur 37 lignes RM × ticket, 33 sont couvertes par un e2e existant, 1 par le nouvel e2e (`e2e/qa-signin-format.test.ts`) et 3 ne sont pas déclenchables depuis l'app.

| ID | Fichier | Test | RM | Verdict | Capture |
|---|---|---|---|---|---|
| SM-12 | arrivalToast.test.ts | Toast d'arrivée après un signup | RM3 | ✅ | [capture](captures/P1-arrivaltoast-sm-12-toast-d-arrivee-apres-un-signup-rm3.png) |
| SM-13 | arrivalToast.test.ts | Toast d'arrivée après un signin | RM4 | ✅ | [capture](captures/P1-arrivaltoast-sm-13-toast-d-arrivee-apres-un-signin-rm4.png) |
| SM-14 | arrivalToast.test.ts | Pas de toast après un rechargement | RM24 | ✅ | [capture](captures/P1-arrivaltoast-sm-14-pas-de-toast-apres-un-rechargement-rm24.png) |
| SM-15 | arrivalToast.test.ts | Pas de toast après un « retour » puis « suivant » navigateur | RM24 | ✅ | [capture](captures/P1-arrivaltoast-sm-15-pas-de-toast-apres-un-retour-puis-suivant-navigateur-r.png) |
| SM-16 | arrivalToast.test.ts | Session persistée, ouverture directe de l'accueil sans toast | RM25 | ✅ | [capture](captures/P1-arrivaltoast-sm-16-session-persistee-ouverture-directe-de-l-accueil-sans-.png) |
| — | authPagesWhenConnected.test.ts | Connecté, /signin renvoie vers l’accueil connecté | — | ✅ | [capture](captures/P1-authpageswhenconnected-connecte-signin-renvoie-vers-l-accueil-connecte.png) |
| — | authPagesWhenConnected.test.ts | Connecté, /signup renvoie vers l’accueil connecté | — | ✅ | [capture](captures/P1-authpageswhenconnected-connecte-signup-renvoie-vers-l-accueil-connecte.png) |
| — | authPagesWhenConnected.test.ts | Retour navigateur après la connexion, pas de retour sur le formulaire | — | ✅ | [capture](captures/P1-authpageswhenconnected-retour-navigateur-apres-la-connexion-pas-de-retour-sur-le-fo.png) |
| — | doubleSubmit.test.ts | Signin soumis 2 fois dans le même instant, une seule requête | — | ✅ | [capture](captures/P1-doublesubmit-signin-soumis-2-fois-dans-le-meme-instant-une-seule-requete.png) |
| — | doubleSubmit.test.ts | Signup soumis 2 fois dans le même instant, une seule requête | — | ✅ | [capture](captures/P1-doublesubmit-signup-soumis-2-fois-dans-le-meme-instant-une-seule-requete.png) |
| SM-1 | home.test.ts | Visiteur sans session, accueil en état visiteur | RM1 | ✅ | [capture](captures/P1-home-sm-1-visiteur-sans-session-accueil-en-etat-visiteur-rm1.png) |
| SM-2 | home.test.ts | Utilisateur connecté, titre avec son prénom | RM2 | ✅ | [capture](captures/P1-home-sm-2-utilisateur-connecte-titre-avec-son-prenom-rm2.png) |
| SM-3 | home.test.ts | Lien ViDev ouvert dans un nouvel onglet | RM15 | ✅ | [capture](captures/P1-home-sm-3-lien-videv-ouvert-dans-un-nouvel-onglet-rm15.png) |
| — | longFirstName.test.ts | Prénom de 200 caractères, titre de l’accueil sans débordement en 1280 px | — | ✅ | [capture](captures/P1-longfirstname-prenom-de-200-caracteres-titre-de-l-accueil-sans-debordement.png) |
| — | longFirstName.test.ts | Prénom de 200 caractères, titre de l’accueil sans débordement en 375 px | — | ✅ | [capture](captures/P1-longfirstname-prenom-de-200-caracteres-titre-de-l-accueil-sans-debordement.png) |
| SM-4 | navigation.test.ts | Lien « Créer un compte » vers le signup | RM6 | ✅ | [capture](captures/P1-navigation-sm-4-lien-creer-un-compte-vers-le-signup-rm6.png) |
| SM-5 | navigation.test.ts | Lien « Se connecter » vers le signin | RM7 | ✅ | [capture](captures/P1-navigation-sm-5-lien-se-connecter-vers-le-signin-rm7.png) |
| QA-7 | qa-signin-format.test.ts | Signin avec un email mal formé, requête envoyée et message générique du serveur | RM10, RM13 | ❌ | [capture](captures/P1-qa-signin-format-qa-7-signin-avec-un-email-mal-forme-requete-envoyee-et-messa.png) |
| QA-5 | qa-signin.test.ts | Bouton « Me connecter » grisé tant qu'un champ est vide, aucune requête | RM32 | ✅ | [capture](captures/P1-qa-signin-qa-5-bouton-me-connecter-grise-tant-qu-un-champ-est-vide-auc.png) |
| QA-6 | qa-signin.test.ts | Mauvais mot de passe, message générique sans champ désigné | RM13 | ✅ | [capture](captures/P1-qa-signin-qa-6-mauvais-mot-de-passe-message-generique-sans-champ-desig.png) |
| QA-1 | qa-signup.test.ts | Bouton « Créer un compte » grisé tant qu'un champ requis est vide, prénom d'espaces compris | RM33, RM11, RM20 | ✅ | [capture](captures/P1-qa-signup-qa-1-bouton-creer-un-compte-grise-tant-qu-un-champ-requis-es.png) |
| QA-2 | qa-signup.test.ts | Email déjà utilisé, message sous le champ Email | RM9 | ✅ | [capture](captures/P1-qa-signup-qa-2-email-deja-utilise-message-sous-le-champ-email-rm9.png) |
| QA-3 | qa-signup.test.ts | Email existant saisi en majuscules et entouré d'espaces, refusé | RM21 | ✅ | [capture](captures/P1-qa-signup-qa-3-email-existant-saisi-en-majuscules-et-entoure-d-espaces.png) |
| QA-4 | qa-signup.test.ts | Mot de passe de plus de 128 caractères, refusé | RM10 | ✅ | [capture](captures/P1-qa-signup-qa-4-mot-de-passe-de-plus-de-128-caracteres-refuse-rm10.png) |
| SM-18 | sessionExpiry.test.ts | Session expirée, accueil visiteur sans message | RM31 | ✅ | [capture](captures/P1-sessionexpiry-sm-18-session-expiree-accueil-visiteur-sans-message-rm31.png) |
| SM-11 | signin.test.ts | Signin réussi, retour à l'accueil connecté | RM12 | ✅ | [capture](captures/P1-signin-sm-11-signin-reussi-retour-a-l-accueil-connecte-rm12.png) |
| SM-19 | signin.test.ts | Backend coupé, message de panne et action re-tentable | RM18, RM19 | ✅ | [capture](captures/P1-signin-sm-19-backend-coupe-message-de-panne-et-action-re-tentable-r.png) |
| SM-7 | signin.test.ts | Signin en cours, bouton désactivé avec spinner | RM17, signin | ✅ | [capture](captures/P1-signin-sm-7-signin-en-cours-bouton-desactive-avec-spinner-rm17-sign.png) |
| SM-9 | signin.test.ts | Double-clic sur « Me connecter », une seule requête | RM16 | ✅ | [capture](captures/P1-signin-sm-9-double-clic-sur-me-connecter-une-seule-requete-rm16.png) |
| SM-17 | signout.test.ts | Déconnexion silencieuse | RM5 | ✅ | [capture](captures/P1-signout-sm-17-deconnexion-silencieuse-rm5.png) |
| SM-10 | signup.test.ts | Signup réussi, retour à l'accueil connecté | RM8 | ✅ | [capture](captures/P1-signup-sm-10-signup-reussi-retour-a-l-accueil-connecte-rm8.png) |
| SM-20 | signup.test.ts | Prénom contenant du HTML, rendu en texte brut | RM23 | ✅ | [capture](captures/P1-signup-sm-20-prenom-contenant-du-html-rendu-en-texte-brut-rm23.png) |
| SM-6 | signup.test.ts | Signup invalide, erreurs à la soumission puis mises à jour à la saisie | RM30 | ✅ | [capture](captures/P1-signup-sm-6-signup-invalide-erreurs-a-la-soumission-puis-mises-a-jo.png) |
| SM-8 | signup.test.ts | Signup en cours, bouton désactivé avec spinner | RM17, signup | ✅ | [capture](captures/P1-signup-sm-8-signup-en-cours-bouton-desactive-avec-spinner-rm17-sign.png) |
| — | unknownUrl.test.ts | URL inconnue, redirection vers l’accueil | — | ✅ | [capture](captures/P1-unknownurl-url-inconnue-redirection-vers-l-accueil.png) |
| — | unknownUrl.test.ts | Connecté, URL inconnue vers l’accueil connecté sans toast | — | ✅ | [capture](captures/P1-unknownurl-connecte-url-inconnue-vers-l-accueil-connecte-sans-toast.png) |
| — | unknownUrl.test.ts | Retour navigateur après la redirection, pas de retour sur l’URL inconnue | — | ✅ | [capture](captures/P1-unknownurl-retour-navigateur-apres-la-redirection-pas-de-retour-sur-l-u.png) |

Les tests marqués « — » ont été écrits pour les correctifs du run précédent, sans numéro de règle métier.

**Faux négatifs probables** : QA-7 peut-être (voir « À trancher » plus haut).

## Passe 2 : les cas tordus

Non faite : la passe 1 a 1 KO (RM9).

## Comptes de test

20 comptes supprimés de la base de DEV après confirmation, avec leurs sessions : tous créés par les e2e de la passe 1, en `@test.dev`. Une 2e vérification ne trouve plus aucun compte de test créé pendant le QA.
