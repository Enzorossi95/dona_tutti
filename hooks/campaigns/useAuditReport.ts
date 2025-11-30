'use client'

import useSWR from 'swr'
import { PublicAuditReport } from '@/types/closure'
import { publicFetcher } from '@/lib/auth/swrConfig'

/**
 * Hook para obtener el reporte público de auditoría de una campaña cerrada
 * Este hook usa SWR con fetcher público (no requiere autenticación)
 */
export function useAuditReport(campaignId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<PublicAuditReport>(
    campaignId ? `/api/campaigns/${campaignId}/audit` : null,
    publicFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false, // No reintentar si la campaña no está cerrada
    }
  )

  return {
    auditReport: data,
    isLoading,
    error,
    mutate,
  }
}
