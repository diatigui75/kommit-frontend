// Métier : on affiche le `message` du serveur, à l'emplacement choisi par le code.
// Panne (RM18) : message du serveur pour INTERNAL_ERROR, texte du front si injoignable ou erreur inconnue.
export type AuthErrorDisplay =
  | { kind: 'business'; target: 'email' | 'form'; message: string }
  | { kind: 'outage'; target: 'form'; message: string }

export function authErrorDisplayFor(_error: unknown): AuthErrorDisplay {
  return { kind: 'business', target: 'form', message: '' }
}
