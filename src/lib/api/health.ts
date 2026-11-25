import { getJson } from '@/lib/api/apiClient'

// Absents du contrat d'API : formes reprises de healthService et dbHealthService du backend.
type HealthStatus = {
  status: 'ok'
  uptime: number
  timestamp: string
}

type DbHealthStatus =
  | { status: 'ok'; latencyMs: number }
  | { status: 'unavailable' }

export const fetchHealth = () => getJson<HealthStatus>('/health')

export const fetchDbHealth = () => getJson<DbHealthStatus>('/db-health')
