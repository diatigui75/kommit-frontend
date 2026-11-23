const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Le corps est lu même sur une erreur HTTP : /db-health répond 503 avec un JSON valide.
export const getJson = async <T>(path: string): Promise<T> => {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`)
  } catch {
    throw new Error('Le serveur ne répond pas.')
  }

  return (await response.json()) as T
}
