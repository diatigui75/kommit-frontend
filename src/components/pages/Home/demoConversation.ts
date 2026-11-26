// TEMPORAIRE : conversation scriptée d'après les captures F2, pour vérifier l'intégration. À retirer avant la PR.
import type { ChatEntry } from '@/components/pages/Home/ChatMessage'
import type { StandupSummary } from '@/types/apiContract'

const VALIDATE = 'Oui, je valide le daily'
const ADD_INFO = "Non, j'aimerais ajouter une info."

const baseSummary: StandupSummary = {
  fait: ["Migration de l'authentification vers la nouvelle API terminée", 'Problèmes de persistance des cookies JWT en production résolus'],
  blocages: [],
  prevu: ['Déploiement des mises à jour en DEV', "Vérification du flux d'authentification en DEV"],
}

let nextId = 0
const assistant = (content: string, summary?: StandupSummary): ChatEntry => ({
  id: `demo-${nextId++}`,
  role: 'assistant',
  content,
  summary,
})
export const userEntry = (content: string): ChatEntry => ({ id: `demo-${nextId++}`, role: 'user', content })

export type DemoTurn = { entries: ChatEntry[]; quickReplies: string[] }

export function demoStart(draft: string): DemoTurn {
  return {
    entries: [
      userEntry(draft),
      assistant(
        "Excellent travail ! La migration de l'authentification était un gros morceau.\nAs-tu rencontré des blocages pour le déploiement en DEV ou je note qu'il reste du travail pour ce ticket CCE-12 ?",
      ),
    ],
    quickReplies: ['Pas de blocage, RAS', 'Non, je dois encore modifier des choses en DEV'],
  }
}

export function demoReply(text: string, previous: ChatEntry[]): DemoTurn {
  if (text === VALIDATE) {
    return { entries: [assistant('Daily validé, il est ajouté à ton calendrier avec succès.')], quickReplies: [] }
  }
  if (text === ADD_INFO) return { entries: [assistant('Que souhaites-tu ajouter ?')], quickReplies: [] }
  if (previous.some((entry) => entry.content === ADD_INFO)) {
    return {
      entries: [assistant("C'est noté, voici le résumé actualisé :", { ...baseSummary, prevu: [...baseSummary.prevu, text] })],
      quickReplies: [VALIDATE, ADD_INFO],
    }
  }
  return {
    entries: [
      assistant(
        "Très bien, je note que tu n'as eu aucun blocage. Je sais déjà ce que tu vas faire aujourd'hui. Je suis prêt à résumer ton daily.",
      ),
      assistant('Voici le résumé de ton daily. Tu valides ?', baseSummary),
    ],
    quickReplies: [VALIDATE, ADD_INFO],
  }
}
