"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Heart,
} from "lucide-react"
import Link from "next/link"

import { useSummary } from "@/hooks/api/useSummary"
import { AdminRoute } from "@/components/auth/ProtectedRoute"
import { useCampaigns } from "@/hooks/api/campaigns/useCampaigns"
import { CampaignAdminList } from "@/components/campaign/CampaignAdminList"

export default function AdminDashboard() {
  const { summary, isLoading } = useSummary()
  const { campaigns, isLoading: campaignsLoading, error: campaignsError, refetch } = useCampaigns()


  return (
    <AdminRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Gestiona tus campañas y ve el progreso de tus donaciones</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin/campanas/crear">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Campaña
              </Button>
            </Link>
            
          </div>
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
          <CampaignAdminList
            campaigns={campaigns || []}
            isLoading={campaignsLoading}
            error={campaignsError}
            onRefetch={refetch}
            variant="dashboard"
            maxItems={3}
          />
        </CardContent>
      </Card>

     {/* Acciones Rápidas 
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
      */}
    </div>
    </AdminRoute>
  )
}
