'use client'

import useSWR from 'swr'
import { CampaignActivity } from '@/types/campaign'
import { useAuth } from '@/lib/auth/authContext'
import { authenticatedFetcher } from '@/lib/auth/swrConfig'
import { tokenStorage } from '@/lib/auth/tokenStorage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

// Simplified interface for creating activities (only backend-supported fields)
export interface CreateActivityData {
  type: 'medical' | 'expense' | 'general'
  title: string
  content: string // Will be mapped to 'description' for backend
  author: string
}

// Public fetcher for campaign activities (no auth required)
const publicActivitiesFetcher = async (url: string) => {
  const response = await fetch(`${API_URL}${url}`)
  if (!response.ok) {
    throw new Error('Failed to fetch campaign activities')
  }
  return response.json()
}

// Backend activity structure
interface BackendActivity {
  id: string
  campaign_id: string
  title: string
  description: string
  type: string
  date: string
  author?: string
  created_at?: string
  updated_at?: string
}

// Transform backend activity to frontend CampaignActivity format
function transformActivity(activity: BackendActivity): CampaignActivity {
  return {
    id: activity.id,
    campaign_id: activity.campaign_id,
    title: activity.title,
    description: activity.description,
    date: activity.date || activity.created_at || new Date().toISOString(),
    type: activity.type,
    author: activity.author || 'Organizador',
  }
}

export function useCampaignActivities(campaignId: string | undefined) {
  const { isAuthenticated } = useAuth()
  
  // Choose fetcher based on authentication
  const shouldUseAuth = isAuthenticated && campaignId
  const endpoint = campaignId ? `/api/campaigns/${campaignId}/activities` : null
  
  // Fetch campaign activities (public or authenticated)
  const { data, error, mutate, isLoading } = useSWR<BackendActivity[]>(
    endpoint,
    shouldUseAuth ? authenticatedFetcher : publicActivitiesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Transform activities to frontend format
  const activities = data?.map(transformActivity) || []

  // Create a new activity (requires authentication)
  const createActivity = async (data: CreateActivityData) => {
    if (!isAuthenticated || !campaignId) {
      throw new Error('Authentication required to create activities')
    }

    try {
      const currentToken = tokenStorage.getAccessToken()
      if (!currentToken) {
        throw new Error('No authentication token available')
      }

      // Prepare data according to backend API structure
      const requestData = {
        title: data.title,
        description: data.content, // Backend expects 'description' not 'content'
        date: new Date().toISOString(),
        type: data.type,
        author: data.author
      }

      const response = await fetch(`${API_URL}/api/campaigns/${campaignId}/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear la actividad')
      }

      const newActivity = await response.json()
      
      // Optimistically update the cache
      mutate((currentActivities) => {
        if (!currentActivities) return [newActivity]
        return [newActivity, ...currentActivities]
      }, false)
      
      // Revalidate to ensure consistency
      mutate()
      
      return newActivity
    } catch (error) {
      console.error('Error creating activity:', error)
      throw error
    }
  }

  // Update an existing activity (requires authentication)
  const updateActivity = async (activityId: string, data: Partial<CreateActivityData>) => {
    if (!isAuthenticated || !campaignId) {
      throw new Error('Authentication required to update activities')
    }

    try {
      const currentToken = tokenStorage.getAccessToken()
      if (!currentToken) {
        throw new Error('No authentication token available')
      }

      // Prepare data according to backend API structure
      const requestData: any = {}
      if (data.title) requestData.title = data.title
      if (data.content) requestData.description = data.content // Backend expects 'description'
      if (data.type) requestData.type = data.type
      if (data.author) requestData.author = data.author

      const response = await fetch(`${API_URL}/api/campaigns/${campaignId}/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al actualizar la actividad')
      }

      const updatedActivity = await response.json()
      
      // Update cache
      mutate((currentActivities) => {
        if (!currentActivities) return [updatedActivity]
        return currentActivities.map(a => a.id === activityId ? updatedActivity : a)
      }, false)
      
      mutate()
      
      return updatedActivity
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  }

  // Delete an activity (requires authentication)
  const deleteActivity = async (activityId: string) => {
    if (!isAuthenticated || !campaignId) {
      throw new Error('Authentication required to delete activities')
    }

    try {
      const currentToken = tokenStorage.getAccessToken()
      if (!currentToken) {
        throw new Error('No authentication token available')
      }

      const response = await fetch(`${API_URL}/api/campaigns/${campaignId}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al eliminar la actividad')
      }

      // Update cache
      mutate((currentActivities) => {
        if (!currentActivities) return []
        return currentActivities.filter(a => a.id !== activityId)
      }, false)
      
      mutate()
      
      return true
    } catch (error) {
      console.error('Error deleting activity:', error)
      throw error
    }
  }

  return {
    activities,
    isLoading,
    error,
    mutate,
    // CRUD methods (only available when authenticated)
    createActivity: isAuthenticated ? createActivity : undefined,
    updateActivity: isAuthenticated ? updateActivity : undefined,
    deleteActivity: isAuthenticated ? deleteActivity : undefined,
  }
}