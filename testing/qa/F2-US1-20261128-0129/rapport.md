# Rapport QA : F2-US1 Daily standup et calendrier

- **Run** : `F2-US1-20261128-0129`
- **Tickets testés** :
  - [KOM-19 Renseigner son daily standup · frontend](https://app.notion.com/p/6a49e90ff3c98212bf8701d4b12102f5)
  - [KOM-22 Consulter son calendrier de standups · frontend](https://app.notion.com/p/2599e90ff3c9824b85bd81e8e57c3488) (sans US sur le board, testé avec F2-US1)
- **Lien testé** : https://kommit-frontend-diatigui-dev.vercel.app (backend : https://kommit-backend-diatigui-dev.onrender.com, avec le vrai Groq)
- **Code testé** : branche `dev`. Les e2e `.nondet` (vrai LLM) ne sont pas rejoués : la passe 2 explore la conversation réelle.
- **Début** : 2026-11-28 01:29:21 (00:29:21 UTC)
- **Fin** : 2026-11-28 01:41 (00:41 UTC)
- **Durée** : 12 minutes, pour une limite de 20

## Bilan

- **Passe 1, cas simples : ✅ réussie.** 56 OK, 0 KO, 0 sauté. Ce sont tous les e2e déterministes du repo, F1-US1 compris, plus 4 nouveaux (QA-1 à QA-4 dans `e2e/qa-standup.test.ts`).
- **Passe 2, cas tordus : ❌ 4 KO** sur 15 cas, et 11 OK. Le parcours principal fonctionne avec le vrai Groq : conversation, récap, validation, carré vert, remplacement.
- **KO par gravité** : 0 ⛔ bloquant, 3 ⚠️ non bloquants, 1 💡 amélioration.

La gravité est choisie par le workflow. Tu peux la corriger en relisant.

## KO par gravité

### ⛔ Bloquant pour le déploiement

Aucun.

### ⚠️ Non bloquant

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| P2-08 | 2 | Session expirée pendant la conversation (déconnexion dans un autre onglet) | Message de session expirée, ou renvoi vers la connexion | Le backend répond 401, mais la modale affiche « Le serveur ne répond pas. Réessaie dans un instant. ». « Réessayer » refait un 401 à chaque clic | [capture](captures/F2-US1-20261128-0129-P2-08.png) |
| P2-10 | 2 | 1er message très long (5640 caractères), à 375 px | La réponse de l'IA est visible sans action | La zone de messages reste en haut : la question de l'IA est hors écran, il n'y a pas de défilement automatique vers le dernier message (déjà signalé par la review de KOM-19) | [capture](captures/F2-US1-20261128-0129-P2-10.png) |
| P2-12 | 2 | Bouton retour du navigateur en pleine conversation | Confirmation « pas encore validé », ou conversation conservée | La conversation disparaît sans confirmation. L'ancien standup reste intact | [capture](captures/F2-US1-20261128-0129-P2-12.png) |

### 💡 Amélioration optionnelle

| ID | Passe | Ce qui casse | Attendu | Observé | Capture |
|---|---|---|---|---|---|
| P2-09 | 2 | Calendrier à 375 px | Le carré du jour est visible | La grille défile horizontalement mais s'ouvre sur le début (nov. à mars) : le carré du jour, tout à droite, reste caché tant qu'on ne fait pas défiler | [capture](captures/F2-US1-20261128-0129-P2-09.png) |

## Passe 1 : les cas simples

Couverture CA par CA : [couverture.md](couverture.md). 22 lignes de CA sont couvertes par les e2e existants, dont 11 seulement par des `.nondet` (vrai LLM), explorés en passe 2. 4 CA sont couverts par les nouveaux e2e. 2 ne sont pas déclenchables : CA37 (dates pièges) et l'isolation entre utilisateurs, tenue par le serveur. CA13 (jours futurs vides) n'est couvert qu'en unitaire.

| ID | Fichier | Test | RM / CA | Verdict | Capture |
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
| QA-1 | qa-standup.test.ts | Zone vide ou faite d'espaces, envoi désactivé sur l'accueil et dans la modale | CA39 | ✅ | [capture](captures/P1-qa-standup-qa-1-zone-vide-ou-faite-d-espaces-envoi-desactive-sur-l-accu.png) |
| QA-2 | qa-standup.test.ts | Erreur SSE LLM_QUOTA_EXCEEDED, message et « Réessayer » sans perdre le fil | CA29, CA31 | ✅ | [capture](captures/P1-qa-standup-qa-2-erreur-sse-llm-quota-exceeded-message-et-reessayer-sans.png) |
| QA-3 | qa-standup.test.ts | Erreur SSE SUMMARY_MALFORMED, « Valider » jamais actif | CA32 | ✅ | [capture](captures/P1-qa-standup-qa-3-erreur-sse-summary-malformed-valider-jamais-actif-ca32.png) |
| QA-4 | qa-standup.test.ts | « Valider » reposte le récap reçu tel quel, sans date ni nouvel appel à l'IA | CA26 | ✅ | [capture](captures/P1-qa-standup-qa-4-valider-reposte-le-recap-recu-tel-quel-sans-date-ni-nou.png) |
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
| SM-1 | standupCalendar.test.ts | Compteur du serveur, semaines du dimanche au samedi, aujourd'hui en dernière colonne | CA11 | ✅ | [capture](captures/P1-standupcalendar-sm-1-compteur-du-serveur-semaines-du-dimanche-au-samedi-aujo.png) |
| SM-2 | standupCalendar.test.ts | Le jour renseigné a le liseré vert, les autres sont gris | CA12 | ✅ | [capture](captures/P1-standupcalendar-sm-2-le-jour-renseigne-a-le-lisere-vert-les-autres-sont-gris.png) |
| SM-3 | standupCalendar.test.ts | Clic sur un carré vert, modale résumé en lecture seule | CA14 | ✅ | [capture](captures/P1-standupcalendar-sm-3-clic-sur-un-carre-vert-modale-resume-en-lecture-seule-c.png) |
| SM-4 | standupCalendar.test.ts | Clic sur un carré gris, rien ne se passe | CA15 | ✅ | [capture](captures/P1-standupcalendar-sm-4-clic-sur-un-carre-gris-rien-ne-se-passe-ca15.png) |
| SM-5 | standupCalendar.test.ts | Le résumé est demandé au clic, avec un état de chargement | CA46 | ✅ | [capture](captures/P1-standupcalendar-sm-5-le-resume-est-demande-au-clic-avec-un-etat-de-chargemen.png) |
| SM-6 | standupCalendar.test.ts | HTML dans le résumé rendu en texte brut, « Aucun » pour une catégorie vide | CA30 | ✅ | [capture](captures/P1-standupcalendar-sm-6-html-dans-le-resume-rendu-en-texte-brut-aucun-pour-une-.png) |
| SM-7 | standupCalendar.test.ts | Standup disparu entre le chargement et le clic, message et calendrier rafraîchi | CA45 | ✅ | [capture](captures/P1-standupcalendar-sm-7-standup-disparu-entre-le-chargement-et-le-clic-message-.png) |
| SM-8 | standupCalendar.test.ts | Aucun standup, grille pleine de cases grises | CA43 | ✅ | [capture](captures/P1-standupcalendar-sm-8-aucun-standup-grille-pleine-de-cases-grises-ca43.png) |
| SM-9 | standupCalendar.test.ts | Échec de chargement, message d'erreur et aucune case | CA43 | ✅ | [capture](captures/P1-standupcalendar-sm-9-echec-de-chargement-message-d-erreur-et-aucune-case-ca4.png) |
| SM-18 | standupErrors.test.ts | Backend coupé pendant que l'IA écrit, message et « Réessayer » | CA29, CA31, CA32 | ✅ | [capture](captures/P1-standuperrors-sm-18-backend-coupe-pendant-que-l-ia-ecrit-message-et-reessa.png) |
| SM-1 | standupHome.test.ts | Standup du jour pas encore fait, titre avec le prénom | CA1 | ✅ | [capture](captures/P1-standuphome-sm-1-standup-du-jour-pas-encore-fait-titre-avec-le-prenom-ca.png) |
| SM-2 | standupHome.test.ts | Standup du jour déjà fait, titre de félicitation | CA8 | ✅ | [capture](captures/P1-standuphome-sm-2-standup-du-jour-deja-fait-titre-de-felicitation-ca8.png) |
| SM-3 | standupHome.test.ts | État du jour inconnu, loader à la place du titre | CA42 | ✅ | [capture](captures/P1-standuphome-sm-3-etat-du-jour-inconnu-loader-a-la-place-du-titre-ca42.png) |
| SM-16 | standupReplace.test.ts | Standup déjà fait, « Annuler » ne démarre rien | CA9 | ✅ | [capture](captures/P1-standupreplace-sm-16-standup-deja-fait-annuler-ne-demarre-rien-ca9.png) |
| SM-8 | standupSummary.test.ts | HTML dans le récap, rendu en texte brut | CA30 | ✅ | [capture](captures/P1-standupsummary-sm-8-html-dans-le-recap-rendu-en-texte-brut-ca30.png) |
| — | unknownUrl.test.ts | URL inconnue, redirection vers l’accueil | — | ✅ | [capture](captures/P1-unknownurl-url-inconnue-redirection-vers-l-accueil.png) |
| — | unknownUrl.test.ts | Connecté, URL inconnue vers l’accueil connecté sans toast | — | ✅ | [capture](captures/P1-unknownurl-connecte-url-inconnue-vers-l-accueil-connecte-sans-toast.png) |
| — | unknownUrl.test.ts | Retour navigateur après la redirection, pas de retour sur l’URL inconnue | — | ✅ | [capture](captures/P1-unknownurl-retour-navigateur-apres-la-redirection-pas-de-retour-sur-l-u.png) |

Les tests marqués « — » n'ont pas de numéro dans leur titre (correctifs du QA de F1-US1).

**Faux négatifs probables** : aucun, aucun test n'a échoué.

## Passe 2 : les cas tordus

| ID | Zone | Cas | Attendu | Observé | Verdict | Gravité | Capture |
|---|---|---|---|---|---|---|---|
| P2-01 | Saisie du daily | Saisie faite d'espaces et de retours à la ligne | « Lancer le daily » grisé | Grisé. La note « Astuce » disparaît dès le 1er espace | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-01.png) |
| P2-02 | Conversation | 1er message avec du HTML et un emoji | Texte brut, aucun script | Affiché tel quel, pas d'alerte, l'IA répond | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-02.png) |
| P2-03 | Fermer ou refaire | Échap ouvre la confirmation, puis 2e Échap | Seule la confirmation se ferme | La conversation et son historique restent | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-03.png) |
| P2-04 | Conversation | Entrée 2 fois de suite, puis un 3e message | Pas de doublon, envoi bloqué pendant que l'IA écrit | 1 envoi par message, historique complet | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-04.png) |
| P2-05 | Récap et validation | Double clic sur « Oui, je valide le daily » | 1 enregistrement, modale fermée, carré vert | 1 seul POST, « Bravo… », compteur à 1, carré vert | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-05.png) |
| P2-06 | Calendrier et résumé | Résumé ouvert au clavier, puis Échap | Résumé ouvert, focus rendu au carré | Résumé correct, focus revenu sur le carré vert | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-06.png) |
| P2-07 | Fermer ou refaire | « Refaire mon daily », puis rechargement de la page | L'ancien standup reste intact | Intact. Aucune alerte avant de quitter la page | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-07.png) |
| P2-08 | Conversation | Session expirée pendant la conversation | Message de session expirée | Message de panne serveur, « Réessayer » sans effet | ❌ | ⚠️ | [capture](captures/F2-US1-20261128-0129-P2-08.png) |
| P2-09 | Calendrier | Calendrier à 375 px | Carré du jour visible | Grille ouverte sur le début, carré du jour caché | ❌ | 💡 | [capture](captures/F2-US1-20261128-0129-P2-09.png) |
| P2-10 | Conversation | Message de 5640 caractères à 375 px | Réponse visible | Pas de défilement vers le dernier message | ❌ | ⚠️ | [capture](captures/F2-US1-20261128-0129-P2-10.png) |
| P2-11 | Fermer ou refaire | Clavier seul dans la modale, puis « Quitter le daily » | Focus gardé, sortie propre | Focus gardé dans la modale, sortie OK, ancien standup intact | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-11.png) |
| P2-12 | Fermer ou refaire | Bouton retour en pleine conversation | Confirmation, ou conversation conservée | Conversation perdue sans confirmation | ❌ | ⚠️ | [capture](captures/F2-US1-20261128-0129-P2-12.png) |
| P2-13 | Calendrier | Grille en 1280 px | Mois alignés, dimanche au samedi, carré du jour | Tout est aligné, carré du jour en bas de la dernière colonne | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-13.png) |
| P2-14 | Saisie du daily | Shift+Entrée puis Entrée dans la zone de l'accueil | Pas de lancement involontaire | Retours à la ligne, rien ne se lance | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-14.png) |
| P2-15 | Récap et validation | Remplacement validé de bout en bout | Nouveau récap, compteur à 1 | Nouveau récap, compteur à 1 | ✅ | | [capture](captures/F2-US1-20261128-0129-P2-15.png) |

Non testé : le clic sur le voile. À 375 px, la modale couvre presque tout l'écran et Playwright n'a pas pu cliquer dessus. Le cas est couvert par un e2e `.nondet` (SM-13 de KOM-19).

## Comptes de test

44 comptes supprimés de la base de DEV après confirmation, avec leurs sessions et leurs standups (`ON DELETE CASCADE`) : 43 créés par les e2e (`marc+…@test.dev`) et 1 par l'exploration (`qa+…@test.dev`). Une 2e vérification ne trouve plus aucun compte de test créé pendant le QA.
