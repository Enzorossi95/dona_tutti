'use client'

import useSWR from 'swr'
import { Receipt, ReceiptType } from '@/types/receipt'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

// Public fetcher for campaign receipts (no auth required)
const publicReceiptsFetcher = async (url: string) => {
  const response = await fetch(`${API_URL}${url}`)
  if (!response.ok) {
    // If endpoint doesn't exist, return empty array
    if (response.status === 404) {
      console.warn('Receipts endpoint not found, using empty array')
      return []
    }
    throw new Error('Failed to fetch campaign receipts')
  }
  return response.json()
}

// Backend receipt structure
interface BackendReceipt {
  id: string | number
  campaign_id: string
  date: string
  type: string
  total: number
  description: string
  provider?: string
  name?: string
  quantity?: number
  //status?: string
  //document_url?: string
  //image_url?: string
  //created_at?: string
  updated_at?: string
  note?: string
}

// Transform backend receipt to frontend format
function transformReceipt(receipt: BackendReceipt): Receipt {
  return {
    id: typeof receipt.id === 'string' ? parseInt(receipt.id) : receipt.id,
    campaignId: receipt.campaign_id,
    date: new Date(receipt.date).toLocaleDateString('es-AR'),
    type: receipt.type as ReceiptType,
    total: receipt.total,
    description: receipt.description,
    name: receipt.name || 'No especificado',
    quantity: receipt.quantity || 1,
    //document: receipt.document_url || '',
    //image: receipt.image_url || '/placeholder.svg',
    provider: receipt.provider || 'No especificado',
    //status: receipt.status || 'Pagado',
    //breakdown: [], // Backend doesn't provide breakdown yet
    note: receipt.note || '', // Backend doesn't provide notes yet
  }
}

export function useCampaignPublicReceipts(campaignId: string | undefined) {
  // Fetch campaign receipts from public endpoint
  const { data, error, mutate, isLoading } = useSWR<BackendReceipt[]>(
    campaignId ? `/api/campaigns/${campaignId}/receipts` : null,
    publicReceiptsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // Fallback to empty array if endpoint doesn't exist
      fallbackData: [],
    }
  )

  // Transform receipts to frontend format
  const receipts = data?.map(transformReceipt) || []
  
  // Calculate total spent
  const totalSpent = receipts.reduce((sum, receipt) => sum + receipt.total, 0)

  return {
    receipts,
    totalSpent,
    isLoading,
    error,
    mutate,
  }
}