'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OrganizerDataFormProps {
  missingFields: string[]
  organizerData?: {
    email?: string
    phone?: string
    address?: string
  }
  onComplete: (data: { email?: string; phone?: string; address?: string }) => void
  loading?: boolean
}

export function OrganizerDataForm({ 
  missingFields, 
  organizerData = {},
  onComplete, 
  loading = false 
}: OrganizerDataFormProps) {
  const [formData, setFormData] = useState({
    email: organizerData.email || '',
    phone: organizerData.phone || '',
    address: organizerData.address || '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (missingFields.includes('email')) {
      if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El email no es válido'
      }
    }

    if (missingFields.includes('phone')) {
      if (!formData.phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio'
      }
    }

    if (missingFields.includes('address')) {
      if (!formData.address.trim()) {
        newErrors.address = 'La dirección es obligatoria'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Only send the missing fields
      const dataToSend: { email?: string; phone?: string; address?: string } = {}
      
      if (missingFields.includes('email')) dataToSend.email = formData.email
      if (missingFields.includes('phone')) dataToSend.phone = formData.phone
      if (missingFields.includes('address')) dataToSend.address = formData.address

      onComplete(dataToSend)
    }
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">Completa tu Información</CardTitle>
        <CardDescription className="text-yellow-700">
          Para generar el contrato legal, necesitamos que completes la siguiente información de contacto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {missingFields.includes('email') && (
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email de contacto *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          )}

          {missingFields.includes('phone') && (
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono de contacto *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="11-1234-5678"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={errors.phone ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          {missingFields.includes('address') && (
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                Dirección *
              </Label>
              <Input
                id="address"
                type="text"
                placeholder="Calle 123, Ciudad, Provincia"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar y Continuar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

