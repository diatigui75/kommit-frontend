export type ComposerState = {
  text: string
  isStreaming: boolean
}

export function isSendDisabled(_composer: ComposerState): boolean {
  return false
}
