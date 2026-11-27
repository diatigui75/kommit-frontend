// Textes du daily standup (maquette F2, ticket KOM-19). Le ticket prime quand il diffère de la maquette.
export const standupContent = {
  home: {
    alreadyDoneTitle: 'Bravo, tu as renseigné ton standup du jour !',
    alreadyDoneSubtitle: "En renseignant ton daily du jour à nouveau, il remplacera l'existant.",
  },
  input: {
    label: 'Ton daily du jour',
    placeholder: 'Renseigne tes progrès, tes éventuels blocages et ce que tu vas faire …',
    launchLabel: 'Lancer le daily',
  },
  tip: {
    title: 'Astuce',
    text: "Garde tes daily courts pour une meilleure vue d'ensemble en fin de semaine",
  },
  calendar: {
    countSuffix: " daily renseigné(s) sur l'année",
    months: ['juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.', 'janv.', 'févr.', 'mars', 'avr.', 'mai'],
    dayLabels: ['Lun', '', 'Mer', '', 'Ven', '', ''],
    emptyLegend: 'Daily non renseigné',
    filledLegend: 'Daily enregistré',
  },
  chat: {
    title: 'Daily Standup Assistant',
    status: 'Live Sync Active',
    closeLabel: 'Fermer la conversation',
    messagePlaceholder: 'Écrire un message …',
    sendLabel: 'Envoyer',
    waitingLabel: "L'assistant écrit…",
    summaryIntro: 'Voici le résumé de ton daily. Tu valides ?',
    validateLabel: 'Oui, je valide le daily',
    addInfoLabel: "Non, j'aimerais ajouter une info.",
    retryLabel: 'Réessayer',
  },
  summary: {
    fait: 'Hier',
    blocages: 'Blocages',
    prevu: 'À venir',
    empty: 'Aucun',
  },
  quit: {
    title: "Le daily standup n'est pas encore validé.",
    description: 'En quittant cette conversation,\ntout l\'échange sera définitivement perdu.\nEs-tu sûr de vouloir quitter ?',
    continueLabel: 'Poursuivre le daily',
    quitLabel: 'Quitter le daily',
  },
  replace: {
    title: 'Ton daily du jour est déjà renseigné.',
    description: "En le refaisant, le nouveau daily remplacera l'existant une fois validé.",
    confirmLabel: 'Refaire mon daily',
    cancelLabel: 'Annuler',
  },
} as const
