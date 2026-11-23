# kommit-frontend

Interface web du projet Kommit, en React, Vite et TypeScript.

## Arborescence

Mettre à jour cette arborescence à chaque ajout, déplacement ou suppression de fichier ou de dossier dans le repo.

```
kommit-frontend/
├── .claude/
│   ├── rules/             # conventions du repo
│   └── skills/            # skills Claude Code
├── .vscode/
│   └── settings.json
├── docs/
│   └── TECH.md            # stack technique
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx           # point d'entrée, monte l'app dans le DOM
│   └── App.tsx            # assemblage de l'app
├── .gitignore
├── CLAUDE.md              # ce fichier
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json          # références vers les 2 tsconfig ci-dessous
├── tsconfig.app.json      # config TypeScript de src/, alias @/
├── tsconfig.node.json     # config TypeScript de vite.config.ts
└── vite.config.ts
```
