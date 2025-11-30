'use client'

import useSWR from 'swr'
import { authenticatedFetcher } from '@/lib/auth/swrConfig'
import { useAuth } from '@/lib/auth/authContext'
import { Donation, DonationStatus, PaymentMethod, Donor } from '@/types/donation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

// Backend donation structure
interface BackendDonation {
  id: string
  campaign_id: string
  amount: number
  donor_id: string
  date: string
  message?: string
  is_anonymous: boolean
  payment_method: PaymentMethod
  status: DonationStatus
  receipt_url?: string | null
  created_at?: string
  updated_at?: string
  donor?: Donor
}

// Transform backend donation to frontend format
function transformDonation(donation: BackendDonation): Donation {
  return {
    id: donation.id,
    campaign_id: donation.campaign_id,
    amount: donation.amount,
    donor_id: donation.donor_id,
    date: new Date(donation.date).toLocaleDateString('es-AR'),
    message: donation.message,
    is_anonymous: donation.is_anonymous,
    payment_method: donation.payment_method,
    status: donation.status,
    receipt_url: donation.receipt_url,
    created_at: donation.created_at,
    updated_at: donation.updated_at,
    donor: donation.donor
  }
}

// Export for use in other hooks
export { transformDonation }
export type { BackendDonation }

export function useCampaignDonations(campaignId: string | undefined) {
  const { isAuthenticated } = useAuth()
  
  const { data, error, mutate, isLoading } = useSWR<BackendDonation[]>(
    isAuthenticated && campaignId ? `/api/campaigns/${campaignId}/donations` : null,
    authenticatedFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // Fallback to empty array if endpoint doesn't exist
      fallbackData: [],
    }
  )

  // Transform donations to frontend format
  const donations = data?.map(transformDonation) || []

  // Calculate totals
  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalDonations = donations.length

  return {
    donations,
    totalAmount,
    totalDonations,
    isLoading,
    error,
    mutate,
  }
}