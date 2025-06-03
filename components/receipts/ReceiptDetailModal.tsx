"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText } from "lucide-react"
import Image from "next/image"
import { Receipt } from "@/types/receipt"

interface ReceiptDetailModalProps {
  receipt: Receipt | null
  isOpen: boolean
  onClose: () => void
  onDownload?: (receipt: Receipt) => void
  onViewOriginal?: (receipt: Receipt) => void
}

export function ReceiptDetailModal({ 
  receipt, 
  isOpen, 
  onClose, 
  onDownload, 
  onViewOriginal 
}: ReceiptDetailModalProps) {
  if (!receipt) return null

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pagado": return "bg-green-100 text-green-800"
      case "pendiente": return "bg-yellow-100 text-yellow-800"
      case "rechazado": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{receipt.type}</DialogTitle>
              <p className="text-gray-600 mt-1">{receipt.description}</p>
            </div>
            <Badge className={getStatusColor(receipt.status)}>{receipt.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Fecha:</span>
              <p className="font-medium">{receipt.date}</p>
            </div>
            <div>
              <span className="text-gray-500">Proveedor:</span>
              <p className="font-medium">{receipt.vendor}</p>
            </div>
            <div>
              <span className="text-gray-500">Documento:</span>
              <p className="font-medium text-blue-600">{receipt.document}</p>
            </div>
            <div>
              <span className="text-gray-500">Total:</span>
              <p className="font-bold text-green-600 text-lg">${receipt.amount.toLocaleString()}</p>
            </div>
          </div>

          {/* Imagen del Comprobante */}
          <div>
            <h4 className="font-semibold mb-3">Comprobante</h4>
            <Image
              src={receipt.image || "/placeholder.svg"}
              alt="Comprobante completo"
              width={600}
              height={400}
              className="w-full max-w-md h-auto object-cover rounded-lg border mx-auto"
            />
          </div>

          {/* Desglose Detallado */}
          {receipt.breakdown && (
            <div>
              <h4 className="font-semibold mb-3">Desglose Detallado</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {receipt.breakdown.map((item: any, idx: any) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <span className="text-gray-700">{item.item}</span>
                      <span className="font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">${receipt.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notas Adicionales */}
          {receipt.notes && (
            <div>
              <h4 className="font-semibold mb-3">Notas</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">{receipt.notes}</p>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onDownload?.(receipt)}>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" onClick={() => onViewOriginal?.(receipt)}>
              <FileText className="h-4 w-4 mr-2" />
              Ver Original
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}