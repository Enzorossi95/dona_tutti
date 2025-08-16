'use client'

import useSWR from 'swr'
import { publicFetcher } from '@/lib/auth/swrConfig'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

export interface Campaign {
  id: string
  title: string
  description: string
  image?: string
  goal: number
  raised?: number
  donors?: number
  daysLeft?: number
  start_date: string
  end_date: string
  location: string
  category?: {
    id: string
    name: string
  }
  organizer?: {
    id: string
    name: string
    verified: boolean
    avatar?: string
  }
  urgency: number
  status: string
  beneficiary_name: string
  beneficiary_type: string
  beneficiary_count?: number
  payment_methods?: Array<{
    id: number
    payment_method_id: number
    code: string
    name: string
    instructions: string
  }>
  created_at?: string
  updated_at?: string
}

export function useCampaign(campaignId: string | undefined) {
  const { data, error, mutate, isLoading } = useSWR<Campaign>(
    campaignId ? `/api/campaigns/${campaignId}` : null,
    publicFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Calculate derived values
  const campaignWithDerived = data ? {
    ...data,
    raised: data.raised || 0,
    donors: data.donors || 0,
    daysLeft: calculateDaysLeft(data.end_date),
  } : null

  return {
    campaign: campaignWithDerived,
    isLoading,
    error,
    mutate,
  }
}

function calculateDaysLeft(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}