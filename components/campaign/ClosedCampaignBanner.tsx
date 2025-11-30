'use client'

import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Lock } from 'lucide-react'

interface ClosedCampaignBannerProps {
  closedAt?: string
}

export function ClosedCampaignBanner({ closedAt }: ClosedCampaignBannerProps) {
  const formattedDate = closedAt
    ? new Date(closedAt).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <Card className="border-blue-300 bg-blue-50 mb-6">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 rounded-full p-3">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900">Campaña Finalizada</h3>
            <p className="text-sm text-blue-700">
              {formattedDate
                ? `Esta campaña fue cerrada el ${formattedDate}`
                : 'Esta campaña ha sido cerrada'}
              . Ya no se aceptan donaciones.
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Cerrada</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
