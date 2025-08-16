'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, DollarSign } from "lucide-react"
import Image from "next/image"
import { Receipt } from "@/types/receipt"

// Re-export for compatibility
export { Receipt }


export interface ReceiptListProps {
  receipts: Receipt[]
  onViewDetail?: (receipt: Receipt) => void
  onDownload?: (receipt: Receipt) => void
  showActions?: boolean
  variant?: 'admin' | 'public'
  className?: string
}

export function ReceiptList({
  receipts,
  onViewDetail,
  onDownload,
  showActions = true,
  variant = 'public',
  className = ""
}: ReceiptListProps) {
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

  const renderAdminView = (receipt: Receipt) => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Image
        src={receipt.image || "/placeholder.svg"}
        alt="Comprobante"
        width={60}
        height={60}
        className="w-15 h-15 object-cover rounded"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{receipt.type}</h4>
          <span className="font-bold text-green-600">${receipt.amount.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{receipt.description}</p>
        <p className="text-xs text-gray-500">
          {receipt.vendor} • {receipt.date}
        </p>
      </div>
      {showActions && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetail?.(receipt)}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownload?.(receipt)}>
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
        </div>
      )}
    </div>
  )

  const renderPublicView = (receipt: Receipt) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4 flex-1">
            <Image
              src={receipt.image || "/placeholder.svg"}
              alt="Comprobante"
              width={120}
              height={140}
              className="w-24 h-28 object-cover rounded border"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{receipt.type}</h3>
                  <p className="text-gray-600 text-sm">{receipt.description}</p>
                </div>
                <Badge className={getStatusColor(receipt.status)}>{receipt.status}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
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
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer">{receipt.document}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-xl font-bold text-green-600">${receipt.amount.toLocaleString()}</span>
                </div>

                {showActions && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail?.(receipt)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalle
                    </Button>
                    {variant === 'admin' && onDownload && (
                      <Button variant="outline" size="sm" onClick={() => onDownload(receipt)}>
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (receipts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <p>No hay comprobantes registrados aún</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {receipts.map((receipt) => (
        <div key={receipt.id}>
          {variant === 'admin' ? renderAdminView(receipt) : renderPublicView(receipt)}
        </div>
      ))}
    </div>
  )
} 