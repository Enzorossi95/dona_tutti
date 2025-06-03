import { useState, useMemo } from 'react'
import { Campaign, CampaignFilters } from '@/types/campaign'
import { campaigns } from '@/lib/data/campaigns'

export function useCampaigns() {
  const [filters, setFilters] = useState<CampaignFilters>({
    searchTerm: '',
    category: 'all',
    urgency: 'all',
    status: 'all'
  })

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      
      const matchesCategory = 
        filters.category === 'all' || 
        campaign.category.toLowerCase() === filters.category.toLowerCase()
      
      const matchesUrgency = 
        !filters.urgency || 
        filters.urgency === 'all' || 
        campaign.urgency.toLowerCase() === filters.urgency.toLowerCase()
      
      const matchesStatus = 
        !filters.status || 
        filters.status === 'all' || 
        campaign.status === filters.status

      return matchesSearch && matchesCategory && matchesUrgency && matchesStatus
    })
  }, [filters])

  return {
    campaigns: filteredCampaigns,
    filters,
    setFilters,
    totalCampaigns: campaigns.length,
    filteredCount: filteredCampaigns.length
  }
}

export function useCampaign(id: string) {
  const campaign = useMemo(() => {
    return campaigns.find(c => c.id === id)
  }, [id])

  return {
    campaign,
    isLoading: false,
    error: campaign ? null : 'Campaña no encontrada'
  }
} 