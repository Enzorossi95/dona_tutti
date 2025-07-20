import useSWRMutation from 'swr/mutation'

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
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg)
  })

  if (!response.ok) {
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
      console.log('Creating campaign with data:', campaignData)
      const result = await trigger(campaignData)
      console.log('Campaign created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating campaign:', error)
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