export interface PaymentMethod {
  id: number
  code: string
  name: string
}

export interface Donor {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  is_verified: boolean
}

export type DonationStatus = 'completed' | 'pending' | 'failed' | 'refunded'

export interface Donation {
  id: string
  campaign_id: string
  amount: number
  donor_id: string
  donor?: Donor
  date: string
  message?: string
  is_anonymous: boolean
  payment_method: PaymentMethod
  status: DonationStatus
  created_at?: string
  updated_at?: string
}

export interface DonationFilters {
  searchTerm: string
  status: string
  dateFrom?: string
  dateTo?: string
  paymentMethod?: string
}

export interface DonationSummary {
  totalAmount: number
  totalDonations: number
  byStatus: Record<DonationStatus, number>
  byPaymentMethod: Record<string, number>
} 