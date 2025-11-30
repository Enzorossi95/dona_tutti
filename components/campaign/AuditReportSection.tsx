'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Download, Users, FileText, Loader2 } from 'lucide-react'
import { useAuditReport } from '@/hooks/campaigns/useAuditReport'
import { getTransparencyScoreColor } from '@/types/closure'
import { formatCurrency } from '@/lib/utils/formatters'

interface AuditReportSectionProps {
  campaignId: string
}

export function AuditReportSection({ campaignId }: AuditReportSectionProps) {
  const { auditReport, isLoading, error } = useAuditReport(campaignId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Cargando reporte...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !auditReport) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Reporte de auditoría no disponible</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const scoreColors = getTransparencyScoreColor(auditReport.transparency_score)
  const closedDate = new Date(auditReport.closed_at).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Estado de Campaña Cerrada */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-blue-900 text-lg">Campaña Completada</h3>
          </div>
          <p className="text-sm text-blue-700">Cerrada el {closedDate}</p>
        </CardContent>
      </Card>

      {/* Puntuación de Transparencia */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Puntuación de Transparencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <div className={`${scoreColors.bg} rounded-full p-6`}>
              <span className={`text-3xl font-bold ${scoreColors.text}`}>
                {Math.round(auditReport.transparency_score)}
              </span>
            </div>
            <div>
              <Badge className={`${scoreColors.bg} ${scoreColors.text}`}>
                {scoreColors.label}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">de 100 puntos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen Financiero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen Financiero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Meta</span>
              <span className="font-medium">{formatCurrency(auditReport.campaign_goal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Recaudado</span>
              <span className="font-medium text-green-600">
                {formatCurrency(auditReport.total_raised)}
              </span>
            </div>
            <Progress value={auditReport.goal_percentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {auditReport.goal_percentage.toFixed(1)}% alcanzado
            </p>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total gastado</span>
              <span className="font-medium">{formatCurrency(auditReport.total_expenses)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Donantes
              </span>
              <span className="font-medium">{auditReport.total_donors}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descargar Reporte */}
      {auditReport.report_pdf_url && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(auditReport.report_pdf_url, '_blank')}
        >
          <Download className="h-4 w-4 mr-2" />
          Descargar Reporte de Auditoría (PDF)
        </Button>
      )}
    </div>
  )
}
