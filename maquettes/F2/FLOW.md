# F2 : flux du daily standup (15 captures)

Fichiers : `screenshots/<NN>-<description>.png`. Pas de node-id Figma : ces captures ne viennent pas du MCP.

Le code brut (`code-brut/`) est reconstruit à la main depuis les bruts de F1, pas extrait de Figma. `F2-kit-brut.jsx` contient les briques communes, et chaque `F2-<NN>-…-brut.jsx` assemble un écran. Les valeurs sans marque sont copiées de F1. Celles marquées « ~ » sont estimées depuis les captures, à confirmer dans Figma. `assets-bruts/` ne contient que le logo et l'icône log-out, copiés de F1. Les autres icônes sont nommées par leur nom Lucide en `data-name`.

## Pages et fenêtres

- **Accueil connecté, daily non renseigné** : header avec logo et « Se déconnecter », titre « Quoi de neuf aujourd'hui, Marc ? » + sous-titre « Renseigne ton daily du jour ci-dessous. » Carte de saisie : zone de texte (placeholder « Renseigne tes progrès, tes éventuels blocages et ce que tu vas faire … »), bouton « Lancer le daily » avec icône d'envoi. Une note « Astuce » penchée déborde en haut à droite de la carte : « Garde tes daily courts pour une meilleure vue d'ensemble en fin de semaine ». Dessous, carte calendrier « 0 daily renseigné(s) sur l'année » : grille d'une case par jour sur 12 mois (juin à mai), lignes libellées Lun, Mer, Ven, légende « Daily non renseigné » / « Daily enregistré ». Pied de page.
- **Accueil connecté, daily déjà renseigné** : même page, titre « Ton daily du jour est déjà renseigné, Marc ! » + sous-titre « En renseignant ton daily du jour à nouveau, il remplacera l'existant. » Zone de texte vide, compteur « 1 daily renseigné(s) sur l'année », une case du calendrier en vert (ligne Mer, colonne mai).
- **Fenêtre de chat « Daily Standup Assistant »** : fenêtre modale par-dessus l'accueil, qui est assombri et flouté. En-tête avec icône de robot, titre, statut « Live Sync Active » avec un point vert, croix de fermeture. Messages de l'utilisateur à droite (bulles bleues pleines), messages de l'assistant à gauche (bulles claires). Réponses rapides sous certains messages de l'assistant, en boutons-pastilles. Champ « Écrire un message … » et bouton d'envoi en bas.
- **Popup de confirmation de sortie** : petite modale par-dessus le chat. Icône « ! » dans un cercle, titre « Le daily standup n'est pas encore validé. », texte « En quittant cette conversation, tout l'échange sera définitivement perdu. Es-tu sûr de vouloir quitter ? », croix de fermeture, 2 boutons : « Poursuivre le daily » (contour bleu) et « Quitter le daily » (contour rouge, icône de porte).
- **Fenêtre de résumé d'un daily passé** : même en-tête « Daily Standup Assistant », mais le statut devient « En date du mercredi 15 mai 2026 » (icône d'horloge). Un seul message : « Voici le résumé du daily du mercredi 15 mai 2026 » + le bloc de résumé. Pas de champ de saisie.

## Le bloc de résumé

Encadré dans une bulle de l'assistant, 3 sections titrées en petites capitales bleues :

- **HIER** : « Migration de l'authentification vers la nouvelle API terminée », « Problèmes de persistance des cookies JWT en production résolus ».
- **BLOCAGES** : « Aucun ».
- **À VENIR** : « Déploiement des mises à jour en DEV », « Vérification du flux d'authentification en DEV ».

## Parcours 1 : lancer le daily (01 à 05)

- **État 01 : Accueil, daily non renseigné, zone vide.** Bouton « Lancer le daily » au repos. Il n'a pas l'air désactivé alors que la zone est vide (à confirmer).
- **État 02 : Texte saisi.** « J'ai terminé la migration de l'authentification vers la nouvelle API et résolu les problèmes relou de cookies JWT qu'on voyait en production. Prêts à pousser en DEV. » La note « Astuce » a disparu dès qu'il y a du texte.
- **État 03 : Survol de « Lancer le daily ».** Curseur main, le bouton s'éclaircit.
- **État 04 : Clic sur « Lancer le daily ».** Curseur main en variante « cliquant » (doigt jaune).
- **État 05 : Chat ouvert, conversation jusqu'au résumé.** Le texte saisi devient le 1er message de l'utilisateur. L'assistant répond « Excellent travail ! La migration de l'authentification était un gros morceau. As-tu rencontré des blocages pour le déploiement en DEV ou je note qu'il reste du travail pour ce ticket CCE-12 ? » avec 2 réponses rapides : « Pas de blocage, RAS » et « Non, je dois encore modifier des choses en DEV ». L'utilisateur choisit « Pas de blocage, RAS », qui apparaît comme son message. L'assistant : « Très bien, je note que tu n'as eu aucun blocage. Je sais déjà ce que tu vas faire aujourd'hui. Je suis prêt à résumer ton daily. » puis « Voici le résumé de ton daily. Tu valides ? » + le bloc de résumé. La conversation défile, le bas est coupé.

