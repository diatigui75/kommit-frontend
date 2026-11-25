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
├── maquettes/
│   └── F1/                # maquette brute du flux d'authentification (code, screenshots, assets, FLOW.md)
├── testing/
│   ├── inventaire-KOM-07.md # classement des RM de KOM-07 par type de test
│   └── smokes-KOM-07.md     # scénarios de smoke de KOM-07
├── src/
│   ├── main.tsx           # point d'entrée, monte l'app dans le DOM
│   ├── App.tsx            # providers, routes (/, /signup, /signin, /health) et Toaster
│   ├── index.css          # Tailwind, thème shadcn et tokens de la maquette
│   ├── assets/
│   │   └── F1/
│   │       └── logo.png   # logo Kommit
│   ├── components/
│   │   ├── ui/            # shadcn (badge, button, card, input, label, sonner) et génériques
│   │   │   ├── AuthCard.tsx    # carte des formulaires signup / signin
│   │   │   ├── Footer.tsx      # crédit ViDev
│   │   │   ├── Logo.tsx        # icône et nom Kommit
│   │   │   ├── Navbar.tsx      # logo et boutons d'action
│   │   │   ├── PageHeading.tsx # titre avec partie en bleu et sous-titre
│   │   │   ├── PageLayout.tsx  # navbar, contenu et footer d'une page
│   │   │   └── TextField.tsx   # label, champ et message d'erreur
│   │   └── pages/
│   │       ├── Health/
│   │       │   ├── HealthPage.tsx     # lance les vérifications via TanStack Query
│   │       │   └── ConnectionCard.tsx # carte avec bouton et résultat d'une vérification
│   │       ├── Home/
│   │       │   ├── HomePage.tsx       # accueil visiteur ou connecté
│   │       │   └── HomeRoute.tsx      # session, toast d'arrivée et déconnexion
│   │       ├── Signin/
│   │       │   ├── SigninPage.tsx     # formulaire de connexion
│   │       │   └── SigninRoute.tsx    # saisie, appel signin et erreurs
│   │       └── Signup/
│   │           ├── SignupPage.tsx     # formulaire de création de compte
│   │           └── SignupRoute.tsx    # saisie, validation, appel signup et erreurs
│   ├── data/
│   │   ├── auth.ts        # textes communs à signup et signin
│   │   ├── health.ts      # textes de la page /health
│   │   ├── home.ts        # textes de l'accueil
│   │   ├── layout.ts      # textes du header et du footer
│   │   ├── signin.ts      # textes de la connexion
│   │   └── signup.ts      # textes de la création de compte
│   ├── logic/
│   │   └── auth/          # logique pure de KOM-07, chaque unité avec son .test.ts
│   │       ├── arrivalToast/ # message du toast selon l'origine (RM3, RM4, RM24, RM25)
│   │       ├── email/        # normalisation de l'email (RM21)
│   │       ├── error/        # ApiError ou échec réseau → message et emplacement (RM9, RM13, RM18)
│   │       ├── session/      # état visiteur et titre de l'accueil (RM1, RM2)
│   │       ├── submitButton/ # bouton de soumission activé ou non (RM17, RM19, RM32, RM33)
│   │       └── validation/   # critères du signup et visibilité des erreurs (RM10, RM11, RM20, RM30)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── apiClient.ts # URL du backend, cookie de session, JSON et erreurs
│   │   │   ├── auth.ts      # appels Better Auth (session, signup, signin, signout)
│   │   │   └── health.ts    # appels à /health et /db-health
│   │   ├── queryClient.ts # client TanStack Query
│   │   └── utils.ts       # helper cn() de shadcn
│   └── types/
│       └── apiContract.ts # réponses du backend
├── .env.example           # modèle des variables d'environnement
├── .gitignore
├── .mcp.json              # serveurs MCP du projet (Figma)
├── CLAUDE.md              # ce fichier
├── components.json        # config de la CLI shadcn
├── eslint.config.js       # config ESLint, imports en @/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json          # références vers les 2 tsconfig ci-dessous
├── tsconfig.app.json      # config TypeScript de src/, alias @/
├── tsconfig.node.json     # config TypeScript de vite.config.ts
└── vite.config.ts
```
