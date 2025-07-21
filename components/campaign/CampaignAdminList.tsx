"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Eye,
  Edit,
  Pause,
  Play,
  MoreHorizontal,
  MapPin,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Campaign } from "@/types/campaign"
import { getCategoryName, getUrgencyLevel, getUrgencyColor } from "@/lib/utils/categoryMapping"

interface CampaignAdminListProps {
  campaigns: Campaign[]
  isLoading: boolean
  error?: Error | null
  onRefetch?: () => void
  variant?: "dashboard" | "detailed"
  showFilters?: boolean
  showHeader?: boolean
  maxItems?: number
}

export function CampaignAdminList({
  campaigns = [],
  isLoading,
  error,
  onRefetch,
  variant = "detailed",
  showFilters = false,
  showHeader = false,
  maxItems
}: CampaignAdminListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Helper function to safely handle image URLs
  const getSafeImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return "/placeholder.svg"
    
    // If it's a relative path, use it as is
    if (imageUrl.startsWith("/")) return imageUrl
    
    // For external URLs, validate they're proper URLs
    try {
      new URL(imageUrl)
      return imageUrl
    } catch {
      console.warn(`Invalid image URL: ${imageUrl}, using placeholder`)
      return "/placeholder.svg"
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus
    const categoryName = getCategoryName(campaign.category)
    const matchesCategory = filterCategory === "all" || categoryName.toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Apply maxItems limit if specified
  const displayCampaigns = maxItems ? filteredCampaigns.slice(0, maxItems) : filteredCampaigns

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activa"
      case "paused":
        return "Pausada"
      case "completed":
        return "Completada"
      case "draft":
        return "Borrador"
      default:
        return status
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {showHeader && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Mis Campañas</h2>
            <p className="text-gray-600">Cargando campañas...</p>
          </div>
        )}
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className={variant === "dashboard" ? "h-16 bg-gray-200 rounded" : "h-24 bg-gray-200 rounded mb-4"}></div>
                {variant === "detailed" && (
                  <>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">No se pudieron cargar las campañas</p>
          {onRefetch && (
            <Button onClick={onRefetch} variant="outline">
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Mis Campañas</h2>
          <p className="text-gray-600">Gestiona todas tus campañas de donación</p>
        </div>
      )}

      {/* Filtros y Búsqueda - Solo para variant detailed */}
      {showFilters && variant === "detailed" && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar campañas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="paused">Pausadas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="médico">Médico</SelectItem>
                  <SelectItem value="refugio">Refugio</SelectItem>
                  <SelectItem value="alimentación">Alimentación</SelectItem>
                  <SelectItem value="rescate">Rescate</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                <span>
                  {filteredCampaigns.length} campaña{filteredCampaigns.length !== 1 ? "s" : ""} encontrada
                  {filteredCampaigns.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Campañas */}
      <div className="space-y-4">
        {displayCampaigns.map((campaign) => {
          const progressPercentage = ((campaign.raised || 0) / campaign.goal) * 100

          if (variant === "dashboard") {
            // Dashboard variant - formato compacto horizontal
            return (
              <div key={campaign.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <Image
                  src={getSafeImageUrl(campaign.image)}
                  alt={campaign.title}
                  width={80}
                  height={60}
                  className="w-20 h-15 object-cover rounded"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{campaign.title}</h3>
                    <Badge className={getStatusColor(campaign.status)}>{getStatusText(campaign.status)}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />${(campaign.raised || 0).toLocaleString()} / $
                      {campaign.goal.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {campaign.donors || 0} donantes
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {campaign.daysLeft && campaign.daysLeft > 0 ? `${campaign.daysLeft} días` : "Finalizada"}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {campaign.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}% del objetivo</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/campanas/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {campaign.status === "active" ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver en sitio público
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // Detailed variant - formato extendido vertical
          return (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Image
                    src={getSafeImageUrl(campaign.image)}
                    alt={campaign.title}
                    width={120}
                    height={90}
                    className="w-30 h-24 object-cover rounded"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-lg text-gray-900">{campaign.title}</h3>
                        <Badge className={getStatusColor(campaign.status)}>{getStatusText(campaign.status)}</Badge>
                        <Badge className={getUrgencyColor(campaign.urgency)}>
                          {getUrgencyLevel(campaign.urgency)} ({campaign.urgency}/10)
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {campaign.status === "active" ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver en sitio público
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Beneficiary Information */}
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-900 mb-1">Beneficiario</h4>
                      <p className="text-sm text-blue-800">
                        {campaign.beneficiary_name}
                        {campaign.beneficiary_age && ` (${campaign.beneficiary_age} años)`}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">Categoría: {getCategoryName(campaign.category)}</p>
                    </div>

                    {/* Current Situation */}
                    <div className="mb-3 p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-yellow-900 mb-1">Situación Actual</h4>
                      <p className="text-xs text-yellow-800">{campaign.current_situation}</p>
                      <p className="text-xs text-yellow-700 mt-1"><strong>Urgencia:</strong> {campaign.urgency_reason}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />${(campaign.raised || 0).toLocaleString()} / $
                        {campaign.goal.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {campaign.donors || 0} donantes
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {campaign.daysLeft && campaign.daysLeft > 0 ? `${campaign.daysLeft} días` : "Finalizada"}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {campaign.location}
                      </div>
                      <div className="text-xs text-gray-500">Creada: {new Date(campaign.created_at).toLocaleDateString('es-AR')}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-6">
                        <Progress value={progressPercentage} className="h-2 mb-1" />
                        <p className="text-xs text-gray-500">{Math.round(progressPercentage)}% del objetivo</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/campanas/${campaign.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalle
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty state */}
      {displayCampaigns.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No se encontraron campañas</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}