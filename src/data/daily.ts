// Espace insécable avant « ! » pour qu'il ne passe jamais seul à la ligne.
export const dailyContent = {
  alreadyFilled: {
    title: 'Ton daily du jour est déjà renseigné, ',
    titleAccentSuffix: ' !',
    subtitle: "En renseignant ton daily du jour à nouveau, il remplacera l'existant.",
  },
  entry: {
    label: 'Ton daily du jour',
    placeholder: 'Renseigne tes progrès, tes éventuels blocages et ce que tu vas faire ...',
    launchLabel: 'Lancer le daily',
  },
  tip: {
    title: 'Astuce',
    text: "Garde tes daily courts pour une meilleure vue d'ensemble en fin de semaine",
  },
  calendar: {
    titleEnd: " daily renseigné(s) sur l'année",
    monthLabels: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    dayLabels: ['Lun', '', 'Mer', '', 'Ven', '', ''],
    legendEmpty: 'Daily non renseigné',
    legendRecorded: 'Daily enregistré',
    openDayLabel: 'Voir le résumé du daily du ',
  },
  assistant: {
    name: 'Daily Standup Assistant',
    liveStatus: 'Live Sync Active',
    datePrefix: 'En date du ',
    messagePlaceholder: 'Écrire un message ...',
    sendLabel: 'Envoyer le message',
    closeLabel: 'Fermer',
  },
  summary: {
    fait: 'Hier',
    blocages: 'Blocages',
    prevu: 'À venir',
    empty: 'Aucun',
  },
  pastDaily: {
    intro: 'Voici le résumé du daily du ',
  },
  quit: {
    title: "Le daily standup n'est pas encore validé.",
    text: ['En quittant cette conversation,', "tout l'échange sera définitivement perdu.", 'Es-tu sûr de vouloir quitter ?'],
    continueLabel: 'Poursuivre le daily',
    quitLabel: 'Quitter le daily',
    closeLabel: 'Fermer',
  },
} as const
