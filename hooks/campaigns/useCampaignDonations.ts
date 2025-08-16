'use client'

import useSWR from 'swr'
import { authenticatedFetcher } from '@/lib/auth/swrConfig'
import { useAuth } from '@/lib/auth/authContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

export interface Donation {
  id: string
  campaign_id: string
  amount: number
  donor_id?: string
  donorName?: string
  date: string
  message?: string
  is_anonymous: boolean
  payment_method?: {
    id: number
    code: string
    name: string
  }
  status: string
  transactionId?: string
}

export function useCampaignDonations(campaignId: string | undefined) {
  const { isAuthenticated } = useAuth()
  
  const { data, error, mutate, isLoading } = useSWR<Donation[]>(
    isAuthenticated && campaignId ? `/api/campaigns/${campaignId}/donations` : null,
    authenticatedFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Format donations for display
  const formattedDonations = data?.map(donation => ({
    ...donation,
    donorName: donation.is_anonymous ? 'Donante Anónimo' : donation.donorName || 'Sin nombre',
    transactionId: donation.id.slice(0, 8).toUpperCase(),
  })) || []

  return {
    donations: formattedDonations,
    isLoading,
    error,
    mutate,
  }
}