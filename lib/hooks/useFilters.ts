import { useState, useMemo, useCallback } from 'react'

// Tipos base para filtros
export interface BaseFilters {
  searchTerm: string
}

export interface CampaignFilters extends BaseFilters {
  status: string
  category: string
  dateRange: string
}

export interface ReceiptFilters extends BaseFilters {
  type: string
  status: string
  dateRange: string
  minAmount: number | null
  maxAmount: number | null
}

// Opciones para el hook genérico
export interface UseFiltersOptions<T extends BaseFilters> {
  initialFilters: T
  filterFunction: (items: any[], filters: T) => any[]
}

// Hook genérico para cualquier tipo de filtro
export function useFilters<T extends BaseFilters>({
  initialFilters,
  filterFunction
}: UseFiltersOptions<T>) {
  const [filters, setFilters] = useState<T>(initialFilters)

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const applyFilters = useCallback((items: any[]) => {
    return filterFunction(items, filters)
  }, [filterFunction, filters])

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'searchTerm') return value !== ''
      if (typeof value === 'string') return value !== 'all' && value !== ''
      if (typeof value === 'number') return value !== null && value !== 0
      return false
    })
  }, [filters])

  return {
    filters,
    updateFilter,
    resetFilters,
    applyFilters,
    hasActiveFilters
  }
}

// Hook específico para filtros de campañas
export function useCampaignFilters() {
  const initialFilters: CampaignFilters = {
    searchTerm: '',
    status: 'all',
    category: 'all',
    dateRange: 'all'
  }

  const filterFunction = useCallback((campaigns: any[], filters: CampaignFilters) => {
    return campaigns.filter(campaign => {
      // Filtro por término de búsqueda
      const matchesSearch = filters.searchTerm === '' || 
        campaign.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())

      // Filtro por estado
      const matchesStatus = filters.status === 'all' || 
        campaign.status?.toLowerCase() === filters.status.toLowerCase()

      // Filtro por categoría
      const matchesCategory = filters.category === 'all' || 
        campaign.category?.toLowerCase() === filters.category.toLowerCase()

      // Filtro por rango de fechas
      const matchesDateRange = filters.dateRange === 'all' || 
        checkDateRange(campaign.createdAt, filters.dateRange)

      return matchesSearch && matchesStatus && matchesCategory && matchesDateRange
    })
  }, [])

  return useFilters({ initialFilters, filterFunction })
}

// Hook específico para filtros de comprobantes
export function useReceiptFilters() {
  const initialFilters: ReceiptFilters = {
    searchTerm: '',
    type: 'all',
    status: 'all',
    dateRange: 'all',
    minAmount: null,
    maxAmount: null
  }

  const filterFunction = useCallback((receipts: any[], filters: ReceiptFilters) => {
    return receipts.filter(receipt => {
      // Filtro por término de búsqueda
      const matchesSearch = filters.searchTerm === '' || 
        receipt.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        receipt.vendor?.toLowerCase().includes(filters.searchTerm.toLowerCase())

      // Filtro por tipo
      const matchesType = filters.type === 'all' || 
        receipt.type?.toLowerCase() === filters.type.toLowerCase()

      // Filtro por estado
      const matchesStatus = filters.status === 'all' || 
        receipt.status?.toLowerCase() === filters.status.toLowerCase()

      // Filtro por rango de fechas
      const matchesDateRange = filters.dateRange === 'all' || 
        checkDateRange(receipt.date, filters.dateRange)

      // Filtro por monto mínimo
      const matchesMinAmount = filters.minAmount === null || 
        receipt.amount >= filters.minAmount

      // Filtro por monto máximo
      const matchesMaxAmount = filters.maxAmount === null || 
        receipt.amount <= filters.maxAmount

      return matchesSearch && matchesType && matchesStatus && 
             matchesDateRange && matchesMinAmount && matchesMaxAmount
    })
  }, [])

  return useFilters({ initialFilters, filterFunction })
}

// Función auxiliar para verificar rangos de fechas
function checkDateRange(dateString: string, range: string): boolean {
  if (!dateString) return true
  
  const date = new Date(dateString)
  const now = new Date()
  
  switch (range) {
    case 'today':
      return date.toDateString() === now.toDateString()
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return date >= weekAgo
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return date >= monthAgo
    case 'year':
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      return date >= yearAgo
    default:
      return true
  }
} 