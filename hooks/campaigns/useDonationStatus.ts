'use client'

import { useState } from 'react'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { Donation, DonationStatus } from '@/types/donation'
import { transformDonation, BackendDonation } from './useCampaignDonations'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

interface UpdateDonationStatusParams {
  campaignId: string
  donationId: string
  status: DonationStatus
}

interface UpdateDonationStatusResult {
  updateStatus: (params: UpdateDonationStatusParams) => Promise<Donation>
  isUpdating: boolean
  error: string | null
}

/**
 * Hook for updating donation status
 * Similar pattern to useCampaignActivities
 */
export function useDonationStatus(): UpdateDonationStatusResult {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = async ({ campaignId, donationId, status }: UpdateDonationStatusParams) => {
    setIsUpdating(true)
    setError(null)

    try {
      const currentToken = tokenStorage.getAccessToken()
      if (!currentToken) {
        throw new Error('No estás autenticado')
      }

      const response = await fetch(
        `${API_URL}/api/campaigns/${campaignId}/donations/${donationId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Error al actualizar el estado de la donación')
      }

      // Return the updated donation transformed to frontend format
      const backendDonation: BackendDonation = await response.json()
      return transformDonation(backendDonation)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('Error updating donation status:', err)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    updateStatus,
    isUpdating,
    error,
  }
}

