import { useState, useCallback, useEffect } from 'react'
import { Contract, GenerateContractResponse, AcceptContractResponse } from '@/types/campaign'
import { authenticatedFetcher } from '@/lib/auth/swrConfig'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { authApi } from '@/lib/auth/authApi'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

export type ContractStep = 'generate' | 'view' | 'accept' | 'success'

interface ContractFlowState {
  step: ContractStep
  loading: boolean
  contractUrl: string | null
  hasAccepted: boolean
  hasReadCheckbox: boolean
  error: string | null
  contract: Contract | null
}

interface UseContractFlowReturn extends ContractFlowState {
  generateContract: () => Promise<void>
  fetchContract: () => Promise<void>
  acceptContract: () => Promise<void>
  setHasReadCheckbox: (value: boolean) => void
  resetError: () => void
  validateOrganizerData: (organizer: any) => { isValid: boolean; missingFields: string[] }
}

export function useContractFlow(campaignId: string, organizerId: string): UseContractFlowReturn {
  const [state, setState] = useState<ContractFlowState>({
    step: 'generate',
    loading: false,
    contractUrl: null,
    hasAccepted: false,
    hasReadCheckbox: false,
    error: null,
    contract: null,
  })

  // Validate organizer data
  const validateOrganizerData = useCallback((organizer: any) => {
    const missingFields: string[] = []
    
    if (!organizer?.email) missingFields.push('email')
    if (!organizer?.phone) missingFields.push('phone')
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
    }
  }, [])

  // Fetch existing contract on mount
  const fetchContract = useCallback(async () => {
    if (!campaignId) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const contract = await authenticatedFetcher(`/api/campaigns/${campaignId}/contract`)
      
      setState(prev => ({
        ...prev,
        contract,
        contractUrl: contract.contract_pdf_url,
        hasAccepted: contract.accepted_at && contract.accepted_at !== '0001-01-01T00:00:00Z',
        loading: false,
        step: contract.accepted_at && contract.accepted_at !== '0001-01-01T00:00:00Z' 
          ? 'success' 
          : 'view',
      }))
    } catch (error: any) {
      // If contract doesn't exist (404), that's fine - stay on generate step
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        setState(prev => ({ ...prev, loading: false, step: 'generate' }))
      } else {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message || 'Error al cargar el contrato'
        }))
      }
    }
  }, [campaignId])

  // Generate contract
  const generateContract = useCallback(async () => {
    if (!campaignId) {
      setState(prev => ({ ...prev, error: 'ID de campaña no válido' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Get valid token with auto-refresh
      let accessToken = tokenStorage.getAccessToken()
      
      if (tokenStorage.isTokenExpired()) {
        const refreshToken = tokenStorage.getRefreshToken()
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken, accessToken || undefined)
          tokenStorage.setTokens({
            accessToken: response.accessToken,
            refreshToken,
            expiresIn: response.expiresIn,
            tokenType: 'Bearer'
          })
          accessToken = response.accessToken
        } else {
          throw new Error('No refresh token available')
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/campaigns/${campaignId}/contract/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          const errorData = await response.json()
          if (errorData.error?.includes('already exists')) {
            // Contract already exists, fetch it
            await fetchContract()
            return
          }
          throw new Error(errorData.error || 'Error al generar el contrato')
        }
        
        if (response.status === 404) {
          throw new Error('Campaña no encontrada')
        }
        
        if (response.status === 500) {
          const errorData = await response.json()
          if (errorData.error?.includes('must have')) {
            throw new Error('Por favor, completa tu información de organizador antes de continuar')
          }
          throw new Error(errorData.error || 'Error del servidor')
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: GenerateContractResponse = await response.json()
      
      setState(prev => ({
        ...prev,
        loading: false,
        contractUrl: data.contract_url,
        step: 'view',
      }))
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al generar el contrato',
      }))
    }
  }, [campaignId, fetchContract])

  // Accept contract
  const acceptContract = useCallback(async () => {
    if (!state.hasReadCheckbox) {
      setState(prev => ({ 
        ...prev, 
        error: 'Debes confirmar que has leído el contrato' 
      }))
      return
    }

    if (!campaignId || !organizerId) {
      setState(prev => ({ 
        ...prev, 
        error: 'Faltan datos necesarios para aceptar el contrato' 
      }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Get valid token with auto-refresh
      let accessToken = tokenStorage.getAccessToken()
      
      if (tokenStorage.isTokenExpired()) {
        const refreshToken = tokenStorage.getRefreshToken()
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken, accessToken || undefined)
          tokenStorage.setTokens({
            accessToken: response.accessToken,
            refreshToken,
            expiresIn: response.expiresIn,
            tokenType: 'Bearer'
          })
          accessToken = response.accessToken
        } else {
          throw new Error('No refresh token available')
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/campaigns/${campaignId}/contract/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizer_id: organizerId,
        }),
      })

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Error al aceptar el contrato')
        }
        
        if (response.status === 404) {
          throw new Error('Contrato no encontrado. Por favor, genera el contrato primero.')
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: AcceptContractResponse = await response.json()
      
      setState(prev => ({
        ...prev,
        loading: false,
        hasAccepted: true,
        step: 'success',
      }))
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Error al aceptar el contrato',
      }))
    }
  }, [campaignId, organizerId, state.hasReadCheckbox])

  const setHasReadCheckbox = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, hasReadCheckbox: value }))
  }, [])

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Check for existing contract on mount
  useEffect(() => {
    if (campaignId) {
      fetchContract()
    }
  }, [campaignId, fetchContract])

  return {
    ...state,
    generateContract,
    fetchContract,
    acceptContract,
    setHasReadCheckbox,
    resetError,
    validateOrganizerData,
  }
}

