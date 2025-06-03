export interface Donation {
  id: number
  campaignId: string
  amount: number
  donor: Donor
  date: string
  time: string
  message?: string
  isAnonymous: boolean
  paymentMethod: PaymentMethod
  status: DonationStatus
}

export interface Donor {
  name: string
  avatar?: string
  isVerified?: boolean
}

export type PaymentMethod = 'MercadoPago' | 'Transferencia' | 'Efectivo' | 'Tarjeta'
export type DonationStatus = 'completed' | 'pending' | 'failed' | 'refunded'

export interface DonationSummary {
  totalAmount: number
  totalDonations: number
  averageAmount: number
  topDonation: number
  byPaymentMethod: Record<PaymentMethod, number>
  recentDonations: Donation[]
} 