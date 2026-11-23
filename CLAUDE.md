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
│   ├── App.tsx            # assemblage de l'app
│   ├── index.css          # Tailwind et thème shadcn
│   ├── components/
│   │   ├── ui/            # composants shadcn (badge, button, card)
│   │   └── pages/
│   │       └── Home/
│   │           ├── HomePage.tsx       # lance les vérifications via TanStack Query
│   │           └── ConnectionCard.tsx # carte avec bouton et résultat d'une vérification
│   ├── data/
│   │   └── home.ts        # textes de la page d'accueil
│   ├── lib/
│   │   ├── api/
│   │   │   ├── apiClient.ts # URL du backend, lecture du JSON et erreur réseau
│   │   │   └── health.ts    # appels à /health et /db-health
│   │   ├── queryClient.ts # client TanStack Query
│   │   └── utils.ts       # helper cn() de shadcn
│   └── types/
│       └── apiContract.ts # réponses du backend
├── .env.example           # modèle des variables d'environnement
├── .gitignore
├── CLAUDE.md              # ce fichier
├── components.json        # config de la CLI shadcn
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json          # références vers les 2 tsconfig ci-dessous
├── tsconfig.app.json      # config TypeScript de src/, alias @/
├── tsconfig.node.json     # config TypeScript de vite.config.ts
└── vite.config.ts
```
