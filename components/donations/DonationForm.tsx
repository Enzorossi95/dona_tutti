'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormBuilder, FormField } from "@/components/forms/FormBuilder"
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { toast } from 'sonner'

interface DonationFormProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  onSuccess?: () => void
}

export function DonationForm({ isOpen, onClose, campaignId, onSuccess }: DonationFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Métodos de pago disponibles según backend
  const paymentMethodOptions = [
    { value: '1', label: 'Transferencia Bancaria' },
    { value: '2', label: 'Efectivo' },
    { value: '3', label: 'MercadoPago' }
  ]

  const formFields: FormField[] = [
    {
      name: 'amount',
      label: 'Monto de la Donación (ARS)',
      type: 'number',
      placeholder: '0.00',
      required: true
    },
    // Información del Donante
    {
      name: 'donor_name',
      label: 'Nombre del Donante',
      type: 'text',
      placeholder: 'Ej: María',
      required: true
    },
    {
      name: 'donor_last_name',
      label: 'Apellido del Donante',
      type: 'text',
      placeholder: 'Ej: González',
      required: true
    },
    {
      name: 'donor_email',
      label: 'Email del Donante (Opcional)',
      type: 'text',
      placeholder: 'maria@email.com'
    },
    {
      name: 'donor_phone',
      label: 'Teléfono del Donante (Opcional)',
      type: 'text',
      placeholder: '+5491234567890'
    },
    {
      name: 'payment_method_id',
      label: 'Método de Pago',
      type: 'select',
      placeholder: 'Selecciona el método de pago',
      options: paymentMethodOptions,
      required: true
    },
    {
      name: 'date',
      label: 'Fecha de la Donación',
      type: 'date',
      required: true
    },
    {
      name: 'message',
      label: 'Mensaje del Donante',
      type: 'textarea',
      placeholder: 'Mensaje opcional del donante...',
      rows: 3
    },
    {
      name: 'is_anonymous',
      label: 'Donación Anónima',
      type: 'select',
      placeholder: 'Selecciona el tipo de donación',
      options: [
        { value: 'false', label: 'Donación Pública' },
        { value: 'true', label: 'Donación Anónima' }
      ],
      required: true
    }
  ]

  const handleSubmit = async (formData: Record<string, unknown>) => {
    setIsLoading(true)

    try {
      const accessToken = tokenStorage.getAccessToken()
      if (!accessToken) {
        throw new Error('No estás autenticado')
      }

      // Preparar objeto donor con la información ingresada
      const donor: Record<string, string> = {
        name: formData.donor_name as string,
        last_name: formData.donor_last_name as string
      }

      // Agregar email si está presente
      if (formData.donor_email) {
        donor.email = formData.donor_email as string
      }

      // Agregar teléfono si está presente
      if (formData.donor_phone) {
        donor.phone = formData.donor_phone as string
      }

      // Preparar datos según la nueva API del backend
      const donationData = {
        amount: parseFloat(formData.amount as string),
        donor: donor,
        message: formData.message as string || undefined,
        is_anonymous: formData.is_anonymous === 'true',
        payment_method_id: parseInt(formData.payment_method_id as string)
      }

      // Crear donación
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${campaignId}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(donationData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error('Error al crear la donación')
      }

      const createdDonation = await response.json()
      console.log('Donación creada:', createdDonation)

      toast.success('Donación creada exitosamente')
      onSuccess?.()
      onClose()
      
    } catch (error) {
      console.error('Error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear la donación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Donación</DialogTitle>
        </DialogHeader>

        <FormBuilder
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Crear Donación"
          cancelLabel="Cancelar"
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}