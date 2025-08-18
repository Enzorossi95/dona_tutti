'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, DollarSign, FileText } from "lucide-react"
import { Receipt } from "@/types/receipt"

interface ReceiptDetailProps {
  receipt: Receipt | null
  isOpen: boolean
  onClose: () => void
}

export function ReceiptDetail({ receipt, isOpen, onClose }: ReceiptDetailProps) {
  if (!receipt) return null

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pagado":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "rechazado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Detalle del Comprobante</DialogTitle>
            {/*<Badge className={getStatusColor(receipt.status)}>
              {receipt.status}
            </Badge>*/}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagen del comprobante */}
          {/*
          {receipt.image && (
            <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={receipt.image}
                alt="Comprobante"
                fill
                className="object-contain"
              />
            </div>
          )}
          */}
          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Fecha</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{receipt.date}</span>
                </div>
              </div>
              {/*
              <div>
                <p className="text-sm text-gray-500 mb-1">Tipo de Gasto</p>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">{receipt.type}</span>
                </div>
              </div>
              */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Proveedor</p>
                <span className="font-medium">{receipt.provider}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monto Total</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(receipt.total)}
                  </span>
                </div>
              </div>

              {/*
              {receipt.document && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Documento</p>
                  <span className="font-medium text-blue-600">{receipt.document}</span>
                </div>
              )}
              */}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Descripción</p>
            <p className="text-gray-700">{receipt.description}</p>
          </div>

          {/* Desglose si existe */}
          {/*
          {receipt.breakdown && receipt.breakdown.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Desglose de Gastos</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {receipt.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.item}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(receipt.amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          */}
          {/* Notas adicionales */}
          {receipt.note && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Notas Adicionales</p>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{receipt.note}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}