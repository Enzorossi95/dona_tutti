export interface Campaign {
  id: string
  title: string
  description: string
  image: string
  goal: number
  raised: number
  donors: number
  daysLeft: number
  location: string
  category: CampaignCategory
  urgency: CampaignUrgency
  organizer: Organizer
  status: CampaignStatus
  animal?: Animal
  images?: string[]
  createdAt: string
  lastUpdate: string
}

export interface Animal {
  name: string
  type: string
  age: string
  breed: string
}

export interface Organizer {
  name: string
  avatar: string
  verified: boolean
}

export type CampaignCategory = 'Médico' | 'Refugio' | 'Alimentación' | 'Rescate'
export type CampaignUrgency = 'Alta' | 'Media' | 'Baja'
export type CampaignStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface CampaignFilters {
  searchTerm: string
  category: string
  urgency?: string
  status?: string
}

export interface CampaignUpdate {
  id: number
  date: string
  time: string
  type: 'medical' | 'expense' | 'general'
  title: string
  content: string
  fullContent: string
  images?: string[]
  documents?: string[]
  author: string
  location: string
  expense?: {
    total: number
    breakdown: Array<{
      item: string
      amount: number
    }>
  }
  published: boolean
}

export interface CampaignComment {
  id: number
  author: string
  avatar: string
  date: string
  content: string
} 

export interface CampaignDonation {
  id: number
  donorName: string
  donorEmail: string
  amount: number
  date: string
  time: string
  transactionId: string
  paymentMethod: string
  status: string
  message: string
  anonymous: boolean
}