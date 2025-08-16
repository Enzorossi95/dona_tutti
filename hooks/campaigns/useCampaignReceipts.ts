'use client'

import { Receipt } from '@/types/receipt'
import { getReceiptsByCampaign, getTotalSpentByCampaign } from '@/lib/data/receipts'

// For now, we'll use mock data for receipts since the backend endpoint might not exist yet
// When the backend endpoint is ready, this can be updated to fetch from API

export function useCampaignReceipts(campaignId: string | undefined) {
  // TODO: Replace with actual API call when backend endpoint is available
  // const { data, error, mutate, isLoading } = useSWR<Receipt[]>(
  //   campaignId ? `/api/campaigns/${campaignId}/receipts` : null,
  //   publicFetcher
  // )

  // For now, use mock data
  const receipts = campaignId ? getReceiptsByCampaign(campaignId) : []
  const totalSpent = campaignId ? getTotalSpentByCampaign(campaignId) : 0

  return {
    receipts,
    totalSpent,
    isLoading: false,
    error: null,
  }
}