# kommit-frontend

Interface web du projet Kommit, en React, Vite et TypeScript.

## Arborescence

Mettre à jour cette arborescence à chaque ajout, déplacement ou suppression de fichier ou de dossier dans le repo.

```
kommit-frontend/
├── .claude/
│   ├── agents/            # subagents Claude Code
│   ├── hooks/
│   │   ├── ci-fix-guard.py # PreToolUse du worker : bloque push hors branche, merge, modif des tests/lint/CI
│   │   ├── ci-fix.sh       # attend la CI d'une PR ; si rouge, lance un worker qui la corrige
│   │   ├── ci-watch.sh     # hook PostToolUse : après gh pr create, lance ci-fix.sh en arrière-plan
│   │   ├── lint.sh         # hook Stop : lance pnpm lint
│   │   └── qa-guard.py     # PreToolUse : pendant /run-qa, bloque toute modification d'un e2e existant
│   ├── rules/             # conventions du repo
│   └── skills/            # skills Claude Code
├── .github/
│   └── workflows/
│       └── ci.yml         # CI des PR vers dev : lint, build, tests unitaires
├── .vscode/
│   └── settings.json
├── docs/
│   ├── TECH.md            # stack technique
│   ├── testing-strategy.md # doctrine des tests
│   ├── vocabulaire-maquette.md # vocabulaire de la maquette
│   └── workflow-ticket-frontend.md # workflow d'un ticket, de la maquette à la PR
├── public/
│   └── favicon.svg
├── e2e/                   # parcours Playwright, un fichier par thème : KOM-07 (SM-1 à SM-20), QA (qa-*), correctifs du QA de F1-US1 (unknownUrl, authPagesWhenConnected, longFirstName, doubleSubmit), KOM-19 (standup*, .nondet = vrai LLM), KOM-22 (standupCalendar), correctifs du QA de F2-US1 (standupQaFixes)
│   └── support/
│       ├── auth.ts        # helpers : email unique, compte et session par l'API, requêtes bloquées
│       └── standup.ts     # helpers du daily : standup du jour par l'API, tours du LLM, flux SSE simulé
├── maquettes/
│   ├── F1/                # maquette brute du flux d'authentification (code, screenshots, assets, FLOW.md)
│   └── F2/                # maquette du flux du daily standup (code reconstruit depuis F1, screenshots, assets, FLOW.md)
├── testing/
│   ├── inventaire-KOM-07.md # classement des RM de KOM-07 par type de test
│   ├── smokes-KOM-07.md     # scénarios de smoke de KOM-07
│   ├── inventaire-KOM-19.md # classement des CA de KOM-19 par type de test
│   ├── smokes-KOM-19.md     # scénarios de smoke de KOM-19
│   ├── inventaire-KOM-22.md # classement des CA de KOM-22 par type de test
│   ├── smokes-KOM-22.md     # scénarios de smoke de KOM-22
│   └── qa/                  # rapports de /run-qa, un dossier par run (rapport, couverture, captures)
├── src/
│   ├── main.tsx           # point d'entrée, monte l'app dans le DOM
│   ├── App.tsx            # providers, routes (/, /signup, /signin, /health, URL inconnue → /) et Toaster
│   ├── index.css          # Tailwind, thème shadcn et tokens de la maquette
│   ├── assets/
│   │   └── F1/
│   │       └── logo.png   # logo Kommit
│   ├── components/
│   │   ├── ui/            # shadcn (alert-dialog, badge, button, card, dialog, input, label, sonner, textarea) et génériques
│   │   │   ├── AuthCard.tsx    # carte des formulaires signup / signin
│   │   │   ├── Footer.tsx      # crédit ViDev
│   │   │   ├── Logo.tsx        # icône et nom Kommit
│   │   │   ├── Navbar.tsx      # logo et boutons d'action
│   │   │   ├── PageLayout.tsx  # navbar, contenu et footer d'une page
│   │   │   └── TextField.tsx   # label, champ et message d'erreur
│   │   └── pages/
│   │       ├── Health/
│   │       │   ├── HealthPage.tsx     # lance les vérifications via TanStack Query
│   │       │   └── ConnectionCard.tsx # carte avec bouton et résultat d'une vérification
│   │       ├── Home/
│   │       │   ├── HomePage.tsx       # accueil visiteur ou connecté
│   │       │   ├── HomeRoute.tsx      # session, toast d'arrivée et déconnexion
│   │       │   ├── PageHeading.tsx    # titre avec partie en bleu et sous-titre
│   │       │   ├── DailyInputCard.tsx # zone de saisie du daily et « Lancer le daily »
│   │       │   ├── TipNote.tsx        # note « Astuce » de la carte de saisie
│   │       │   ├── YearCalendar.tsx   # calendrier : chargement, erreur, grille du dimanche au samedi, carrés verts cliquables
│   │       │   ├── StandupSummaryDialog.tsx # résumé d'un jour en lecture seule
│   │       │   ├── StandupChatDialog.tsx # modale de conversation en streaming
│   │       │   ├── ChatMessage.tsx    # bulle utilisateur ou assistant
│   │       │   ├── SummaryBlock.tsx   # récap Hier / Blocages / À venir
│   │       │   ├── StandupConfirmDialog.tsx # confirmations quitter (CA7) et remplacer (CA9)
│   │       │   ├── useDailyStandup.ts # câblage du daily : état du jour, SSE, validation
│   │       │   └── useStandupCalendar.ts # câblage du calendrier : fenêtre de 53 semaines, résumé d'un jour
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
│   │   ├── signup.ts      # textes de la création de compte
│   │   └── standup.ts     # textes du daily standup (F2)
│   ├── logic/
│   │   ├── auth/          # logique pure de KOM-07, chaque unité avec son .test.ts
│   │   │   ├── arrivalToast/ # message du toast selon l'origine (RM3, RM4, RM24, RM25)
│   │   │   ├── email/        # normalisation de l'email (RM21)
│   │   │   ├── error/        # ApiError ou échec réseau → message et emplacement (RM9, RM13, RM18)
│   │   │   ├── session/      # état visiteur, titre de l'accueil (RM1, RM2), sortie de /signin et /signup si connecté
│   │   │   ├── signupBody/   # corps envoyé au signup : prénom trimé, email normalisé
│   │   │   ├── submitButton/ # bouton de soumission activé ou non (RM17, RM19, RM32, RM33)
│   │   │   └── validation/   # critères du signup et visibilité des erreurs (RM10, RM11, RM20, RM30)
│   │   └── standup/       # logique pure de KOM-19, chaque unité avec son .test.ts
│   │       ├── buttons/      # envoi et Valider activés ou non (CA27, CA39, CA40, CA25, CA32)
│   │       ├── calendar/     # grille de 53 semaines en Europe/Paris, bornes, vue chargement / erreur (CA11, CA12, CA13, CA37, CA43)
│   │       ├── conversation/ # historique, corps envoyé, conversation inachevée (CA2, CA7, CA44)
│   │       ├── error/        # erreur du flux (CA29, CA31, CA32), standup disparu (CA45)
│   │       ├── sse/          # lecture du flux SSE et indicateur d'attente (CA4, CA34)
│   │       ├── summary/      # blocs du récap, « Aucun », corps de validation (CA5, CA10, CA26)
│   │       └── today/        # titre de l'accueil et carré du jour (CA1, CA8, CA9, CA25, CA42)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── apiClient.ts # URL du backend, cookie de session, JSON et erreurs
│   │   │   ├── auth.ts      # appels Better Auth (session, signup, signin, signout)
│   │   │   ├── health.ts    # appels à /health et /db-health
│   │   │   └── standup.ts   # standup du jour, calendrier, résumé d'un jour, validation, flux SSE
│   │   ├── queryClient.ts # client TanStack Query
│   │   └── utils.ts       # helper cn() de shadcn
│   └── types/
│       └── apiContract.ts # réponses du backend
├── .env.dev.example       # modèle du .env.dev, lu par pnpm dev (backend en local)
├── .env.prod.example      # modèle du .env.prod (backend de prod)
├── .env.qa.example        # modèle du .env.qa, lu par pnpm test:e2e:qa:* (app déployée en DEV)
├── .gitignore
├── .mcp.json              # serveurs MCP du projet (Figma, Playwright pour la passe 2 de /run-qa)
├── .nvmrc                 # version de Node (24), lue par la CI
├── CLAUDE.md              # ce fichier
├── components.json        # config de la CLI shadcn
├── eslint.config.js       # config ESLint, imports en @/
├── index.html
├── package.json
├── playwright.config.ts   # config Playwright, projets deterministic et nondet, lien déployé si QA_BASE_URL
├── pnpm-lock.yaml
├── tsconfig.json          # références vers les 2 tsconfig ci-dessous
├── tsconfig.app.json      # config TypeScript de src/, alias @/
├── tsconfig.node.json     # config TypeScript de vite.config.ts
├── vercel.json            # build Vercel et réécriture SPA vers index.html
└── vite.config.ts
```