## Parcours 2 : tenter de quitter le chat (06 à 10)

- **État 06 : Survol de la croix du chat.** Curseur main sur la croix.
- **État 07 : Popup de confirmation affichée.** Le chat passe en arrière-plan, assombri. Curseur sous « Poursuivre le daily ».
- **État 08 : Survol de « Poursuivre le daily ».** Le bouton s'éclaircit (fond bleu très pâle).
- **État 09 : Clic sur « Poursuivre le daily ».** Traits rayonnants autour du bouton : annotation de clic, pas de l'UI. On en déduit que la popup se ferme et qu'on revient au chat, sans frame qui le montre.
- **État 10 : Survol de « Quitter le daily ».** Le bouton passe en rouge plein, texte et icône en blanc. Pas de frame après le clic : on suppose fermeture du chat et perte de l'échange (texte de la popup), à confirmer.

## Parcours 3 : ajouter une info puis valider (11 à 13)

- **État 11 : Ajout d'une info, saisie.** Sous le résumé, 2 réponses rapides : « Oui, je valide le daily » et « Non, j'aimerais ajouter une info. » L'utilisateur a choisi la 2e (son message). L'assistant : « Que souhaites-tu ajouter ? » Le champ du bas contient « Je vais aussi updater le favico avec le nouveau logo. », curseur main sur le bouton d'envoi.
- **État 12 : Variante de l'état 11.** Même écran, seul le texte du champ change : « Je vais aussi updater le nouveau logo du Designer reçu hier. » Curseur absent.
- **État 13 : Résumé actualisé, daily validé.** Le message de l'état 11 est envoyé. L'assistant : « C'est noté, voici le résumé actualisé : » avec le bloc de résumé, où « À VENIR » gagne une 3e ligne « Updater le favico avec le nouveau logo ». Mêmes 2 réponses rapides. L'utilisateur choisit « Oui, je valide le daily ». L'assistant : « Daily validé, il est ajouté à ton calendrier avec succès. » Le champ du bas est revenu vide.

## Parcours 4 : daily déjà renseigné (14 et 15)

- **État 14 : Accueil, daily déjà renseigné.** Voir la page plus haut. La note « Astuce » est de retour (zone vide). Bouton « Lancer le daily » au repos.
- **État 15 : Résumé d'un daily passé.** Fenêtre de résumé du mercredi 15 mai 2026, avec le résumé actualisé de l'état 13 (3 lignes dans « À VENIR »). Aucune frame ne montre ce qui l'ouvre : le plus probable est un clic sur la case verte du calendrier.

## Résumé du flux

Accueil non renseigné (01) -> saisie (02) -> « Lancer le daily » (03, 04) -> chat jusqu'au résumé (05).
Chat (06) -> croix -> popup (07) -> « Poursuivre le daily » (08, 09) -> retour au chat, ou « Quitter le daily » (10) -> fermeture.
Chat, résumé -> « Non, j'aimerais ajouter une info. » (11, 12) -> résumé actualisé -> « Oui, je valide le daily » -> daily validé (13).
Accueil déjà renseigné (14) -> ouverture du résumé d'un daily (15).

Il y a donc 2 pages (l'accueil connecté dans ses 2 états) et 3 fenêtres par-dessus (chat, popup de sortie, résumé d'un daily passé).

## Points à confirmer

- Ce qui ouvre la fenêtre de résumé de l'état 15 (clic sur une case du calendrier ?).
- Ce qui se passe après « Quitter le daily » et après la validation (le chat se ferme-t-il seul ? retour à l'accueil en état 14 ?).
- Si « Lancer le daily » est désactivé quand la zone est vide (01 et 14 le montrent au repos, pas pâle).
- Le chemin « Non, je dois encore modifier des choses en DEV » n'a pas de frame.
- La croix de la fenêtre de résumé (15) : ferme-t-elle directement, sans popup de confirmation ?
- La première ligne de la grille du calendrier en 14/15 : la case verte est sur la ligne Mer, cohérent avec « mercredi 15 mai 2026 ».
- Le texte saisi en 02 (« Prêts à pousser ») et le message affiché en 05 (« Prêt à pousser ») diffèrent d'une lettre : coquille de maquette probable.
- Les curseurs (main, doigt jaune, traits rayonnants) sont des annotations d'interaction, pas de l'UI.
