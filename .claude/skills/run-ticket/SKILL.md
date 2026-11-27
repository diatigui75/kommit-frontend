---
name: run-ticket
description: Déroule seul tout le workflow d'un ticket frontend, de l'intégration de la maquette jusqu'à la PR ouverte vers dev, sans intervention humaine. Donne d'avance les accords que les autres skills demanderaient. Utiliser quand l'utilisateur dit "run-ticket", "fais tout le ticket", "déroule le ticket en entier", ou lance un /goal sur un ticket.
---

## Entrée

- Le **lien (ou l'ID) du ticket** Notion. Le lien de la maquette se lit dans le ticket.

## Sortie

- L'**URL de la PR** ouverte vers `dev`.
- Un **compte rendu** affiché dans la conversation : l'heure de fin de chaque étape, les décisions prises seul, les tests jugés faux, les e2e en échec, les défauts de review restants.

Le skill ne merge jamais et ne touche pas au ticket Notion.

---

## Contexte

Ce skill est fait pour tourner sans personne, typiquement sous `/goal` : personne ne répondra aux questions. Chaque endroit où un autre skill attendrait un humain est remplacé par un accord donné d'avance (section « Accords donnés d'avance »).

Il n'écrit lui-même ni test ni code : il enchaîne les points d'entrée des étapes de `docs/workflow-ticket-frontend.md`.

## Étapes

Lancer `date` au début, puis à la fin de chaque étape.

1. **Démarrer.** Lire le ticket (ID, titre, lien de la maquette). Créer la branche `<TICKET_ID>-<titre-en-kebab-case>` depuis `dev`.
2. **Intégrer la maquette.** Lancer `/write-ui` avec la maquette choisie par l'accord 1 : `maquettes/<série>/` s'il existe, sinon le lien du ticket (accords 1 et 2). Commiter.
3. **Planifier les tests.** Lancer l'agent `test-planner` sur le ticket. Commiter `testing/inventaire-<TICKET_ID>.md`.
4. **Écrire les tests.** Lancer `/write-tests`. Commiter les tests et les smokes.
5. **Écrire le code.** Lancer `/write-code` jusqu'à ce que la suite soit verte. Puis lancer `e2e-test-writer` et `pnpm test:e2e` (accord 5). Commiter.
6. **Faire la review.** Lancer `/review-code`. S'il y a un défaut ⛔ : le corriger avec `/write-code`, commiter, relancer `/review-code`. 2 allers-retours au maximum. Les défauts restants vont dans le compte rendu.
7. **Ouvrir la PR.** Lancer `/open-pr`.
8. **Afficher le compte rendu** décrit dans la Sortie.

## Accords donnés d'avance

1. **La source de la maquette** : si `maquettes/<série>/` existe déjà dans le repo (ex. `maquettes/F2/` pour le daily standup), la réutiliser telle quelle, sans ré-extraire ni appeler le MCP Figma : c'est la réponse donnée d'avance à la question de `/write-ui`. Les valeurs marquées « ~ » dans un code brut reconstruit sont estimées : les reprendre, et les lister dans le compte rendu. Sinon seulement, prendre le lien Figma du ticket, sans demander d'autre source.
2. **Le plan d'intégration de `/write-ui`** : l'accord est donné. Trancher chaque point d'arbitrage avec l'option recommandée, écrire le plan et les choix dans la conversation, puis implémenter.
3. **Décision structurante** (nouvelle dépendance, nouveau dossier de premier niveau, fichier hors des couches) : l'accord est donné. L'exécuter, sans passer en mode plan.
4. **Un test qui semble faux** : ne pas le modifier, le noter dans le compte rendu et continuer.
5. **Les e2e** : l'accord est donné de lancer `e2e-test-writer` dès que le code est vert, puis `pnpm test:e2e`. Le backend tourne déjà sur `http://localhost:3000` : ne pas le lancer. Un e2e en échec se corrige dans le code, jamais dans le test. Ceux qui échouent encore vont dans le compte rendu.
6. **Les commits** : l'accord est donné de commiter sur la branche du ticket, à la fin de chaque étape, en Conventional Commits. Jamais sur `dev`. Sans ces commits, `/open-pr` s'arrête pour demander.
7. **Toute autre question** : trancher avec l'option la plus proche du ticket, de la maquette, du contrat d'API et des rules, noter la décision et sa raison dans le compte rendu, puis continuer.

## Règles

- Ne jamais lancer `/merge-pr` ni merger quoi que ce soit.
- Ne pas modifier le ticket Notion.
- Les preuves (sorties de `date`, de `pnpm lint`, `pnpm build`, `pnpm test:run` (jamais `pnpm test`, qui lance Vitest en mode surveillance et ne rend jamais la main), `pnpm test:e2e`, URL de la PR) doivent apparaître dans la conversation : sous `/goal`, l'évaluateur ne lance aucun outil et ne juge que ce qu'il lit.
