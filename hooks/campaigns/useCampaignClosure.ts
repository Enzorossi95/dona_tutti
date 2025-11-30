'use client'

import { useState } from 'react'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { CloseCampaignRequest, ClosureReport } from '@/types/closure'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

interface UseCampaignClosureResult {
  closeCampaign: (campaignId: string, request: CloseCampaignRequest) => Promise<ClosureReport>
  getClosureReport: (campaignId: string) => Promise<ClosureReport>
  isLoading: boolean
  error: string | null
}

/**
 * Hook para cerrar campañas y obtener reportes de cierre (admin)
 */
export function useCampaignClosure(): UseCampaignClosureResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const closeCampaign = async (campaignId: string, request: CloseCampaignRequest): Promise<ClosureReport> => {
    setIsLoading(true)
    setError(null)

    try {
      const currentToken = tokenStorage.getAccessToken()
      if (!currentToken) {
        throw new Error('No estás autenticado')
      }

      const response = await fetch(
        `${API_URL}/api/campaigns/${campaignId}/close`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || errorData?.message || 'Error al cerrar la campaña')
      }

      const report: ClosureReport = await response.json()
      return report
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getClosureReport = async (campaignId: string): Promise<ClosureReport> => {
    setIsLoading(true)
    setError(null)

    try {
      const currentToken = tokenStorage.getAccessToken()
      if (!currentToken) {
        throw new Error('No estás autenticado')
      }

      const response = await fetch(
        `${API_URL}/api/campaigns/${campaignId}/closure-report`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || errorData?.message || 'Error al obtener el reporte de cierre')
      }

      const report: ClosureReport = await response.json()
      return report
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    closeCampaign,
    getClosureReport,
    isLoading,
    error,
  }
}
