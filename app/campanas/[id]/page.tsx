"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Share2, Calendar, MapPin, DollarSign, Users, MessageCircle, Camera, FileText, Eye } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCampaign } from "@/hooks/campaigns/useCampaign"
import { useCampaignActivities } from "@/hooks/campaigns/useCampaignActivities"
import { useCampaignPublicReceipts } from "@/hooks/campaigns/useCampaignPublicReceipts"
import { useAuditReport } from "@/hooks/campaigns/useAuditReport"
import { formatCurrency, formatPercentage } from "@/lib/utils/formatters"
import EmptyState from "@/components/shared/EmptyState"
import { ClosedCampaignBanner } from "@/components/campaign/ClosedCampaignBanner"
import { AuditReportSection } from "@/components/campaign/AuditReportSection"

export default function CampaignPage() {
  const params = useParams()
  const campaignId = params.id as string
  
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null)

  // Fetch data from backend
  const { campaign, isLoading: campaignLoading, error: campaignError } = useCampaign(campaignId)
  const { activities, isLoading: activitiesLoading } = useCampaignActivities(campaignId)
  const { receipts, totalSpent } = useCampaignPublicReceipts(campaignId)

  // Fetch audit report only if campaign is completed
  const { auditReport } = useAuditReport(
    campaign?.status === 'completed' ? campaignId : undefined
  )

  // Determine if campaign is closed
  const isCampaignClosed = campaign?.status === 'completed'

  // Loading state
  if (campaignLoading || activitiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando campaña...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state or campaign not found
  if (campaignError || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <EmptyState 
            title="Campaña no encontrada" 
            description={campaignError?.message || "La campaña que buscas no existe o ha sido eliminada."} 
          />
        </div>
      </div>
    )
  }

  const progressPercentage = campaign ? formatPercentage(campaign.raised, campaign.goal) : 0

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case "medical":
        return <FileText className="h-4 w-4" />
      case "expense":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  const getUpdateBadgeColor = (type: string) => {
    switch (type) {
      case "medical":
        return "bg-blue-100 text-blue-800"
      case "expense":
        return "bg-green-100 text-green-800"
      default:
        return "bg-purple-100 text-purple-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Campaña Cerrada */}
        {isCampaignClosed && (
          <ClosedCampaignBanner closedAt={auditReport?.closed_at} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Principal */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Urgente
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>

                {/* Galería de Imágenes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <Image
                      src={campaign.image || "/placeholder.svg"}
                      alt={campaign.title || "Campaña"}
                      width={600}
                      height={400}
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Información del Beneficiario */}
                {campaign.beneficiary_name && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Sobre el Beneficiario</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Nombre:</span>
                        <p className="font-medium">{campaign.beneficiary_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{campaign.beneficiary_type || "Animal"}</p>
                      </div>
                      {campaign.beneficiary_count && (
                        <div>
                          <span className="text-gray-500">Cantidad:</span>
                          <p className="font-medium">{campaign.beneficiary_count}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Historia del Caso</h3>
                  <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Feed de Actualizaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Actualizaciones de la Campaña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No hay actualizaciones disponibles aún</p>
                  </div>
                ) : (
                  activities.map((update) => (
                  <div key={update.id} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getUpdateBadgeColor(update.type)}>
                          {getUpdateIcon(update.type)}
                          <span className="ml-1 capitalize">{update.type}</span>
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(update.date).toLocaleDateString('es-AR')} - {new Date(update.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUpdate(update)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalle
                      </Button>
                    </div>
                    <h4
                      className="font-semibold mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() => setSelectedUpdate(update)}
                    >
                      {update.title}
                    </h4>
                    <p className="text-gray-700 mb-3">{update.description}</p>
                    <p className="text-sm text-gray-500">Por: {update.author}</p>
                  </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sección de Comentarios */}
            {/* Sección de Comentarios - Próximamente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mensajes de Apoyo</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Próximamente
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Mensajes de Apoyo</h3>
                  <p className="text-gray-500 mb-4">
                    Pronto podrás dejar mensajes de apoyo y leer los comentarios de otros donantes.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">🚧 Esta funcionalidad está en desarrollo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isCampaignClosed ? (
              /* Reporte de Auditoría para Campañas Cerradas */
              <AuditReportSection campaignId={campaignId} />
            ) : (
              /* Sidebar de Donación para Campañas Activas */
              <>
                <Card>
                  <CardContent className="p-6">
                    {/* Progreso de Donación */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">{formatCurrency(campaign.raised)}</span>
                        <span className="text-sm text-gray-500">de {formatCurrency(campaign.goal)}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600">{progressPercentage}% del objetivo alcanzado</p>
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

                    {/* Botón de Donación */}
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white mb-4" size="lg">
                      <Heart className="h-4 w-4 mr-2" />
                      Donar Ahora
                    </Button>

                    {/* Información del Organizador */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Organizado por</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={campaign.organizer?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{campaign.organizer?.name?.[0] || "O"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium text-sm">{campaign.organizer?.name || "Organizador"}</span>
                            {campaign.organizer?.verified && (
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

                    {/* Métodos de Pago */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold mb-3 text-sm">Métodos de pago seguros</h4>
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">MercadoPago</div>
                        <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Tarjetas</div>
                        <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Transferencia</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transparencia - No sticky para que sea visible */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Transparencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {receipts.slice(0, 3).map((receipt) => (
                        <div key={receipt.id} className="flex justify-between text-sm">
                          <span>{receipt.type}</span>
                          <span className="font-medium">{formatCurrency(receipt.total)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total gastado</span>
                        <span>{formatCurrency(totalSpent)}</span>
                      </div>
                      <Link href={`/campanas/${campaign.id}/comprobantes`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Comprobantes ({receipts.length})
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Modal de Detalle de Actualización */}
        {selectedUpdate && (
          <Dialog open={!!selectedUpdate} onOpenChange={() => setSelectedUpdate(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getUpdateBadgeColor(selectedUpdate.type)}>
                      {getUpdateIcon(selectedUpdate.type)}
                      <span className="ml-1 capitalize">{selectedUpdate.type}</span>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedUpdate.date).toLocaleDateString('es-AR')} - {new Date(selectedUpdate.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <DialogTitle className="text-xl">{selectedUpdate.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Contenido completo */}
                <div>
                  <p className="text-gray-700 leading-relaxed">{selectedUpdate.description}</p>
                </div>


                {/* Información adicional */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Publicado por: {selectedUpdate.author}</span>
                    {selectedUpdate.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedUpdate.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}
