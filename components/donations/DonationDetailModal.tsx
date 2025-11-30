"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileText, Calendar, CreditCard, User, MessageSquare, Loader2, FileCheck } from "lucide-react"
import { Donation, DonationStatus } from "@/types/donation"
import { downloadReceipt, isReceiptReady, isReceiptGenerating, getReceiptStatusMessage } from "@/lib/utils/receiptHelpers"

interface DonationDetailModalProps {
  donation: Donation | null
  isOpen: boolean
  onClose: () => void
  onStatusChange?: (donationId: string, newStatus: DonationStatus) => Promise<void>
}

export function DonationDetailModal({ 
  donation, 
  isOpen, 
  onClose, 
  onStatusChange
}: DonationDetailModalProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<DonationStatus | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<DonationStatus>(donation?.status || 'pending')
  
  // Update local status when donation prop changes
  useEffect(() => {
    if (donation) {
      setCurrentStatus(donation.status)
    }
  }, [donation?.status, donation?.id])
  
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

  const handleSelectChange = (newStatus: string) => {
    // Store pending status and show confirmation dialog
    setPendingStatus(newStatus as DonationStatus)
    setShowConfirmDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!onStatusChange || !pendingStatus) return
    
    setIsUpdatingStatus(true)
    setShowConfirmDialog(false)
    
    try {
      await onStatusChange(donation.id, pendingStatus)
      // Update local status on success
      setCurrentStatus(pendingStatus)
    } catch (error) {
      console.error('Error changing status:', error)
    } finally {
      setIsUpdatingStatus(false)
      setPendingStatus(null)
    }
  }

  const handleCancelStatusChange = () => {
    setPendingStatus(null)
    setShowConfirmDialog(false)
  }

  const handleDownloadReceipt = () => {
    if (donation.receipt_url) {
      downloadReceipt(donation.receipt_url, donation.id)
    }
  }

  const showReceiptSection = donation.status === 'completed'
  const receiptReady = isReceiptReady(donation)
  const receiptGenerating = isReceiptGenerating(donation)
  
  // Business rule: Only pending donations can change status
  const canEditStatus = donation.status === 'pending'

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

          {/* Cambio de Estado */}
          {onStatusChange && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Gestión de Estado
              </h4>
              
              {canEditStatus ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="text-sm text-gray-500 mb-2 block">
                        Estado de la Donación
                      </label>
                      <Select
                        value={currentStatus}
                        onValueChange={handleSelectChange}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="completed">Completada</SelectItem>
                          <SelectItem value="failed">Fallida</SelectItem>
                          <SelectItem value="refunded">Reembolsada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {isUpdatingStatus && (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Al cambiar el estado a "Completada", se generará automáticamente un comprobante digital.
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-amber-800 mb-1">Estado Bloqueado</h5>
                      <p className="text-sm text-amber-700">
                        El estado de esta donación no puede ser modificado porque ya fue procesada. 
                        Solo las donaciones con estado <strong>&quot;Pendiente&quot;</strong> pueden cambiar de estado.
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-l text-amber-600">Estado actual:</span>
                        <Badge className={getStatusColor(donation.status)}>
                          {getStatusLabel(donation.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comprobante de Donación */}
          {showReceiptSection && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <FileCheck className="h-4 w-4 mr-2" />
                Comprobante de Donación
              </h4>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                {receiptReady ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">Comprobante Disponible</p>
                      <p className="text-sm text-green-600 mt-1">
                        El comprobante digital está listo para descargar
                      </p>
                    </div>
                    <Button 
                      onClick={handleDownloadReceipt}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Comprobante
                    </Button>
                  </div>
                ) : receiptGenerating ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Generando Comprobante...</p>
                      <p className="text-sm text-green-600 mt-1">
                        Tu comprobante se está generando. Por favor, espera unos segundos y refresca esta página.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-gray-700">{getReceiptStatusMessage(donation)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cambio de Estado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de cambiar el estado de esta donación a <strong>&quot;{pendingStatus && getStatusLabel(pendingStatus)}&quot;</strong>?
              {pendingStatus === 'completed' && (
                <span className="block mt-2 text-green-600 font-medium">
                  Se generará automáticamente un comprobante digital para el donante.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelStatusChange}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusChange}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}