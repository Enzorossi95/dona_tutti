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
  Heart,
  AlertCircle,
  TrendingUp,
  Clock,
  Target,
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "paused":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "completed":
        return "bg-sky-50 text-sky-700 border-sky-200"
      case "draft":
        return "bg-slate-50 text-slate-600 border-slate-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      case "paused":
        return <Pause className="w-3 h-3" />
      case "completed":
        return <Target className="w-3 h-3" />
      case "draft":
        return <Clock className="w-3 h-3" />
      default:
        return null
    }
  }

  const getUrgencyBadgeColor = (urgency: number) => {
    if (urgency >= 8) return "bg-red-50 text-red-700 border-red-200"
    if (urgency >= 5) return "bg-amber-50 text-amber-700 border-amber-200"
    return "bg-emerald-50 text-emerald-700 border-emerald-200"
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
            // Dashboard variant - formato compacto horizontal mejorado
            return (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-100">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* Imagen con overlay de urgencia */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={getSafeImageUrl(campaign.image)}
                        alt={campaign.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                      {campaign.urgency >= 8 && (
                        <div className="absolute top-2 left-2">
                          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                            URGENTE
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 mr-3">
                          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{campaign.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(campaign.status)} border text-xs flex items-center gap-1 px-2 py-0.5`}>
                              {getStatusIcon(campaign.status)}
                              {getStatusText(campaign.status)}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {getCategoryName(campaign.category)}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalle
                            </DropdownMenuItem>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <DollarSign className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                          <span className="font-medium text-gray-900">${(campaign.raised || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-blue-600" />
                          <span>{campaign.donors || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-amber-600" />
                          <span>{campaign.daysLeft && campaign.daysLeft > 0 ? `${campaign.daysLeft} días` : "Finalizada"}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          <span className="truncate">{campaign.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Objetivo: ${campaign.goal.toLocaleString()}</span>
                            <span className="text-xs font-semibold text-gray-900">{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        <Link href={`/admin/campanas/${campaign.id}`}>
                          <Button size="sm" variant="outline" className="hover:bg-gray-900 hover:text-white transition-colors">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ver
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          }

          // Detailed variant - formato compacto horizontal
          return (
            <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-all duration-200 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center">
                  {/* Imagen más pequeña */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                    <Image
                      src={getSafeImageUrl(campaign.image)}
                      alt={campaign.title}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Contenido principal */}
                  <div className="flex-1 p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Columna izquierda: Título y beneficiario */}
                      <div className="flex-1">
                        <div className="flex items-start md:items-center gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                              {campaign.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{campaign.beneficiary_name}</span>
                              {campaign.beneficiary_age && ` (${campaign.beneficiary_age} años)`}
                              <span className="text-gray-400 mx-2">•</span>
                              <span className="text-gray-500">{getCategoryName(campaign.category)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Badges de estado y urgencia */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`${getStatusColor(campaign.status)} border text-xs flex items-center gap-1 px-2 py-0.5`}>
                            {getStatusIcon(campaign.status)}
                            {getStatusText(campaign.status)}
                          </Badge>
                          {campaign.urgency >= 5 && (
                            <Badge className={`${getUrgencyBadgeColor(campaign.urgency)} border text-xs px-2 py-0.5`}>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgencia: {getUrgencyLevel(campaign.urgency)}
                            </Badge>
                          )}
                        </div>

                        {/* Métricas en línea */}
                        <div className="flex items-center gap-3 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="font-semibold text-gray-900">
                              ${(campaign.raised || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-500">/ ${campaign.goal.toLocaleString()}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-gray-700">{campaign.donors || 0} donantes</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-gray-700">
                              {campaign.daysLeft && campaign.daysLeft > 0 ? `${campaign.daysLeft} días` : "Finalizada"}
                            </span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            <span className="text-gray-700">{campaign.location}</span>
                          </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 min-w-[45px] text-right">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      </div>

                      {/* Columna derecha: Acciones */}
                      <div className="flex items-center gap-2 md:ml-4">
                        <Link href={`/admin/campanas/${campaign.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Ver Detalle
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              {campaign.status === "active" ? (
                                <>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pausar campaña
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-2" />
                                  Activar campaña
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