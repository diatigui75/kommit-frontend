---
name: run-qa
description: Fait tout le QA testing d'une US sur l'app déployée en DEV, sans intervention. Passe 1 sur les cas simples (e2e existants rejoués, e2e manquants écrits), passe 2 sur les cas tordus (exploration dans un vrai navigateur), puis rapport QA avec captures et suppression des comptes de test. Use when l'utilisateur dit "/run-qa", "lance le QA", "QA testing", "teste l'US".
---

## Entrée

- Les **tickets en TO TEST** du board Notion, regroupés par US. L'utilisateur choisit **1 seule US** par session.
- Le fichier d'env QA (`.env.qa`) avec les **liens déployés** et l'URL de la base de DEV. Claude ne le lit jamais lui-même : `qa.mjs` le lit.

## Sortie

- Le **rapport QA** `testing/qa/<run-id>/rapport.md`, avec ses captures dans `testing/qa/<run-id>/captures/`.
- Les **nouveaux e2e** écrits pendant la passe 1 (`e2e/qa-*.test.ts`).
- Les **comptes de test** créés pendant le QA, supprimés de la base de DEV après confirmation de l'utilisateur.

---

## ⛔ Garde-fous (non négociables)

- **Garde-fou 1, ne jamais modifier un e2e existant** (RM5). Le hook `.claude/hooks/qa-guard.py` le bloque pendant toute la session, subagents compris. Si un e2e existant semble faux (faux négatif : test KO alors que l'app marche), le signaler dans le rapport. C'est à l'utilisateur de le corriger.
- **Garde-fou 2, ne jamais modifier le code de prod** (RM6) : rien sous `src/`, ni config, ni `package.json`. Le QA constate et rapporte, il ne corrige pas. Aucun hook ne le bloque, pour que l'utilisateur puisse coder pendant le QA : cette consigne est la seule barrière, elle est répétée dans chaque subagent.
- **Liens déployés uniquement** (RM2) : jamais `localhost`.
- **Ne jamais lire `.env.qa`** : passer par `node .claude/skills/run-qa/qa.mjs`.
- **Ne rien commiter** : l'utilisateur relit le rapport et décide.

## Limites (RM4)

- **20 minutes au total**, mesurées par `node .claude/skills/run-qa/qa.mjs elapsed`. Le lire après chaque étape. À 20 minutes, arrêter ce qui reste et passer au rapport avec ce qui est déjà testé.
- **Passe 2 : 15 cas au maximum**, au moins 1 par zone de l'app.

## Étapes

Créer une tâche par étape avec `TaskCreate` et suivre son statut.

### 1. Vérifier les liens

`node .claude/skills/run-qa/qa.mjs check`.

- Code de sortie 1 → afficher les `problems` et **s'arrêter**. Si le fichier manque, dire à l'utilisateur de lancer `! cp .env.qa.example .env.qa` puis de renseigner `E2E_DATABASE_URL`, et de relancer `/run-qa`.
- `hasDatabaseUrl: false` → prévenir : SM-18 sera sauté et les comptes de test ne pourront pas être supprimés. Demander s'il veut continuer.

### 2. Choisir l'US

Requête SQL sur le board (data source `collection://93e9e90f-f3c9-8261-8d9a-0768193ed2e1`) : les tickets dont `Agile Statut` vaut `TO TEST`, avec `Ticket ID`, `Title`, `US`, `Repo / Agent / Responsabilité` et `url`.

- Garder les tickets qui décrivent l'app : `Repo / Agent / Responsabilité` vaut `FRONTEND` ou `BACKEND`. Les autres (DEVOPS, TESTING…) ne se testent pas dans l'app.
- Les regrouper par `US`. Un ticket sans US est cité à part, sans être proposé.
- `AskUserQuestion` : une option par US, avec ses tickets dans la description (ex. « F1-US1 : KOM-06 backend, KOM-07 frontend »).

### 3. Ouvrir la session

`node .claude/skills/run-qa/qa.mjs start` : fige la liste des e2e existants et active le hook du garde-fou 1. Noter `startedAt`.

`run-id` = `<US>-<date et heure de startedAt>`, ex. `F1-US1-20261127-0915`. Créer `testing/qa/<run-id>/captures/`.

### 4. Passe 1, les cas simples (RM7 à RM9)

1. **Combler les trous de couverture (RM8)** : lancer l'agent `qa-gap-writer` avec les liens des tickets de l'US et le dossier du run. Il écrit les e2e manquants (`e2e/qa-*.test.ts`) et `testing/qa/<run-id>/couverture.md`.
2. **Rejouer tous les e2e sur le lien déployé (RM7)**, anciens et nouveaux, en mettant de côté un éventuel `qa-rate-limit.test.ts` :
   ```
   PLAYWRIGHT_JSON_OUTPUT_NAME=testing/qa/<run-id>/passe1.json pnpm test:e2e:qa:parallel <fichiers> --reporter=list,json
   node .claude/skills/run-qa/qa.mjs collect testing/qa/<run-id>/passe1.json testing/qa/<run-id>/captures
   ```
   `<fichiers>` : les noms des `e2e/*.test.ts`, sans `.nondet` ni `qa-rate-limit`. S'il existe, `qa-rate-limit.test.ts` se lance ensuite seul, avec `pnpm test:e2e:qa:seq`, dans `passe1-rate-limit.json`, suivi d'un 2e `collect`. Toujours lancer `collect` juste après chaque run : le run suivant vide `test-results/`.
3. **Verdict (RM9)** : chaque test `failed` est un KO (❌). Pour chacun, choisir la gravité (voir l'étape 6) et dire en 1 phrase si c'est un bug de l'app ou un faux négatif probable du test. Un test `skipped` n'est ni OK ni KO : l'indiquer avec sa raison.
   - Au moins 1 KO → la passe 1 échoue, **pas de passe 2**. Aller à l'étape 6.
   - 0 KO → la passe 1 est réussie, passer à la passe 2.

### 5. Passe 2, les cas tordus (RM10, RM11)

Seulement si la passe 1 est réussie et qu'il reste au moins 5 minutes.

Lancer l'agent `qa-explorer` avec :
- `QA_BASE_URL` (donné par `check`) ;
- le `run-id` ;
- les zones de l'app, tirées de `couverture.md` (ex. accueil, inscription, connexion, déconnexion), avec 1 ligne de résumé de leurs règles ;
- l'heure limite : `startedAt` + 18 minutes, pour garder 2 minutes au rapport.

Puis déplacer ses captures, qui peuvent arriver à la racine du repo, dans `testing/qa/` ou dans `testing/qa/.mcp-output/` : `find . testing/qa -maxdepth 2 -name '<run-id>-P2-*.png' -not -path '*/captures/*' -not -path './node_modules/*' -exec mv {} testing/qa/<run-id>/captures/ \;`.

Si le MCP `playwright` n'est pas disponible dans la session, ne pas improviser : noter la passe 2 comme non faite dans le rapport, avec la raison.

### 6. Écrire le rapport (RM3)

`testing/qa/<run-id>/rapport.md`, dans cet ordre :

1. **En-tête** : US, tickets testés (avec liens Notion), lien testé, heure de début, heure de fin, durée.
2. **Bilan** : passe 1 ✅ ou ❌ (OK, KO, sautés), passe 2 ✅, ❌ ou non faite (et pourquoi), nombre de KO par gravité.
3. **KO par gravité**, 3 tableaux, même vides (écrire « Aucun ») :
   - ⛔ **Bloquant pour le déploiement** : perte de données, faille de sécurité, utilisateur bloqué, erreur visible sur un parcours principal ;
   - ⚠️ **Non bloquant** : comportement faux ou déroutant, que l'utilisateur peut contourner ;
   - 💡 **Amélioration optionnelle** : rien de cassé, l'expérience pourrait être meilleure.

   Colonnes : `ID | Passe | Ce qui casse | Attendu | Observé | Capture`. La gravité est choisie par le workflow, l'utilisateur peut la corriger en relisant.
4. **Passe 1** : un tableau de tous les tests, `ID | Fichier | Test | RM | Verdict | Capture`, avec ✅, ❌ ou ⏭️ (sauté). Puis un lien vers `couverture.md`, et la liste des faux négatifs probables.
5. **Passe 2** : le tableau rendu par `qa-explorer`.
6. **Comptes de test** : nombre supprimés, ou pourquoi ils ne l'ont pas été.

Chaque capture est un lien relatif : `[capture](captures/<fichier>.png)`.

### 7. Supprimer les comptes de test (RM3)

1. `node .claude/skills/run-qa/qa.mjs cleanup` : liste les comptes en `@test.dev` créés depuis le début de la session.
2. `AskUserQuestion` : « Je supprime ces <n> comptes de test de la base de DEV ? »
3. Si oui : `node .claude/skills/run-qa/qa.mjs cleanup --yes`. Mettre à jour la section « Comptes de test » du rapport.

### 8. Fermer la session

`node .claude/skills/run-qa/qa.mjs stop`, **toujours**, même après une erreur ou un arrêt à 20 minutes : sinon le hook continue de bloquer les e2e.

## Restitution

Le chemin du rapport, puis le bilan en quelques lignes : verdict de chaque passe, nombre de KO par gravité, durée, comptes supprimés.
