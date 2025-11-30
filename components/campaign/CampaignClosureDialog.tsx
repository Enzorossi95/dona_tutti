'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Lock, XCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { ClosureType, CloseCampaignRequest, getClosureTypeLabel } from '@/types/closure'
import { formatCurrency } from '@/lib/utils/formatters'

interface CampaignClosureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignTitle: string
  campaignGoal: number
  campaignRaised: number
  onConfirm: (request: CloseCampaignRequest) => Promise<void>
  isLoading?: boolean
}

export function CampaignClosureDialog({
  open,
  onOpenChange,
  campaignTitle,
  campaignGoal,
  campaignRaised,
  onConfirm,
  isLoading = false,
}: CampaignClosureDialogProps) {
  const [closureType, setClosureType] = useState<ClosureType>('manual')
  const [reason, setReason] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const goalPercentage = Math.round((campaignRaised / campaignGoal) * 100)
  const hasReachedGoal = campaignRaised >= campaignGoal
  const isReasonRequired = closureType === 'manual'
  const isReasonValid = !isReasonRequired || reason.trim().length >= 10

  const handleConfirm = async () => {
    if (isReasonRequired && reason.trim().length < 10) {
      setValidationError('La razón debe tener al menos 10 caracteres')
      return
    }

    setValidationError(null)

    const request: CloseCampaignRequest = {
      closure_type: closureType,
      ...(isReasonRequired && { reason: reason.trim() }),
    }

    await onConfirm(request)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state on close
      setClosureType('manual')
      setReason('')
      setValidationError(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Cerrar Campaña
          </AlertDialogTitle>
          <AlertDialogDescription>
            Estás por cerrar la campaña &quot;{campaignTitle}&quot;. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Advertencia si no se alcanzó la meta */}
          {!hasReachedGoal && (
            <Card className="border-yellow-400 bg-yellow-50">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Advertencia: Meta no alcanzada</h4>
                    <p className="text-sm text-yellow-800 mt-1">
                      La campaña aún no ha alcanzado su meta de {formatCurrency(campaignGoal)}.
                      <br />
                      Solo se ha recaudado {formatCurrency(campaignRaised)} ({goalPercentage}%).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selector de tipo de cierre */}
          <div className="space-y-2">
            <Label htmlFor="closure-type">Tipo de cierre</Label>
            <Select
              value={closureType}
              onValueChange={(value) => setClosureType(value as ClosureType)}
            >
              <SelectTrigger id="closure-type">
                <SelectValue placeholder="Seleccionar tipo de cierre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goal_reached">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    {getClosureTypeLabel('goal_reached')}
                  </div>
                </SelectItem>
                <SelectItem value="end_date">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-orange-600" />
                    {getClosureTypeLabel('end_date')}
                  </div>
                </SelectItem>
                <SelectItem value="manual">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600" />
                    {getClosureTypeLabel('manual')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campo de razón (obligatorio para cierre manual) */}
          <div className="space-y-2">
            <Label htmlFor="closure-reason">
              Razón del cierre {isReasonRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="closure-reason"
              placeholder="Describe la razón por la que se cierra esta campaña..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (validationError) setValidationError(null)
              }}
              rows={3}
              className={validationError ? 'border-red-500' : ''}
            />
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}
            {isReasonRequired && !validationError && (
              <p className="text-xs text-gray-500">
                Mínimo 10 caracteres ({reason.length}/10)
              </p>
            )}
          </div>

          {/* Información de lo que se bloqueará */}
          <Card className="bg-gray-50">
            <CardContent className="py-4">
              <h4 className="font-medium text-gray-900 mb-2">Al cerrar se bloqueará:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Nuevas donaciones
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Agregar comprobantes de gastos
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Agregar actividades
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={isLoading || (isReasonRequired && !isReasonValid)}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cerrando...
              </>
            ) : (
              'Confirmar Cierre'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
