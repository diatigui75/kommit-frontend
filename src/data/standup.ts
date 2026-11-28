// Textes du daily standup (maquette F2, ticket KOM-19). Le ticket prime quand il diffère de la maquette.
export const standupContent = {
  home: {
    alreadyDoneTitle: 'Bravo, tu as renseigné ton standup du jour !',
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
    // Index 0 = janvier : le libellé d'une colonne vient du mois de sa 1re journée.
    months: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    // Semaines du dimanche au samedi (CA11) : une ligne vide au-dessus de « Lun ».
    dayLabels: ['', 'Lun', '', 'Mer', '', 'Ven', ''],
    emptyLegend: 'Daily non renseigné',
    filledLegend: 'Daily enregistré',
    dayButtonPrefix: 'Voir le daily du ',
    loadingLabel: 'Chargement du calendrier',
    errorMessage: "Ton calendrier n'a pas pu être chargé. Réessaie dans un instant.",
  },
  summaryDialog: {
    datePrefix: 'En date du ',
    intro: 'Voici le résumé du daily du ',
    loadingLabel: 'Chargement du résumé',
    closeLabel: 'Fermer le résumé',
    notFoundMessage: "Ce standup n'existe plus, le calendrier a été mis à jour.",
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
    sessionExpiredMessage: 'Ta session a expiré. Reconnecte-toi pour renseigner ton daily.',
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
