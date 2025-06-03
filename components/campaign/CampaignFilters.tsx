"use client"

import { CampaignFilters as CampaignFiltersType } from "@/types/campaign"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface CampaignFiltersProps {
  filters: CampaignFiltersType
  onFiltersChange: (filters: CampaignFiltersType) => void
  resultsCount: number
}

export function CampaignFilters({ filters, onFiltersChange, resultsCount }: CampaignFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchTerm: value
    })
  }

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category: value
    })
  }

  const handleUrgencyChange = (value: string) => {
    onFiltersChange({
      ...filters,
      urgency: value
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: '',
      category: 'all',
      urgency: 'all',
      status: 'all'
    })
  }

  const hasActiveFilters = 
    filters.searchTerm !== '' || 
    filters.category !== 'all' || 
    filters.urgency !== 'all' || 
    filters.status !== 'all'

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Filtrar Campañas</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar campañas..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categoría */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="médico">Médico</SelectItem>
            <SelectItem value="refugio">Refugio</SelectItem>
            <SelectItem value="alimentación">Alimentación</SelectItem>
            <SelectItem value="rescate">Rescate</SelectItem>
          </SelectContent>
        </Select>

        {/* Urgencia */}
        <Select value={filters.urgency || 'all'} onValueChange={handleUrgencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las urgencias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las urgencias</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>

        {/* Estado */}
        <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="paused">Pausadas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resultados */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {resultsCount === 1 
            ? `${resultsCount} campaña encontrada`
            : `${resultsCount} campañas encontradas`
          }
        </span>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span>Filtros activos:</span>
            <div className="flex gap-1">
              {filters.searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  "{filters.searchTerm}"
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  {filters.category}
                </span>
              )}
              {filters.urgency && filters.urgency !== 'all' && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  {filters.urgency}
                </span>
              )}
              {filters.status && filters.status !== 'all' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {filters.status}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 