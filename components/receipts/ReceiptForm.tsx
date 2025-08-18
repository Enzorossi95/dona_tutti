'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormBuilder, FormField } from "@/components/forms/FormBuilder"
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { toast } from 'sonner'

interface ReceiptFormProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  onSuccess?: () => void
}


export function ReceiptForm({ isOpen, onClose, campaignId, onSuccess }: ReceiptFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const receiptTypeOptions = [
    { value: 'Consulta Veterinaria', label: 'Consulta Veterinaria' },
    { value: 'Medicamentos', label: 'Medicamentos' },
    { value: 'Radiografías', label: 'Radiografías' },
    { value: 'Alimento Especial', label: 'Alimento Especial' },
    { value: 'Transporte', label: 'Transporte' },
    { value: 'Cirugía', label: 'Cirugía' },
    { value: 'Hospitalización', label: 'Hospitalización' },
    { value: 'Análisis', label: 'Análisis' },
    { value: 'Otro', label: 'Otro' }
  ]

  const formFields: FormField[] = [
    {
      name: 'provider',
      label: 'Proveedor',
      type: 'text',
      placeholder: 'Ej: Veterinaria San Juan',
      required: true
    },
    {
      name: 'name',
      label: 'Título del Comprobante',
      type: 'text',
      placeholder: 'Ej: Consulta veterinaria de emergencia',
      required: true
    },
    {
      name: 'type',
      label: 'Tipo de Gasto',
      type: 'select',
      placeholder: 'Selecciona el tipo de gasto',
      options: receiptTypeOptions,
      required: true
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Describe detalladamente en qué se gastó el dinero...',
      required: true,
      rows: 3
    },
    {
      name: 'total',
      label: 'Monto Total (ARS)',
      type: 'number',
      placeholder: '0.00',
      required: true
    },
    {
      name: 'quantity',
      label: 'Cantidad',
      type: 'number',
      placeholder: '1',
      required: true
    },
    {
      name: 'date',
      label: 'Fecha',
      type: 'date',
      required: true
    },
    {
      name: 'note',
      label: 'Notas Adicionales',
      type: 'textarea',
      placeholder: 'Información adicional opcional...',
      rows: 2
    },
    {
      name: 'document',
      label: 'Comprobante/Documento',
      type: 'file',
      placeholder: 'Sube la imagen o PDF del comprobante'
    }
  ]

  const handleSubmit = async (formData: Record<string, unknown>) => {
    setIsLoading(true)

    try {
      const accessToken = tokenStorage.getAccessToken()
      if (!accessToken) {
        throw new Error('No estás autenticado')
      }

      const receiptData = {
        provider: formData.provider,
        name: formData.name,
        description: formData.description,
        total: parseFloat(formData.total as string),
        quantity: parseInt(formData.quantity as string),
        date: new Date(formData.date as string).toISOString(),
        note: formData.note || undefined
      }

      // Debug logs para receiptData
      console.log('Receipt Data (raw):', receiptData);
      console.log('Receipt Data (formatted):', JSON.stringify(receiptData, null, 2));
      
      // Crear comprobante
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaignId}/receipts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },

        body: JSON.stringify(receiptData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error('Error al crear el comprobante')
      }

      const createdReceipt = await response.json()

      // Si hay documento, subirlo
      if (formData.document) {
        await uploadReceiptDocument(createdReceipt.id, formData.document as File, accessToken)
      }

      toast.success('Comprobante creado exitosamente')
      onSuccess?.()
      onClose()
      
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear el comprobante')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadReceiptDocument = async (receiptId: string, file: File, accessToken: string) => {
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaignId}/receipts/${receiptId}/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formDataUpload
        }
      )

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('Error al subir documento:', errorText)
        toast.error('Comprobante creado pero no se pudo subir el documento')
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      toast.error('Comprobante creado pero no se pudo subir el documento')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Comprobante</DialogTitle>
        </DialogHeader>

        <FormBuilder
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Crear Comprobante"
          cancelLabel="Cancelar"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}