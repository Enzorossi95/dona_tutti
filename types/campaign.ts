export interface Campaign {
  id: string
  title: string
  description: string
  image: string
  goal: number
  raised?: number
  donors?: number
  daysLeft?: number
  location: string
  category: string // UUID from backend
  urgency: string // 1-10 scale from backend
  organizer?: Organizer
  status: CampaignStatus
  animal?: Animal
  images?: string[]
  created_at: string // Backend field name
  start_date: string
  end_date: string
  beneficiary_name: string
  beneficiary_age?: number | null
  current_situation: string
  urgency_reason: string
  lastUpdate?: string // Calculated field
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
export type CampaignStatus = 'active' | 'completed' | 'paused' | 'cancelled' | 'draft' | 'pending_approval'

export interface CampaignFilters {
  searchTerm: string
  category: string
  urgency?: string
  status?: string
}

export interface CampaignActivity {
  id: string
  campaign_id: string
  title: string
  description: string
  date: string
  type: string
  author: string
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

// Contract types
export interface Contract {
  id: string
  campaign_id: string
  organizer_id: string
  contract_pdf_url: string
  contract_hash: string
  accepted_at: string
  acceptance_metadata: {
    ip: string
    user_agent: string
  }
  created_at: string
}

export interface GenerateContractResponse {
  message: string
  contract_url: string
}

export interface AcceptContractResponse {
  message: string
  status: 'pending_approval'
}