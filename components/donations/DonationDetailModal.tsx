"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Download, FileText, DollarSign, Calendar, CreditCard, User, MessageSquare } from "lucide-react"
import { Donation } from "@/types/donation"

interface DonationDetailModalProps {
  donation: Donation | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (donation: Donation) => void
  onEditStatus?: (donation: Donation) => void
}

export function DonationDetailModal({ 
  donation, 
  isOpen, 
  onClose, 
  onDownload, 
  onEditStatus 
}: DonationDetailModalProps) {
  if (!donation) return null

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      case "refunded": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "Completada"
      case "pending": return "Pendiente"
      case "failed": return "Fallida"
      case "refunded": return "Reembolsada"
      default: return status
    }
  }

  const getDonorName = () => {
    if (donation.is_anonymous) {
      return "Donante Anónimo"
    }
    if (donation.donor) {
      return `${donation.donor.first_name} ${donation.donor.last_name}`
    }
    return "Sin nombre"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Detalle de Donación</DialogTitle>
              <p className="text-gray-600 mt-1">ID: {donation.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <Badge className={getStatusColor(donation.status)}>
              {getStatusLabel(donation.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Donante */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {donation.is_anonymous ? "A" : getDonorName()[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-lg">{getDonorName()}</span>
                  {donation.donor?.is_verified && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      Verificado
                    </Badge>
                  )}
                </div>
                {!donation.is_anonymous && donation.donor && (
                  <div className="text-sm text-gray-600 mt-1">
                    <p>{donation.donor.email}</p>
                    {donation.donor.phone && <p>{donation.donor.phone}</p>}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la Transacción */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Detalles de la Transacción
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Fecha:</span>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="font-medium">{donation.date}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Método de Pago:</span>
                <div className="flex items-center mt-1">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="font-medium">{donation.payment_method.name}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Estado:</span>
                <div className="mt-1">
                  <Badge className={getStatusColor(donation.status)}>
                    {getStatusLabel(donation.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-gray-500">ID de Transacción:</span>
                <p className="font-medium font-mono text-blue-600 mt-1">
                  {donation.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje del Donante */}
          {donation.message && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Mensaje del Donante
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 italic">&ldquo;{donation.message}&rdquo;</p>
              </div>
            </div>
          )}

          {/* Información Técnica */}
          <div>
            <h4 className="font-semibold mb-3">Información Técnica</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID de Campaña:</span>
                  <p className="font-mono text-xs">{donation.campaign_id}</p>
                </div>
                <div>
                  <span className="text-gray-500">ID de Donante:</span>
                  <p className="font-mono text-xs">{donation.donor_id}</p>
                </div>
                {donation.created_at && (
                  <div>
                    <span className="text-gray-500">Creada:</span>
                    <p className="font-medium">
                      {new Date(donation.created_at).toLocaleString('es-AR')}
                    </p>
                  </div>
                )}
                {donation.updated_at && (
                  <div>
                    <span className="text-gray-500">Actualizada:</span>
                    <p className="font-medium">
                      {new Date(donation.updated_at).toLocaleString('es-AR')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {onEditStatus && (
              <Button variant="outline" onClick={() => onEditStatus(donation)}>
                <FileText className="h-4 w-4 mr-2" />
                Editar Estado
              </Button>
            )}
            {onDownload && (
              <Button variant="outline" onClick={() => onDownload(donation)}>
                <Download className="h-4 w-4 mr-2" />
                Descargar Recibo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}