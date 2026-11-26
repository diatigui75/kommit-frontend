# kommit-frontend

Interface web du projet Kommit, en React, Vite et TypeScript.

## Arborescence

Mettre à jour cette arborescence à chaque ajout, déplacement ou suppression de fichier ou de dossier dans le repo.

```
kommit-frontend/
├── .claude/
│   ├── rules/             # conventions du repo
│   └── skills/            # skills Claude Code
├── .github/
│   └── workflows/
│       └── ci.yml         # CI des PR vers dev : lint, build, tests unitaires
├── .vscode/
│   └── settings.json
├── docs/
│   └── TECH.md            # stack technique
├── public/
│   └── favicon.svg
├── e2e/                   # parcours Playwright de KOM-07, un fichier par thème (SM-1 à SM-20)
│   └── support/
│       └── auth.ts        # helpers : email unique, compte et session par l'API, requêtes bloquées
├── maquettes/
│   ├── F1/                # maquette brute du flux d'authentification (code, screenshots, assets, FLOW.md)
│   └── F2/                # captures du flux du daily et FLOW.md (sans extraction Figma)
├── testing/
│   ├── inventaire-KOM-07.md # classement des RM de KOM-07 par type de test
│   ├── inventaire-KOM-19.md # classement des CA de KOM-19 (saisie et chat du daily)
│   ├── inventaire-KOM-22.md # classement des CA de KOM-22 (calendrier et résumé passé)
│   ├── smokes-KOM-07.md     # scénarios de smoke de KOM-07
│   ├── smokes-KOM-19.md     # scénarios de smoke de KOM-19
│   └── smokes-KOM-22.md     # scénarios de smoke de KOM-22
├── src/
│   ├── main.tsx           # point d'entrée, monte l'app dans le DOM
│   ├── App.tsx            # providers, routes (/, /signup, /signin, /health) et Toaster
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
│   │       │   ├── AssistantHeader.tsx   # en-tête des modales du daily : assistant, statut ou date, croix
│   │       │   ├── ChatMessage.tsx       # bulle du chat, utilisateur ou assistant
│   │       │   ├── DailyChatDialog.tsx   # modale du chat du daily
│   │       │   ├── DailyEntryCard.tsx    # saisie du daily et bouton « Lancer le daily »
│   │       │   ├── DailySummary.tsx      # encart Hier / Blocages / À venir
│   │       │   ├── HomePage.tsx          # accueil visiteur ou connecté
│   │       │   ├── HomeRoute.tsx         # session, toast d'arrivée et déconnexion
│   │       │   ├── PageHeading.tsx       # titre avec partie en bleu et sous-titre
│   │       │   ├── PastDailyDialog.tsx   # résumé d'un daily passé, en lecture seule
│   │       │   ├── QuickReplies.tsx      # réponses rapides sous une bulle de l'assistant
│   │       │   ├── QuitDailyDialog.tsx   # confirmation avant de quitter un daily non validé
│   │       │   ├── ReplaceDailyDialog.tsx # alerte avant de remplacer le daily du jour (CA9)
│   │       │   ├── TipNote.tsx           # note ASTUCE en post-it
│   │       │   ├── useDailyStandup.ts    # état du daily : requêtes, conversation SSE, validation, modales
│   │       │   └── YearCalendar.tsx      # calendrier des 53 dernières semaines
│   │       ├── Signin/
│   │       │   ├── SigninPage.tsx     # formulaire de connexion
│   │       │   └── SigninRoute.tsx    # saisie, appel signin et erreurs
│   │       └── Signup/
│   │           ├── SignupPage.tsx     # formulaire de création de compte
│   │           └── SignupRoute.tsx    # saisie, validation, appel signup et erreurs
│   ├── data/
│   │   ├── auth.ts        # textes communs à signup et signin
│   │   ├── daily.ts       # textes du daily (saisie, calendrier, chat, popup)
│   │   ├── health.ts      # textes de la page /health
│   │   ├── home.ts        # textes de l'accueil
│   │   ├── layout.ts      # textes du header et du footer
│   │   ├── signin.ts      # textes de la connexion
│   │   └── signup.ts      # textes de la création de compte
│   ├── logic/
│   │   ├── auth/          # logique pure de KOM-07, chaque unité avec son .test.ts
│   │   │   ├── arrivalToast/ # message du toast selon l'origine (RM3, RM4, RM24, RM25)
│   │   │   ├── email/        # normalisation de l'email (RM21)
│   │   │   ├── error/        # ApiError ou échec réseau → message et emplacement (RM9, RM13, RM18)
│   │   │   ├── session/      # état visiteur et titre de l'accueil (RM1, RM2)
│   │   │   ├── signupBody/   # corps envoyé au signup : prénom trimé, email normalisé
│   │   │   ├── submitButton/ # bouton de soumission activé ou non (RM17, RM19, RM32, RM33)
│   │   │   └── validation/   # critères du signup et visibilité des erreurs (RM10, RM11, RM20, RM30)
│   │   └── daily/         # logique pure de KOM-19 et KOM-22, chaque unité avec son .test.ts
│   │       ├── calendarGrid/     # grille des 53 semaines, jours renseignés et débuts de mois (CA11, CA12, CA13, CA37)
│   │       ├── calendarQuery/    # bornes from/to de la requête du calendrier (CA11, CA37)
│   │       ├── calendarState/    # compteur, cases ou erreur du calendrier (CA11, CA43)
│   │       ├── composer/         # envoi désactivé si message vide ou IA en train d'écrire (CA39, CA40)
│   │       ├── conversation/     # fil de messages envoyé à chaque tour (CA2)
│   │       ├── quitConfirmation/ # conversation non validée, confirmation avant de quitter (CA7, CA44)
│   │       ├── standupBody/      # corps de POST /standups, dernier résumé reçu (CA10, CA26)
│   │       ├── streamError/      # erreur du flux → message et type (CA29, CA31, CA32)
│   │       ├── streamTurn/       # événements SSE → texte, résumé, erreur (CA4, CA26, CA29, CA34)
│   │       ├── summaryBlocks/    # sections du résumé à afficher (CA5, CA10)
│   │       ├── summaryDialog/    # état de la modale du résumé passé (CA45, CA46)
│   │       ├── summaryItems/     # items d'une section, « Aucun » si vide (CA30)
│   │       ├── today/            # aujourd'hui en Europe/Paris depuis une horloge (CA11, CA37)
│   │       ├── todayStatus/      # titre « à faire » ou « déjà fait », confirmation de remplacement (CA1, CA8, CA9, CA42)
│   │       └── validateButton/   # « Valider mon standup » activé ou non (CA6, CA25, CA27, CA32)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── apiClient.ts # URL du backend, cookie de session, JSON et erreurs
│   │   │   ├── auth.ts      # appels Better Auth (session, signup, signin, signout)
│   │   │   ├── health.ts    # appels à /health et /db-health
│   │   │   └── standup.ts   # appels /standups (jour, calendrier, résumé, validation) et flux SSE de la conversation
│   │   ├── queryClient.ts # client TanStack Query
│   │   └── utils.ts       # helper cn() de shadcn
│   └── types/
│       └── apiContract.ts # réponses du backend
├── .env.example           # modèle des variables d'environnement
├── .gitignore
├── .mcp.json              # serveurs MCP du projet (Figma)
├── .nvmrc                 # version de Node (24), lue par la CI
├── CLAUDE.md              # ce fichier
├── components.json        # config de la CLI shadcn
├── eslint.config.js       # config ESLint, imports en @/
├── index.html
├── package.json
├── playwright.config.ts   # config Playwright, projets deterministic et nondet
├── pnpm-lock.yaml
├── tsconfig.json          # références vers les 2 tsconfig ci-dessous
├── tsconfig.app.json      # config TypeScript de src/, alias @/
├── tsconfig.node.json     # config TypeScript de vite.config.ts
├── vercel.json            # build Vercel et réécriture SPA vers index.html
└── vite.config.ts
```
