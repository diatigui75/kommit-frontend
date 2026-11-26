# F2 : flux du daily (15 captures)

Fichiers : `screenshots/<NN>-<description>.png`. Captures faites à la main, sans extraction Figma : pas de node-id, pas de code brut, pas d'assets. Les valeurs de style (couleurs, tailles, polices) ne sont donc disponibles nulle part en dehors des images.

## Pages

- **Accueil connecté, daily à faire** : header avec logo Kommit et bouton « Se déconnecter » (icône de sortie). Titre « Quoi de neuf aujourd'hui, Marc ? » (prénom en bleu) + sous-titre « Renseigne ton daily du jour ci-dessous. » Carte de saisie : zone de texte multiligne avec placeholder « Renseigne tes progrès, tes éventuels blocages et ce que tu vas faire ... », séparateur, bouton « Lancer le daily » (icône d'envoi). Une note « ASTUCE » (icône info) penchée, en post-it, déborde du coin haut droit de la carte : « Garde tes daily courts pour une meilleure vue d'ensemble en fin de semaine ». Sous la carte, une carte calendrier : titre « <N> daily renseigné(s) sur l'année », grille de cases par jour sur 12 mois (juin à mai), lignes libellées Lun / Mer / Ven, légende « Daily non renseigné » (case grise) et « Daily enregistré » (case cerclée de vert). Pied de page « Créé par ViDev © 2026 Kommit. Tous droits réservés. »
- **Accueil connecté, daily déjà renseigné** : même page, titre « Ton daily du jour est déjà renseigné, Marc ! » et sous-titre « En renseignant ton daily du jour à nouveau, il remplacera l'existant. »
- **Chat du daily** (modale au-dessus de l'accueil, fond assombri et flouté) : header avec avatar robot, « Daily Standup Assistant », point vert + « Live Sync Active », croix de fermeture. Fil de messages : messages de l'utilisateur à droite (bulles bleues pleines, texte blanc), messages de l'assistant à gauche (bulles bleu très clair). Sous certaines bulles de l'assistant, des réponses rapides en puces cliquables. Champ « Écrire un message ... » avec bouton d'envoi en bas.
- **Résumé d'un daily passé** (modale en lecture seule) : même header, avec à la place de « Live Sync Active » la mention « En date du mercredi 15 mai 2026 » (icône calendrier). Une seule bulle de l'assistant avec le résumé. Pas de champ de saisie.
- **Popup « quitter le daily »** (au-dessus du chat) : icône d'alerte ronde, titre « Le daily standup n'est pas encore validé. », texte « En quittant cette conversation, tout l'échange sera définitivement perdu. Es-tu sûr de vouloir quitter ? », croix de fermeture, 2 boutons : « Poursuivre le daily » (contour bleu) et « Quitter le daily » (contour rouge, icône de porte).

Le résumé du daily, dans le chat comme dans la modale de lecture, est un encart avec 3 sections titrées en petites capitales bleues : **HIER**, **BLOCAGES**, **À VENIR**, chacune en liste à puces.

## Parcours 1 : saisir et lancer le daily (01 à 04)

- **État 01 : Accueil, daily à faire, vide.** Placeholder visible, note ASTUCE visible, calendrier « 0 daily renseigné(s) sur l'année », aucune case verte. Le bouton « Lancer le daily » a l'air actif alors que le champ est vide.
- **État 02 : Accueil, texte saisi.** « J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV. » La note ASTUCE a disparu.
- **État 03 : survol de « Lancer le daily ».** Curseur main, le bouton s'éclaircit.
- **État 04 : clic sur « Lancer le daily ».** Curseur main en variante « cliquant », le bouton reprend un rendu proche du repos. Clic = ouverture du chat.

## Parcours 2 : conversation avec l'assistant (05)

- **État 05 : Chat ouvert.** Le texte saisi est repris comme 1er message de l'utilisateur. L'assistant répond « Excellent travail ! La migration de l'authentification était un gros morceau. As-tu rencontré des blocages pour le déploiement en DEV ou je note qu'il reste du travail pour ce ticket CCE-12 ? », avec 2 réponses rapides : « Pas de blocage, RAS » et « Non, je dois encore modifier des choses en DEV ». L'utilisateur a choisi « Pas de blocage, RAS » (sa réponse apparaît en bulle bleue). L'assistant : « Très bien, je note que tu n'as eu aucun blocage. Je sais déjà ce que tu vas faire aujourd'hui. Je suis prêt à résumer ton daily. », puis « Voici le résumé de ton daily. Tu valides ? » avec le résumé (coupé en bas, le fil défile).

## Parcours 3 : tentative de fermeture du chat (06 à 10)

- **État 06 : survol de la croix du chat.** Curseur main sur la croix.
- **État 07 : popup de confirmation ouverte.** Le chat est assombri derrière. Boutons au repos.
- **État 08 : survol de « Poursuivre le daily ».** Le bouton s'éclaircit (fond bleu très léger).
- **État 09 : clic sur « Poursuivre le daily ».** Traits autour du bouton (annotation de clic). Clic = fermer la popup et revenir au chat.
- **État 10 : survol de « Quitter le daily ».** Le bouton passe en fond rouge plein, texte et icône blancs.

## Parcours 4 : ajouter une info puis valider (11 à 13)

- **État 11 : chat, ajout d'une info.** Le fil a défilé. Résumé complet : HIER (« Migration de l'authentification vers la nouvelle API terminée », « Problèmes de persistance des cookies JWT en production résolus »), BLOCAGES (« Aucun »), À VENIR (« Déploiement des mises à jour en DEV », « Vérification du flux d'authentification en DEV »). Réponses rapides : « Oui, je valide le daily » et « Non, j'aimerais ajouter une info. ». L'utilisateur a choisi la 2e. L'assistant : « Que souhaites-tu ajouter ? ». Champ rempli : « Je vais aussi updater le favico avec le nouveau logo. », curseur main sur le bouton d'envoi.
- **État 12 : variante de l'état 11.** Même écran, seul le texte du champ change : « Je vais aussi updater le nouveau logo du Designer reçu hier. » Pas de curseur.
- **État 13 : résumé actualisé et daily validé.** Le message de l'état 11 est envoyé. L'assistant : « C'est noté, voici le résumé actualisé : », À VENIR gagne « Updater le favico avec le nouveau logo ». Mêmes 2 réponses rapides, l'utilisateur choisit « Oui, je valide le daily ». L'assistant : « Daily validé, il est ajouté à ton calendrier avec succès. » Le chat reste ouvert.

## Parcours 5 : daily déjà renseigné (14, 15)

- **État 14 : Accueil, daily déjà renseigné.** Nouveau titre et sous-titre, champ vide avec placeholder, note ASTUCE visible, calendrier « 1 daily renseigné(s) sur l'année » avec 1 case cerclée de vert (dernière colonne, sur la ligne Mer).
- **État 15 : résumé du daily passé.** Modale de lecture : « Voici le résumé du daily du mercredi 15 mai 2026 » + résumé actualisé de l'état 13.

## Résumé du flux

Accueil vide (01) -> saisie (02) -> survol puis clic « Lancer le daily » (03, 04) -> chat (05).
Chat (05) -> survol croix (06) -> popup (07) -> « Poursuivre » (08, 09) revient au chat, ou « Quitter » (10).
Chat (11, 12) -> ajout d'une info -> résumé actualisé -> validation (13).
Accueil déjà renseigné (14) -> ouverture du résumé du jour (15).

Pages : Accueil daily à faire (01 à 04), Chat (05, 06, 11 à 13), Popup quitter (07 à 10), Accueil déjà renseigné (14), Résumé passé (15).

## Points à confirmer

- **Design system** : celui de F1, déjà en code (tokens de `src/index.css`, composants de `src/components/ui/` : Navbar, Footer, PageLayout, Logo, button, card, input, sonner). Le header, le pied de page, les cartes et le bleu des titres de F2 sont identiques. Les éléments nouveaux n'ont pas de token : rouge du bouton « Quitter le daily », note ASTUCE, bulles du chat, cases du calendrier, voile derrière les modales.
- **Pas de capture après « Quitter le daily »** : retour à l'accueil vide ou avec le texte conservé ? Le texte de la popup dit que l'échange est perdu.
- **Pas de capture de la fermeture du chat après validation** (entre 13 et 14) : fermeture automatique, croix, ou message de l'assistant ? Et la croix d'un chat validé ouvre-t-elle encore la popup ?
- **Déclencheur de l'état 15** : aucun curseur visible. Clic sur la case verte du calendrier, supposé.
- **Bouton « Lancer le daily » à vide** (état 01) : actif ou désactivé ? Le rendu ne diffère pas de l'état 02.
- **Date incohérente** : le 15 mai 2026 est un vendredi, pas un mercredi, et la case verte est sur la ligne Mer.
- **Fil coupé à l'état 05** : la fin du 1er résumé et ses réponses rapides ne sont visibles qu'à l'état 11.
- **Rôle de l'état 12** : simple variante de texte, ou autre cas à gérer ?
- **Message utilisateur** : « Prêts à pousser » dans le champ (02) devient « Prêt à pousser » dans le chat (05).
- Les curseurs (main, main jaune « cliquant ») et les traits de l'état 09 sont des annotations d'interaction, pas de l'UI.
