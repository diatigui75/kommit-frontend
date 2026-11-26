// Espace insécable avant « ! » pour qu'il ne passe jamais seul à la ligne.
export const dailyContent = {
  outageMessage: 'Le serveur ne répond pas. Réessaie dans un instant.',
  headingLoader: 'Chargement de ton daily',
  alreadyFilled: {
    title: 'Bravo, tu as renseigné ',
    titleAccent: 'ton standup du jour !',
    subtitle: "En renseignant ton daily du jour à nouveau, il remplacera l'existant.",
  },
  entry: {
    label: 'Ton daily du jour',
    placeholder: 'Renseigne tes progrès, tes éventuels blocages et ce que tu vas faire ...',
    launchLabel: 'Lancer le daily',
  },
  replace: {
    title: 'Ton daily du jour est déjà renseigné.',
    text: 'Si tu en lances un nouveau et que tu le valides, il remplacera celui déjà enregistré.',
    cancelLabel: 'Annuler',
    confirmLabel: 'Remplacer',
  },
  tip: {
    title: 'Astuce',
    text: "Garde tes daily courts pour une meilleure vue d'ensemble en fin de semaine",
  },
  calendar: {
    titleEnd: " daily renseigné(s) sur l'année",
    monthLabels: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    dayLabels: ['', 'Lun', '', 'Mer', '', 'Ven', ''],
    legendEmpty: 'Daily non renseigné',
    legendRecorded: 'Daily enregistré',
    openDayLabel: 'Voir le résumé du daily du ',
    emptyDayLabel: 'Pas de daily le ',
    loadingLabel: 'Chargement du calendrier',
  },
  assistant: {
    name: 'Daily Standup Assistant',
    liveStatus: 'Live Sync Active',
    datePrefix: 'En date du ',
    messagePlaceholder: 'Écrire un message ...',
    sendLabel: 'Envoyer le message',
    closeLabel: 'Fermer',
    typingLabel: "L'assistant écrit…",
    validateLabel: 'Valider mon standup',
    retryLabel: 'Réessayer',
  },
  summary: {
    fait: 'Hier',
    blocages: 'Blocages',
    prevu: 'À venir',
    empty: 'Aucun',
  },
  pastDaily: {
    intro: 'Voici le résumé du daily du ',
    loadingLabel: 'Chargement du résumé',
  },
  quit: {
    title: "Le daily standup n'est pas encore validé.",
    text: ['En quittant cette conversation,', "tout l'échange sera définitivement perdu.", 'Es-tu sûr de vouloir quitter ?'],
    continueLabel: 'Poursuivre le daily',
    quitLabel: 'Quitter le daily',
    closeLabel: 'Fermer',
  },
} as const
