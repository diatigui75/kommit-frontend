# Rapport QA : F1-US1 Authentification

- **Run** : `F1-US1-20261127-0034`
- **Tickets testés** :
  - [KOM-06 Authentification · backend](https://app.notion.com/b2b9e90ff3c982529aec011ae302c1e3)
  - [KOM-07 Authentification · frontend](https://app.notion.com/b139e90ff3c983c2a079818cc7643919)
- **Lien testé** : https://kommit-frontend-diatigui-dev.vercel.app (backend : https://kommit-backend-diatigui-dev.onrender.com)
- **Début** : 2026-11-27 00:34:20 (23:34:20 UTC)
- **Fin** : 2026-11-27 00:42 (23:42 UTC)
- **Durée** : 8 minutes, pour une limite de 20

## Bilan

- **Passe 1, cas simples : ✅ réussie.** 26 OK, 0 KO, 0 sauté. Ce sont les 20 e2e existants (SM-1 à SM-20) plus 6 nouveaux (QA-1 à QA-6).
- **Passe 2, cas tordus : ❌ 6 KO** sur 15 cas, et 9 OK.
- **KO par gravité** : 1 ⛔ bloquant, 5 ⚠️ non bloquants, 0 💡 amélioration.

Les 6 KO viennent de 3 causes :

1. Une URL inconnue affiche une page blanche (P2-01).
2. Un utilisateur connecté n'est jamais redirigé hors de `/signin` et `/signup` (P2-05, P2-08, P2-14).
3. Le titre de l'accueil ne coupe pas un prénom long (P2-04, P2-10).

S'y ajoute la double soumission du signup (P2-03).

La gravité est choisie par le workflow. Tu peux la corriger en relisant.

## KO par gravité

### ⛔ Bloquant pour le déploiement

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| P2-01 | 2 | URL inconnue (`/nimporte-quoi`) | Page 404 ou retour à l'accueil | Page entièrement blanche, sans navbar ni lien de retour : l'utilisateur est bloqué | [capture](captures/F1-US1-20261127-0034-P2-01.png) |

### ⚠️ Non bloquant

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| P2-03 | 2 | Double soumission rapide du signup (2 envois immédiats, comme un double Entrée) | 1 seule requête de création de compte | 2 `POST /api/auth/sign-up/email` partent : le 1er répond 500, le 2e 200. L'utilisateur finit connecté, mais le bouton ne bloque pas le 2e envoi, et le backend répond 500 au lieu d'une erreur métier | [capture](captures/F1-US1-20261127-0034-P2-03.png) |
| P2-04 | 2 | Prénom de plus de 200 caractères (emoji, accents), accueil en 1280 px | Titre qui revient à la ligne | Le titre déborde des 2 côtés de l'écran, le début et la fin sont coupés | [capture](captures/F1-US1-20261127-0034-P2-04.png) |
| P2-05 | 2 | `/signin` ouvert en étant connecté | Redirection vers l'accueil connecté | Formulaire de connexion affiché, navbar de visiteur | [capture](captures/F1-US1-20261127-0034-P2-05.png) |
| P2-08 | 2 | Retour arrière juste après la connexion | Accueil connecté, ou redirection depuis `/signin` | Retour sur `/signin` alors que la session est active (même cause que P2-05) | [capture](captures/F1-US1-20261127-0034-P2-08.png) |
| P2-10 | 2 | Fenêtre de 375 px avec le prénom long | Pas de défilement horizontal | 1569 px de large pour 375 px visibles : la page défile en largeur, titre illisible (même cause que P2-04) | [capture](captures/F1-US1-20261127-0034-P2-10.png) |
| P2-14 | 2 | `/signup` ouvert en étant connecté, puis création d'un 2e compte | Redirection ou blocage | Le 2e compte est créé et la session bascule dessus sans prévenir (même cause que P2-05) | [capture](captures/F1-US1-20261127-0034-P2-14.png) |

### 💡 Amélioration optionnelle

Aucun.

## Passe 1 : les cas simples

20 e2e existants rejoués, et 6 nouveaux écrits pour les règles métier qui n'en avaient pas (`e2e/qa-signup.test.ts`, `e2e/qa-signin.test.ts`). La couverture RM par RM est dans [couverture.md](couverture.md) : sur 36 lignes RM × ticket, 23 étaient déjà couvertes, 10 sont couvertes par les nouveaux e2e et 3 ne sont pas déclenchables depuis l'app.

| ID | Fichier | Test | RM | Verdict | Capture |
|---|---|---|---|---|---|
| SM-1 | home.test.ts | Visiteur sans session, accueil en état visiteur | RM1 | ✅ | [capture](captures/P1-home-sm-1-visiteur-sans-session-accueil-en-etat-visiteur-rm1.png) |
| SM-2 | home.test.ts | Utilisateur connecté, titre avec son prénom | RM2 | ✅ | [capture](captures/P1-home-sm-2-utilisateur-connecte-titre-avec-son-prenom-rm2.png) |
| SM-3 | home.test.ts | Lien ViDev ouvert dans un nouvel onglet | RM15 | ✅ | [capture](captures/P1-home-sm-3-lien-videv-ouvert-dans-un-nouvel-onglet-rm15.png) |
| SM-4 | navigation.test.ts | Lien « Créer un compte » vers le signup | RM6 | ✅ | [capture](captures/P1-navigation-sm-4-lien-creer-un-compte-vers-le-signup-rm6.png) |
| SM-5 | navigation.test.ts | Lien « Se connecter » vers le signin | RM7 | ✅ | [capture](captures/P1-navigation-sm-5-lien-se-connecter-vers-le-signin-rm7.png) |
| SM-6 | signup.test.ts | Signup invalide, erreurs à la soumission puis mises à jour à la saisie | RM30 | ✅ | [capture](captures/P1-signup-sm-6-signup-invalide-erreurs-a-la-soumission-puis-mises-a-jo.png) |
| SM-7 | signin.test.ts | Signin en cours, bouton désactivé avec spinner | RM17 | ✅ | [capture](captures/P1-signin-sm-7-signin-en-cours-bouton-desactive-avec-spinner-rm17-sign.png) |
| SM-8 | signup.test.ts | Signup en cours, bouton désactivé avec spinner | RM17 | ✅ | [capture](captures/P1-signup-sm-8-signup-en-cours-bouton-desactive-avec-spinner-rm17-sign.png) |
| SM-9 | signin.test.ts | Double-clic sur « Me connecter », une seule requête | RM16 | ✅ | [capture](captures/P1-signin-sm-9-double-clic-sur-me-connecter-une-seule-requete-rm16.png) |
| SM-10 | signup.test.ts | Signup réussi, retour à l'accueil connecté | RM8 | ✅ | [capture](captures/P1-signup-sm-10-signup-reussi-retour-a-l-accueil-connecte-rm8.png) |
| SM-11 | signin.test.ts | Signin réussi, retour à l'accueil connecté | RM12 | ✅ | [capture](captures/P1-signin-sm-11-signin-reussi-retour-a-l-accueil-connecte-rm12.png) |
| SM-12 | arrivalToast.test.ts | Toast d'arrivée après un signup | RM3 | ✅ | [capture](captures/P1-arrivaltoast-sm-12-toast-d-arrivee-apres-un-signup-rm3.png) |
| SM-13 | arrivalToast.test.ts | Toast d'arrivée après un signin | RM4 | ✅ | [capture](captures/P1-arrivaltoast-sm-13-toast-d-arrivee-apres-un-signin-rm4.png) |
| SM-14 | arrivalToast.test.ts | Pas de toast après un rechargement | RM24 | ✅ | [capture](captures/P1-arrivaltoast-sm-14-pas-de-toast-apres-un-rechargement-rm24.png) |
| SM-15 | arrivalToast.test.ts | Pas de toast après un « retour » puis « suivant » | RM24 | ✅ | [capture](captures/P1-arrivaltoast-sm-15-pas-de-toast-apres-un-retour-puis-suivant-navigateur-r.png) |
| SM-16 | arrivalToast.test.ts | Session persistée, ouverture directe de l'accueil sans toast | RM25 | ✅ | [capture](captures/P1-arrivaltoast-sm-16-session-persistee-ouverture-directe-de-l-accueil-sans-.png) |
| SM-17 | signout.test.ts | Déconnexion silencieuse | RM5 | ✅ | [capture](captures/P1-signout-sm-17-deconnexion-silencieuse-rm5.png) |
| SM-18 | sessionExpiry.test.ts | Session expirée, accueil visiteur sans message | RM31 | ✅ | [capture](captures/P1-sessionexpiry-sm-18-session-expiree-accueil-visiteur-sans-message-rm31.png) |
| SM-19 | signin.test.ts | Backend coupé, message de panne et action re-tentable | RM18, RM19 | ✅ | [capture](captures/P1-signin-sm-19-backend-coupe-message-de-panne-et-action-re-tentable-r.png) |
| SM-20 | signup.test.ts | Prénom contenant du HTML, rendu en texte brut | RM23 | ✅ | [capture](captures/P1-signup-sm-20-prenom-contenant-du-html-rendu-en-texte-brut-rm23.png) |
| QA-1 | qa-signup.test.ts | Bouton « Créer un compte » grisé tant qu'un champ requis est vide, prénom d'espaces compris | RM33, RM11, RM20 | ✅ | [capture](captures/P1-qa-signup-qa-1-bouton-creer-un-compte-grise-tant-qu-un-champ-requis-es.png) |
| QA-2 | qa-signup.test.ts | Email déjà utilisé, message sous le champ Email | RM9 | ✅ | [capture](captures/P1-qa-signup-qa-2-email-deja-utilise-message-sous-le-champ-email-rm9.png) |
| QA-3 | qa-signup.test.ts | Email existant saisi en majuscules et entouré d'espaces, refusé | RM21 | ✅ | [capture](captures/P1-qa-signup-qa-3-email-existant-saisi-en-majuscules-et-entoure-d-espaces.png) |
| QA-4 | qa-signup.test.ts | Mot de passe de plus de 128 caractères, refusé | RM10 | ✅ | [capture](captures/P1-qa-signup-qa-4-mot-de-passe-de-plus-de-128-caracteres-refuse-rm10.png) |
| QA-5 | qa-signin.test.ts | Bouton « Me connecter » grisé tant qu'un champ est vide, aucune requête | RM32 | ✅ | [capture](captures/P1-qa-signin-qa-5-bouton-me-connecter-grise-tant-qu-un-champ-est-vide-auc.png) |
| QA-6 | qa-signin.test.ts | Mauvais mot de passe, message générique sans champ désigné | RM13 | ✅ | [capture](captures/P1-qa-signin-qa-6-mauvais-mot-de-passe-message-generique-sans-champ-desig.png) |

**Faux négatifs probables** : aucun, aucun test n'a échoué.

**Limites de couverture** (détail dans `couverture.md`) :
- **Non testables depuis l'app** : KOM-06 RM2 (le 401 sans session), RM11 et RM20 (le front bloque avant d'atteindre le serveur).
- **RM18 et RM19** : testées seulement avec un backend coupé, pas avec une vraie erreur 500.
- **RM16** : le double-clic n'est testé qu'au signin. P2-03 montre justement le problème au signup.

## Passe 2 : les cas tordus

| ID | Zone | Cas | Attendu | Observé | Verdict | Gravité | Capture |
|---|---|---|---|---|---|---|---|
| P2-01 | Accueil | URL inconnue `/nimporte-quoi` | Page 404 ou retour à l'accueil | Page entièrement blanche, sans navbar ni lien de retour | ❌ | ⛔ | [capture](captures/F1-US1-20261127-0034-P2-01.png) |
| P2-02 | Inscription | Prénom fait uniquement d'espaces | Bouton grisé ou erreur | Bouton grisé | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-02.png) |
| P2-03 | Inscription | Double soumission rapide | 1 seule requête | 2 requêtes, 1re en 500, 2e en 200 | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-0034-P2-03.png) |
| P2-04 | Accueil | Prénom de plus de 200 caractères, 1280 px | Titre qui revient à la ligne | Titre qui déborde, coupé des 2 côtés | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-0034-P2-04.png) |
| P2-05 | Connexion | `/signin` en étant connecté | Redirection vers l'accueil | Formulaire de connexion affiché | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-0034-P2-05.png) |
| P2-06 | Déconnexion et session | Déconnexion dans un onglet, puis dans l'autre | Accueil visiteur sans erreur | Accueil visiteur sans erreur | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-06.png) |
| P2-07 | Connexion | Compte créé en majuscules avec espaces, connexion en minuscules | Connexion réussie | Connexion réussie | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-07.png) |
| P2-08 | Connexion | Retour arrière après la connexion | Accueil connecté ou redirection | Retour sur `/signin` avec session active | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-0034-P2-08.png) |
| P2-09 | Accueil | Avancer pour revenir sur l'accueil | Pas de 2e toast | Pas de toast | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-09.png) |
| P2-10 | Accueil | 375 px avec le prénom long | Pas de défilement horizontal | Page de 1569 px de large | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-0034-P2-10.png) |
| P2-11 | Déconnexion et session | Clavier seul en 375 px, Tab puis Entrée sur « Se déconnecter » | Focus visible, déconnexion | Focus visible, déconnexion | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-11.png) |
| P2-12 | Inscription | Mot de passe de 8 espaces | Refus | Bouton grisé | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-12.png) |
| P2-13 | Connexion | Email avec espaces et casse mélangée, envoi avec Entrée | Connexion réussie | Connexion réussie | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-13.png) |
| P2-14 | Inscription | `/signup` en étant connecté, création d'un 2e compte | Redirection ou blocage | 2e compte créé, session basculée sans prévenir | ❌ | ⚠️ | [capture](captures/F1-US1-20261127-0034-P2-14.png) |
| P2-15 | Déconnexion et session | Retour arrière après « Se déconnecter » | Aucune page connectée ni donnée réaffichée | `/signup` avec les champs vides | ✅ | | [capture](captures/F1-US1-20261127-0034-P2-15.png) |

L'emoji du prénom long s'affiche comme un carré vide sur les captures. C'est probablement la police du navigateur de test : ce n'est pas compté comme un défaut.

## Comptes de test

17 comptes supprimés de la base de DEV après confirmation, avec leurs sessions : 15 créés par les e2e (`marc+…@test.dev`) et 2 par l'exploration (`qa+…@test.dev`). Le 3e compte prévu par l'exploration n'a jamais été créé (P2-12, bouton resté grisé). Une 2e vérification ne trouve plus aucun compte de test créé pendant le QA.
