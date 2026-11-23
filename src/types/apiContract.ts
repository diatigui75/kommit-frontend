// Réponses des routes du backend, reprises telles quelles de kommit-backend.

export type HealthStatus = {
  status: 'ok'
  uptime: number
  timestamp: string
}

export type DbHealthStatus =
  | { status: 'ok'; latencyMs: number }
  | { status: 'unavailable' }
