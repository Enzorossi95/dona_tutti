"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Share2,
  Users,
  Calendar,
  MapPin,
  ExternalLink,
  AlertCircle,
  Plus,
  FileText,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Receipt, ReceiptList } from "@/components/receipts/ReceiptList"
import { ReceiptDetail } from "@/components/receipts/ReceiptDetail"
import { ReceiptForm } from "@/components/receipts/ReceiptForm"
import { Donation, DonationList } from "@/components/donations/DonationList"
import { DonationDetailModal } from "@/components/donations/DonationDetailModal"
import { DonationForm } from "@/components/donations/DonationForm"
import { CampaignActivitiesTab } from "@/components/campaign/CampaignActivitiesTab"
import { useCampaignPublicReceipts } from "@/hooks/campaigns/useCampaignPublicReceipts"
import { useCampaign } from "@/hooks/campaigns/useCampaign"
import { useCampaignDonations } from "@/hooks/campaigns/useCampaignDonations"
import { useDonationStatus } from "@/hooks/campaigns/useDonationStatus"
import { shouldShowContractButton } from "@/lib/utils/contractHelpers"
import { DonationStatus } from "@/types/donation"
import { toast } from "sonner"

export default function AdminCampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [showCreateReceiptForm, setShowCreateReceiptForm] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [showCreateDonationForm, setShowCreateDonationForm] = useState(false)
  
  // Fetch campaign data from backend
  const { campaign, isLoading: campaignLoading, error: campaignError } = useCampaign(campaignId)
  const { donations, isLoading: donationsLoading, mutate: mutateDonations } = useCampaignDonations(campaignId)
  
  // Fetch receipts from backend
  const { receipts, mutate: mutateReceipts } = useCampaignPublicReceipts(campaignId)

  // Donation status management
  const { updateStatus } = useDonationStatus()
  
  const progressPercentage = campaign ? (campaign.raised / campaign.goal) * 100 : 0

  // Handle viewing donation detail - always fetch fresh data
  const handleViewDonationDetail = (donation: Donation) => {
    // Always get the latest version from the donations array
    const freshDonation = donations.find(d => d.id === donation.id) || donation
    setSelectedDonation(freshDonation)
  }

  // Handle donation status change
  const handleDonationStatusChange = async (donationId: string, newStatus: DonationStatus) => {
    try {
      // Get the updated donation from API (includes receipt_url if generated)
      const updatedDonation = await updateStatus({ campaignId, donationId, status: newStatus })
      
      // Optimistically update the cache with the new donation data
      mutateDonations(
        donations.map(d => d.id === donationId ? updatedDonation : d),
        false // Don't revalidate immediately
      )
      
      // Update selected donation if the modal is open
      if (selectedDonation && selectedDonation.id === donationId) {
        setSelectedDonation(updatedDonation)
      }
      
      // Show success message
      toast.success(`Estado actualizado a: ${newStatus}`)
      if (newStatus === 'completed' && updatedDonation.receipt_url) {
        toast.success('Comprobante generado exitosamente')
      }
      
      // Revalidate in background
      mutateDonations()
    } catch (error) {
      console.error('Error updating donation status:', error)
      toast.error('Error al actualizar el estado de la donación')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Loading state
  if (campaignLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando campaña...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (campaignError || !campaign) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar la campaña</h2>
          <p className="text-gray-600 mb-4">
            {campaignError?.message || "No se pudo encontrar la campaña"}
          </p>
          <Link href="/admin">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible'
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
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
            <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status === "active" ? "Activa" : campaign.status}
              </Badge>
              <span className="text-sm text-gray-500">
                Creada el {formatDate(campaign.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/campanas/${campaign.id}`}>
            <Button variant="orange" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Público
            </Button>
          </Link>
          <Button variant="orange" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="orange" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Contract Banner - Show for draft and pending_approval campaigns */}
      {shouldShowContractButton(campaign) && (
        <Card className="border-yellow-400 bg-yellow-50">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 text-lg mb-1">
                  {campaign.status === 'draft' 
                    ? 'Acción Requerida: Firma del Contrato Legal'
                    : 'Contrato Pendiente de Aprobación'
                  }
                </h3>
                <p className="text-sm text-yellow-800 mb-3">
                  {campaign.status === 'draft'
                    ? 'Para que tu campaña pueda ser publicada, necesitas firmar el contrato legal. Este proceso es rápido y seguro.'
                    : 'Tu contrato ha sido firmado y está pendiente de aprobación por parte del equipo de DonaAyuda. Recibirás una notificación cuando sea aprobado.'
                  }
                </p>
                {campaign.status === 'draft' && (
                  <Link href={`/admin/campanas/${campaign.id}/contrato`}>
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Firmar Contrato Ahora
                    </Button>
                  </Link>
                )}
                {campaign.status === 'pending_approval' && (
                  <Link href={`/admin/campanas/${campaign.id}/contrato`}>
                    <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Contrato Firmado
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Contenido Principal */}
        <div className="xl:col-span-3">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="donations">Donaciones</TabsTrigger>
              <TabsTrigger value="receipts">Comprobantes</TabsTrigger>
              <TabsTrigger value="updates">Actividades</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            {/* Tab: Resumen */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  {/* Main Image */}
                  {campaign.image && (
                    <div className="mb-6">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        width={800}
                        height={400}
                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Información del Beneficiario */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Sobre el Beneficiario</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Nombre:</span>
                        <p className="font-medium">{campaign.beneficiary_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{campaign.beneficiary_type}</p>
                      </div>
                      {campaign.beneficiary_count && (
                        <div>
                          <span className="text-gray-500">Cantidad de beneficiarios:</span>
                          <p className="font-medium">{campaign.beneficiary_count}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Descripción de la Campaña</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {campaign.description}
                    </p>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Fecha de inicio:</span>
                      <p className="font-medium">{formatDate(campaign.start_date)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Fecha de finalización:</span>
                      <p className="font-medium">{formatDate(campaign.end_date)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Urgencia:</span>
                      <p className="font-medium">{campaign.urgency}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Donaciones */}
            <TabsContent value="donations" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Lista de Donaciones ({donations.length})
                      {donationsLoading && (
                        <span className="ml-2 text-sm text-gray-500">Cargando...</span>
                      )}
                    </CardTitle>
                    <Button
                      onClick={() => setShowCreateDonationForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Crear Donación</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <DonationList 
                    donations={donations}
                    variant="admin"
                    onViewDetail={handleViewDonationDetail}
                    showActions={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Comprobantes */}
            <TabsContent value="receipts" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Comprobantes de Gastos ({receipts.length})
                    </CardTitle>
                    <Button
                      onClick={() => setShowCreateReceiptForm(true)}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Crear Comprobante</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ReceiptList 
                    receipts={receipts}
                    variant="admin"
                    onViewDetail={setSelectedReceipt}
                    showActions={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Actividades */}
            <TabsContent value="updates" className="space-y-6">
              <CampaignActivitiesTab campaignId={campaign.id} />
            </TabsContent>

            {/* Tab: Configuración */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Campaña</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Estado de la Campaña</h4>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline">Pausar Campaña</Button>
                      <Button variant="outline">Marcar como Completada</Button>
                      <Button variant="destructive">Eliminar Campaña</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Configuración de Donaciones</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Permitir donaciones anónimas</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mostrar lista de donantes</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Permitir comentarios</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar de Donación */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {/* Progreso de Donación */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${campaign.raised.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    de ${campaign.goal.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">
                  {Math.round(progressPercentage)}% del objetivo alcanzado
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="font-bold text-lg">{campaign.donors}</span>
                  </div>
                  <p className="text-xs text-gray-500">Donantes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="font-bold text-lg">{campaign.daysLeft}</span>
                  </div>
                  <p className="text-xs text-gray-500">Días restantes</p>
                </div>
              </div>

              {/* Información del Organizador */}
              {campaign.organizer && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Organizado por</h4>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={campaign.organizer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {campaign.organizer.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-sm">{campaign.organizer.name}</span>
                        {campaign.organizer.verified && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {campaign.location}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Campaña
              </Button>
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Campaña
              </Button>
              <Link href={`/campanas/${campaign.id}`}>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver en Sitio Público
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Modal de Detalle del Comprobante */}
      <ReceiptDetail
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Modal de Crear Comprobante */}
      <ReceiptForm
        isOpen={showCreateReceiptForm}
        onClose={() => setShowCreateReceiptForm(false)}
        campaignId={campaignId}
        onSuccess={() => {
          mutateReceipts() // Refrescar lista de comprobantes
          setShowCreateReceiptForm(false)
        }}
      />

      {/* Modal de Detalle de Donación */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onStatusChange={handleDonationStatusChange}
      />

      {/* Modal de Crear Donación */}
      <DonationForm
        isOpen={showCreateDonationForm}
        onClose={() => setShowCreateDonationForm(false)}
        campaignId={campaignId}
        onSuccess={() => {
          mutateDonations() // Refrescar lista de donaciones
          setShowCreateDonationForm(false)
        }}
      />
    </div>
  )
}