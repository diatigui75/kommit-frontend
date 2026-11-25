// Espace insécable avant « ? » pour qu'il ne passe jamais seul à la ligne.
export const homeContent = {
  visitor: {
    title: 'Prêt(e) pour ton ',
    titleAccent: 'daily standup\u00a0?',
    subtitle: 'Track tes résultats pour que les jours ne se ressemblent pas.',
  },
  connected: {
    title: "Qu'as-tu fait de beau aujourd'hui, ",
    titleAccentSuffix: '\u00a0?',
    subtitle: 'Renseigne ton daily du jour ci-dessous.',
  },
  arrivalToast: {
    signupStart: 'Bienvenue ',
    signupEnd: ', ton compte est créé.',
    signinStart: 'Content de te revoir ',
    signinEnd: '.',
  },
} as const
