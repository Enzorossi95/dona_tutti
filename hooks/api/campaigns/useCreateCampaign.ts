import useSWRMutation from 'swr/mutation'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { authApi } from '@/lib/auth/authApi'

interface CampaignData {
  title: string
  description: string
  image: string
  goal: number
  start_date: string
  end_date: string
  location: string
  category: string
  urgency: number
  status: string
  payment_methods: Array<{
    payment_method_id: number
    instructions: string
  }>
  beneficiary_name: string
  beneficiary_age?: number | null
  current_situation: string
  urgency_reason: string
  required_help: string
  organizer: {
    id: string
    name: string
    phone?: string
    email: string
    website?: string
  }
}

interface CreateCampaignResponse {
  id: string
  title: string
  message?: string
  // Add other response fields as needed
}

const createCampaignFetcher = async (url: string, { arg }: { arg: CampaignData }): Promise<CreateCampaignResponse> => {
  let accessToken = tokenStorage.getAccessToken();
  
  // Check if token is expired and try to refresh
  if (tokenStorage.isTokenExpired()) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const response = await authApi.refreshToken(refreshToken);
        const newTokens = {
          accessToken: response.accessToken,
          refreshToken: refreshToken,
          expiresIn: response.expiresIn,
          tokenType: 'Bearer'
        };
        tokenStorage.setTokens(newTokens);
        accessToken = response.accessToken;
      } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    } else {
      // No refresh token, redirect to login
      tokenStorage.clearTokens();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg)
  })

  if (!response.ok) {
    // Handle 401 specifically - try to refresh token once more
    if (response.status === 401) {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await authApi.refreshToken(refreshToken);
          const newTokens = {
            accessToken: refreshResponse.accessToken,
            refreshToken: refreshToken,
            expiresIn: refreshResponse.expiresIn,
            tokenType: 'Bearer'
          };
          tokenStorage.setTokens(newTokens);
          
          // Retry original request with new token
          const retryResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${refreshResponse.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(arg)
          });
          
          if (!retryResponse.ok) {
            let errorMessage = 'Error al crear la campaña'
            try {
              const errorData = await retryResponse.json()
              errorMessage = errorData.message || errorData.error || errorMessage
            } catch {
              errorMessage = retryResponse.statusText || errorMessage
            }
            
            const error = new Error(errorMessage)
            ;(error as any).status = retryResponse.status
            throw error
          }
          
          return retryResponse.json();
        } catch (refreshError) {
          tokenStorage.clearTokens();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
      } else {
        tokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    }

    // Try to get error message from response
    let errorMessage = 'Error al crear la campaña'
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      // If can't parse JSON, use status text
      errorMessage = response.statusText || errorMessage
    }
    
    const error = new Error(errorMessage)
    // Attach status code for additional error handling
    ;(error as any).status = response.status
    throw error
  }

  return response.json()
}

export function useCreateCampaign() {
  const { 
    trigger, 
    isMutating: isLoading, 
    error,
    data
  } = useSWRMutation(
    'http://localhost:9999/api/campaigns',
    createCampaignFetcher
  )

  const createCampaign = async (campaignData: CampaignData) => {
    try {
      console.log('Creating campaign with data:', JSON.stringify(campaignData, null, 2))
      const result = await trigger(campaignData)
      console.log('Campaign created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating campaign:', error)
      console.error('Campaign data that failed:', JSON.stringify(campaignData, null, 2))
      throw error
    }
  }

  return {
    createCampaign,
    isLoading,
    error,
    data,
    isSuccess: !!data && !error,
  }
} 