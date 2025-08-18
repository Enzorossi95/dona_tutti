'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, DollarSign, Calendar } from "lucide-react"
import { Donation } from "@/types/donation"

// Re-export for compatibility
export type { Donation }

export interface DonationListProps {
  donations: Donation[]
  onViewDetail?: (donation: Donation) => void
  showActions?: boolean
  variant?: 'admin' | 'public'
  className?: string
}

export function DonationList({
  donations,
  onViewDetail,
  showActions = true,
  variant = 'public',
  className = ""
}: DonationListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "Completada"
      case "pending":
        return "Pendiente"
      case "failed":
        return "Fallida"
      case "refunded":
        return "Reembolsada"
      default:
        return status
    }
  }

  const getDonorName = (donation: Donation) => {
    if (donation.is_anonymous) {
      return "Donante Anónimo"
    }
    if (donation.donor) {
      return `${donation.donor.first_name} ${donation.donor.last_name}`
    }
    return "Sin nombre"
  }

  const renderAdminView = (donation: Donation) => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <Avatar>
        <AvatarFallback>
          {donation.is_anonymous ? "A" : getDonorName(donation)[0]}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">{getDonorName(donation)}</h4>
            <p className="text-xs text-gray-500">
              ID: {donation.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <span className="font-bold text-green-600">
            ${donation.amount.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{donation.date}</span>
            <span>•</span>
            <span>{donation.payment_method.name}</span>
          </div>
          <Badge className={getStatusColor(donation.status)}>
            {getStatusLabel(donation.status)}
          </Badge>
        </div>
        {donation.message && (
          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2 italic">
            &ldquo;{donation.message}&rdquo;
          </p>
        )}
      </div>
      
      {showActions && (
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetail?.(donation)}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
        </div>
      )}
    </div>
  )

  const renderPublicView = (donation: Donation) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">
                {donation.is_anonymous ? "A" : getDonorName(donation)[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{getDonorName(donation)}</h3>
                  {donation.donor?.is_verified && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 mt-1">
                      Verificado
                    </Badge>
                  )}
                </div>
                <Badge className={getStatusColor(donation.status)}>
                  {getStatusLabel(donation.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-500">Fecha:</span>
                  <p className="font-medium">{donation.date}</p>
                </div>
                <div>
                  <span className="text-gray-500">Método:</span>
                  <p className="font-medium">{donation.payment_method.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">ID:</span>
                  <p className="font-medium text-blue-600">
                    {donation.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {donation.message && (
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">Mensaje:</span>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded italic">
                    &ldquo;{donation.message}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-green-600">
                    ${donation.amount.toLocaleString()}
                  </span>
                </div>

                {showActions && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onViewDetail?.(donation)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalle
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No hay donaciones registradas aún</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {donations.map((donation) => (
        <div key={donation.id}>
          {variant === 'admin' ? renderAdminView(donation) : renderPublicView(donation)}
        </div>
      ))}
    </div>
  )
}