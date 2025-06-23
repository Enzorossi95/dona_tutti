import useSWR from 'swr'
import { Summary, TransformedSummary } from '@/types/summary'

const SUMMARY_API_URL = 'http://localhost:9999/summary/campaigns'

const fetcher = async (url: string): Promise<Summary> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Error fetching summary data')
  }
  return response.json()
}

export function useSummary() {
  const { data, error, isLoading } = useSWR<Summary>(SUMMARY_API_URL, fetcher)

  const transformedData: TransformedSummary | undefined = data
    ? {
        totalCampaigns: data.result.total_campaigns,
        activeCampaigns: data.result.total_campaigns, // Same as total for now
        totalRaised: data.result.total_goal,
        totalDonors: data.result.total_contributors,
        thisMonthRaised: 0, // Hardcoded for now
        thisMonthDonors: 0, // Hardcoded for now
      }
    : undefined

  return {
    summary: transformedData,
    isLoading,
    isError: error
  }
} 