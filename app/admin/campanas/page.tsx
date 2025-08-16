"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { AdminRoute } from "@/components/auth/ProtectedRoute"
import { useCampaigns } from "@/hooks/campaigns/useCampaigns"
import { CampaignAdminList } from "@/components/campaign/CampaignAdminList"

export default function AdminCampaignsPage() {
  const { allCampaigns: campaigns, isLoading, error, mutate: refetch } = useCampaigns()


  return (
    <AdminRoute>
      <div className="space-y-6">
        {/* Header */}
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
              <p className="text-gray-600 mt-1">Gestiona todas tus campañas de donación</p>
            </div>
          </div>
          <Link href="/admin/campanas/crear">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </Link>
        </div>

        {/* Campaign List with Filters */}
        <CampaignAdminList
          campaigns={campaigns || []}
          isLoading={isLoading}
          error={error}
          onRefetch={refetch}
          variant="detailed"
          showFilters={true}
        />

        {/* Resumen */}
        {campaigns && campaigns.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                  <p className="text-sm text-gray-600">Campañas Totales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ${campaigns.reduce((sum, c) => sum + (c.raised || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Recaudado</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {campaigns.reduce((sum, c) => sum + (c.donors || 0), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Donantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {campaigns.filter((c) => c.status === "active").length}
                  </p>
                  <p className="text-sm text-gray-600">Campañas Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminRoute>
  )
}
