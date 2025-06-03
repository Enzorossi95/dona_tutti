'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

export interface FilterConfig {
  name: string
  value: string
  onChange: (value: string) => void
  config: {
    name: string
    placeholder: string
    options?: Array<{ value: string; label: string }>
  }
}

export interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters: FilterConfig[]
  resultsCount?: number
  className?: string
  onResetFilters?: () => void
}

export function FilterBar({
  searchValue,
  onSearchChange,
  filters,
  resultsCount,
  className = "",
  onResetFilters
}: FilterBarProps) {
  const hasActiveFilters = searchValue !== '' || filters.some(filter => 
    filter.value !== 'all' && filter.value !== ''
  )

  return (
    <Card className={`mb-6 ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros dinámicos */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <div key={filter.name} className="min-w-[150px]">
                {filter.config.options ? (
                  <Select value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={filter.config.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {filter.config.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={filter.config.placeholder}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                  />
                )}
              </div>
            ))}

            {/* Botón para limpiar filtros */}
            {hasActiveFilters && onResetFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onResetFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        {resultsCount !== undefined && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                {resultsCount} resultado{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            {hasActiveFilters && (
              <div className="text-xs text-gray-500">
                Filtros activos aplicados
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}