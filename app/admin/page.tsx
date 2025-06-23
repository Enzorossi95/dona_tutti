"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Pause,
  Play,
  MoreHorizontal,
  MapPin,
  Heart,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"

import { useSummary } from "@/hooks/api/useSummary"

export default function AdminDashboard() {
  const { summary, isLoading, isError } = useSummary()

  const campaigns = [
    {
      id: "1",
      title: "Ayuda a Luna - Cirugía de Emergencia",
      status: "active",
      goal: 150000,
      raised: 89500,
      donors: 47,
      daysLeft: 12,
      image: "/placeholder.svg?height=300&width=400",
      location: "Buenos Aires, Argentina",
      category: "Médico",
      createdAt: "2024-01-05",
      lastUpdate: "2024-01-15",
    },
    {
      id: "2",
      title: "Rescate de Max - Refugio Temporal",
      status: "active",
      goal: 75000,
      raised: 45000,
      donors: 23,
      daysLeft: 18,
      image: "/placeholder.svg?height=300&width=400",
      location: "Córdoba, Argentina",
      category: "Refugio",
      createdAt: "2024-01-10",
      lastUpdate: "2024-01-14",
    },
    {
      id: "3",
      title: "Alimentación para 50 Gatos Callejeros",
      status: "completed",
      goal: 120000,
      raised: 120000,
      donors: 156,
      daysLeft: 0,
      image: "/placeholder.svg?height=300&width=400",
      location: "Rosario, Argentina",
      category: "Alimentación",
      createdAt: "2023-12-01",
      lastUpdate: "2024-01-01",
    },
  ]

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Gestiona tus campañas y ve el progreso de tus donaciones</p>
        </div>
        <Link href="/admin/campanas/crear">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Campañas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : summary?.totalCampaigns || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                {isLoading ? "..." : summary?.activeCampaigns || 0} activas
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recaudado</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${isLoading ? "..." : (summary?.totalRaised || 0).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">
                +${isLoading ? "..." : (summary?.thisMonthRaised || 0).toLocaleString()} este mes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? "..." : summary?.totalDonors || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-purple-600">
                +{isLoading ? "..." : summary?.thisMonthDonors || 0} este mes
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Éxito</p>
                <p className="text-2xl font-bold text-gray-900">67%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-orange-600">+5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mis Campañas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mis Campañas</CardTitle>
            <Link href="/admin/campanas">
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const progressPercentage = (campaign.raised / campaign.goal) * 100

              return (
                <div key={campaign.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                  <Image
                    src={campaign.image || "/placeholder.svg"}
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
            })}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nueva Campaña</h3>
            <p className="text-sm text-gray-600 mb-4">Crea una nueva campaña para ayudar a más animales</p>
            <Link href="/admin/campanas/crear">
              <Button className="w-full">Crear Campaña</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ver Estadísticas</h3>
            <p className="text-sm text-gray-600 mb-4">Analiza el rendimiento de tus campañas</p>
            <Button variant="outline" className="w-full">
              Ver Reportes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gestionar Perfil</h3>
            <p className="text-sm text-gray-600 mb-4">Actualiza tu información y configuración</p>
            <Link href="/admin/perfil">
              <Button variant="outline" className="w-full">
                Mi Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
