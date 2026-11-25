const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const send = async (path: string, init?: RequestInit): Promise<Response> => {
  try {
    // Front et back sur 2 origines : sans `include`, le cookie de session n'est pas joint.
    return await fetch(`${API_URL}${path}`, { ...init, credentials: 'include' })
  } catch {
    throw new Error('Le serveur ne répond pas.')
  }
}

// Le corps est lu même sur une erreur HTTP : /db-health répond 503 avec un JSON valide.
export const getJson = async <T>(path: string): Promise<T> => {
  const response = await send(path)

  return (await response.json()) as T
}

// Sur une erreur HTTP, rejette avec le corps reçu (une `ApiError` d'après le contrat).
export const requestJson = async <T>(path: string, method: 'GET' | 'POST', body?: unknown): Promise<T> => {
  const response = await send(path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) throw payload

  return payload as T
}
