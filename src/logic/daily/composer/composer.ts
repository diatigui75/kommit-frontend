export type ComposerState = {
  text: string
  isStreaming: boolean
}

// Zone vide ou blanche (CA39), ou IA en train d'écrire (CA40) : rien ne part.
export function isSendDisabled(composer: ComposerState): boolean {
  return composer.isStreaming || composer.text.trim() === ''
}
