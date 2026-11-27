# Rapport QA : F1-US1 Authentification

- **Run** : `F1-US1-20261127-2107`
- **Tickets testés** :
  - [KOM-06 Authentification · backend](https://app.notion.com/b2b9e90ff3c982529aec011ae302c1e3)
  - [KOM-07 Authentification · frontend](https://app.notion.com/b139e90ff3c983c2a079818cc7643919)
- **Lien testé** : https://kommit-frontend-diatigui-dev.vercel.app (backend : https://kommit-backend-diatigui-dev.onrender.com)
- **Code testé** : branche `dev`, sans les e2e du daily (KOM-19, PR #15 pas encore mergée)
- **Début** : 2026-11-27 21:07:29 (20:07:29 UTC)
- **Fin** : 2026-11-27 21:14 (20:14 UTC)
- **Durée** : 7 minutes, pour une limite de 20

Ce run suit le [run de 11:35](../F1-US1-20261127-1135/rapport.md), dont il revérifie les 3 KO.

## Bilan

- **Passe 1, cas simples : ✅ réussie.** 37 OK, 0 KO, 0 sauté.
- **Passe 2, cas tordus : ❌ 4 KO** sur 15 cas, et 11 OK. Aucune erreur JavaScript dans la console.
- **KO par gravité** : 0 ⛔ bloquant, 3 ⚠️ non bloquants, 1 💡 amélioration.

Les 3 KO ⚠️ sont ceux du run de 11:35, toujours présents. Aucun KO bloquant : rien n'empêche le déploiement.

La gravité est choisie par le workflow. Tu peux la corriger en relisant.

## KO par gravité

### ⛔ Bloquant pour le déploiement

Aucun.

### ⚠️ Non bloquant

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| P2-02 | 2 | « Se déconnecter » dans les 2 s qui suivent la connexion (déjà vu en P2-11 à 11:35) | Accueil visiteur sans toast (RM5) | Le toast « Content de te revoir … » reste affiché. Après une inscription, le toast « Bienvenue » est bien effacé | [capture](captures/F1-US1-20261127-2107-P2-02.png) |
| P2-03 | 2 | Inscription : email corrigé après « Un compte avec cet email existe déjà », sans soumettre (déjà vu en P2-06 à 11:35) | Le message disparaît | Le message reste et le champ reste marqué invalide | [capture](captures/F1-US1-20261127-2107-P2-03.png) |
| P2-04 | 2 | Connexion : mot de passe corrigé après « Email ou mot de passe incorrect. », sans soumettre (déjà vu en P2-13 à 11:35) | Le message disparaît | Le message reste jusqu'à la soumission suivante | [capture](captures/F1-US1-20261127-2107-P2-04.png) |

Les gravités de P2-03 et P2-04 passent de 💡 (run de 11:35) à ⚠️, car elles sont choisies à chaque run par l'agent explorateur.

### 💡 Amélioration optionnelle

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| P2-15 | 2 | Lien ViDev du footer à 375 px | Zone facile à toucher | Zone cliquable de 41 × 17 px, sous les 24 px conseillés | [capture](captures/F1-US1-20261127-2107-P2-15.png) |

## Passe 1 : les cas simples

Couverture RM par RM : [couverture.md](couverture.md). Sur 37 lignes RM × ticket, 34 sont couvertes par un e2e existant et 3 ne sont pas déclenchables depuis l'app. Aucun nouvel e2e n'a été nécessaire.

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
| QA-7 | qa-signin-format.test.ts | Signin avec un email mal formé, requête envoyée et message générique du serveur | RM10, RM13 | ✅ | [capture](captures/P1-qa-signin-format-qa-7-signin-avec-un-email-mal-forme-requete-envoyee-et-messa.png) |
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

Les tests marqués « — » ont été écrits pour les correctifs du 1er run, sans numéro de règle métier.

**Faux négatifs probables** : aucun, aucun test n'a échoué.

## Passe 2 : les cas tordus

| ID | Zone | Cas | Attendu | Observé | Verdict | Gravité | Capture |
|---|---|---|---|---|---|---|---|
| P2-01 | Inscription / Accueil | Prénom avec une balise `<img onerror>` et un emoji | Texte brut, aucun script | Balise affichée en texte dans le titre et le toast, aucune alerte | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-01.png) |
| P2-02 | Déconnexion | Déconnexion dans les 2 s après la connexion | Accueil visiteur sans toast | Le toast de connexion reste affiché | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-2107-P2-02.png) |
| P2-03 | Inscription | Email corrigé après « existe déjà », sans soumettre | Le message disparaît | Le message et le champ invalide restent | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-2107-P2-03.png) |
| P2-04 | Connexion | Mot de passe corrigé après « incorrect », sans soumettre | Le message disparaît | Le message reste | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-2107-P2-04.png) |
| P2-05 | Connexion | Double Entrée rapide | 1 connexion, 1 toast | 1 `sign-in`, 1 toast | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-05.png) |
| P2-06 | Connexion / session | Retour arrière après la connexion | Reste connecté, pas de 2e toast | Accueil connecté, pas de toast | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-06.png) |
| P2-07 | Déconnexion et session | Déconnexion dans un onglet, puis dans l'autre | Accueil visiteur sans erreur | Accueil visiteur sans erreur. L'onglet reste affiché connecté jusqu'au clic, peut-être à cause de Playwright | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-07.png) |
| P2-08 | Inscription / Accueil | Prénom de 200 caractères, 375 px | Mise en page tenue | Titre sur une dizaine de lignes, pas de défilement horizontal | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-08.png) |
| P2-09 | Connexion / Accueil | Clavier seul, email en casse mélangée avec espaces | Parcours au clavier, email normalisé | Parcours complet, focus visible, connexion réussie | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-09.png) |
| P2-10 | Accueil | Rechargement après la connexion | Pas de 2e toast | Pas de toast | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-10.png) |
| P2-11 | Inscription | Prénom de 5 espaces | Bouton grisé | Bouton grisé | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-11.png) |
| P2-12 | Inscription | Mot de passe de 8 espaces, Entrée | Refusé | Bouton grisé, rien n'est envoyé | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-12.png) |
| P2-13 | Connexion | Bon mot de passe suivi d'un espace | Refusé | Message générique | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-13.png) |
| P2-14 | Déconnexion | Double-clic sur « Se déconnecter » | Accueil visiteur sans erreur | Accueil visiteur, 2 `sign-out` en 200 | ✅ | | [capture](captures/F1-US1-20261127-2107-P2-14.png) |
| P2-15 | Accueil (footer) | Lien ViDev à 375 px | Nouvel onglet sécurisé, facile à toucher | Lien sécurisé, mais zone de 41 × 17 px | ❌ | 💡 | [capture](captures/F1-US1-20261127-2107-P2-15.png) |

## Comptes de test

22 comptes supprimés de la base de DEV après confirmation, avec leurs sessions : 20 créés par les e2e (`marc+…@test.dev`) et 2 par l'exploration (`qa+…@test.dev`). Une 2e vérification ne trouve plus aucun compte de test créé pendant le QA.
