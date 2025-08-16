'use client'

import useSWR from 'swr'
import { Campaign, CampaignStatus } from '@/types/campaign'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

// Backend campaign structure
interface BackendCampaign {
  id: string
  title: string
  description: string
  image?: string
  goal: number
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
  current_situation: string
  urgency_reason: string
  created_at?: string
  updated_at?: string
}

// Calculate days left from end date
function calculateDaysLeft(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Map urgency number to text
function getUrgencyText(urgency: number): string {
  if (urgency >= 8) return 'Alta'
  if (urgency >= 5) return 'Media'
  return 'Baja'
}

// Transform backend campaign to frontend format
function transformCampaign(backendCampaign: BackendCampaign): Campaign {
  return {
    id: backendCampaign.id,
    title: backendCampaign.title,
    description: backendCampaign.description,
    image: backendCampaign.image || '/placeholder.svg',
    goal: backendCampaign.goal,
    raised: 0, // This should come from backend aggregation
    donors: 0, // This should come from backend aggregation
    daysLeft: calculateDaysLeft(backendCampaign.end_date),
    urgency: getUrgencyText(backendCampaign.urgency),
    category: backendCampaign.category?.name || 'General',
    location: backendCampaign.location,
    status: backendCampaign.status as CampaignStatus,
    organizer: {
      name: backendCampaign.organizer?.name || 'Organizador',
      verified: backendCampaign.organizer?.verified || false,
      avatar: backendCampaign.organizer?.avatar || '/placeholder.svg'
    },
    created_at: backendCampaign.created_at || new Date().toISOString(),
    start_date: backendCampaign.start_date,
    end_date: backendCampaign.end_date,
    beneficiary_name: backendCampaign.beneficiary_name,
    current_situation: backendCampaign.current_situation,
    urgency_reason: backendCampaign.urgency_reason,
    images: backendCampaign.image ? [backendCampaign.image] : []
  }
}

export function useCampaigns() {
  // For public campaigns, we'll create a simple fetcher that doesn't require auth
  const fetcher = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns')
    }
    return response.json()
  }

  const { data, error, mutate, isLoading } = useSWR<BackendCampaign[]>(
    `${API_URL}/api/campaigns`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Transform campaigns to frontend format
  const campaigns = data?.map(transformCampaign) || []

  // Filter only active campaigns for public view
  const activeCampaigns = campaigns.filter(c => c.status === 'active')

  return {
    campaigns: activeCampaigns,
    allCampaigns: campaigns,
    isLoading,
    error,
    mutate,
  }
}