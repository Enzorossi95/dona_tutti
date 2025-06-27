/**
 * EXAMPLE: Página de admin protegida con autenticación
 * 
 * Este es un ejemplo de cómo proteger las páginas de admin existentes
 * con autenticación y autorización por roles.
 */

"use client"

import { AdminRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/lib/auth/authContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
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
  ArrowLeft,
  LogOut,
  User
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { campaigns } from "@/lib/data/campaigns"

export default function ProtectedAdminCampaignsPage() {
  const { user, logout, hasRole } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus
    const matchesCategory = filterCategory === "all" || campaign.category.toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesStatus && matchesCategory
  })

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

  return (
    <AdminRoute>
      <div className="space-y-6">
        {/* Header con información del usuario */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Campañas</h1>
              <p className="text-gray-600 mt-1">
                Gestiona todas tus campañas de donación
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Información del usuario logueado */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.firstName || user?.username}</span>
              <Badge variant="outline">{user?.role?.name}</Badge>
            </div>
            
            {/* Solo admins pueden crear campañas */}
            {hasRole('admin') && (
              <Link href="/admin/campanas/crear">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </Link>
            )}
            
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Mensaje informativo para diferentes roles */}
        {!hasRole('admin') && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <span>⚠️</span>
                <span>
                  Estás viendo las campañas en modo de solo lectura. 
                  Solo los administradores pueden crear y editar campañas.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resto del contenido igual que la página original */}
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

        {/* Lista de Campañas con botones condicionados por permisos */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => {
            const progressPercentage = (campaign.raised / campaign.goal) * 100

            return (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={campaign.image || "/placeholder.svg"}
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
                        </div>
                        
                        {/* Solo admins pueden editar */}
                        {hasRole('admin') && (
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
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />${campaign.raised.toLocaleString()} / $
                          {campaign.goal.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {campaign.donors} donantes
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {campaign.daysLeft > 0 ? `${campaign.daysLeft} días` : "Finalizada"}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {campaign.location}
                        </div>
                        <div className="text-xs text-gray-500">Última actualización: {campaign.lastUpdate}</div>
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
                          
                          {/* Solo admins pueden editar */}
                          {hasRole('admin') && (
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Resumen */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{filteredCampaigns.length}</p>
                <p className="text-sm text-gray-600">Campañas Totales</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${filteredCampaigns.reduce((sum, c) => sum + c.raised, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Recaudado</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {filteredCampaigns.reduce((sum, c) => sum + c.donors, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Donantes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {filteredCampaigns.filter((c) => c.status === "active").length}
                </p>
                <p className="text-sm text-gray-600">Campañas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  )
}