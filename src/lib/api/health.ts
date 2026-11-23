import { getJson } from '@/lib/api/apiClient'
import type { DbHealthStatus, HealthStatus } from '@/types/apiContract'

export const fetchHealth = () => getJson<HealthStatus>('/health')

export const fetchDbHealth = () => getJson<DbHealthStatus>('/db-health')
