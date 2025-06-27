import { Summary, TransformedSummary } from '@/types/summary'
import { useAuthSWR } from '@/lib/hooks/useAuthSWR'

const SUMMARY_API_URL = '/api/summary/campaigns'

export function useAuthenticatedSummary() {
  const { data, error, isLoading } = useAuthSWR<Summary>(SUMMARY_API_URL)

  const transformedData: TransformedSummary | undefined = data
    ? {
        totalCampaigns: data.result.total_campaigns,
        activeCampaigns: data.result.total_campaigns,
        totalRaised: data.result.total_goal,
        totalDonors: data.result.total_contributors,
        thisMonthRaised: 0,
        thisMonthDonors: 0,
      }
    : undefined

  return {
    summary: transformedData,
    isLoading,
    isError: error
  }
}

// Example of a hook that requires specific permissions
export function useAdminSummary() {
  const { data, error, isLoading } = useAuthSWR<Summary>(
    '/api/admin/summary/campaigns'
  )

  return {
    adminSummary: data,
    isLoading,
    isError: error
  }
}