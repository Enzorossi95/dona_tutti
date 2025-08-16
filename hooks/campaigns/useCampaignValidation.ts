import { useState } from 'react'
import { CreateCampaignForm } from '@/types/createCampaingform'

interface ValidationErrors {
  [key: string]: string
}

interface UseCampaignValidationProps {
  formData: CreateCampaignForm
  images: string[]
}

export function useCampaignValidation({ formData, images }: UseCampaignValidationProps) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({})

  const validateField = (field: string, value: string) => {
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }))
    
    let error = ''
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          error = 'El título de la campaña es obligatorio'
        }
        break
      case 'goal':
        if (!value.trim()) {
          error = 'El objetivo de recaudación es obligatorio'
        } else {
          const goalNumber = parseInt(value.trim())
          if (isNaN(goalNumber) || goalNumber <= 0) {
            error = 'El objetivo debe ser un número válido mayor a 0'
          }
        }
        break
      case 'location':
        if (!value.trim()) {
          error = 'La ubicación es obligatoria'
        }
        break
      case 'beneficiaryName':
        if (!value.trim()) {
          error = 'El nombre del beneficiario es obligatorio'
        }
        break
      case 'currentSituation':
        if (!value.trim()) {
          error = 'La situación actual es obligatoria'
        }
        break
      case 'requiredHelp':
        if (!value.trim()) {
          error = 'La ayuda necesaria es obligatoria'
        }
        break
      case 'organizer.name':
        if (!value.trim()) {
          error = 'El nombre de la organización es obligatorio'
        }
        break
      case 'organizer.phone':
        if (!value.trim()) {
          error = 'El teléfono de contacto es obligatorio'
        }
        break
      case 'organizer.email':
        if (!value.trim()) {
          error = 'El email de contacto es obligatorio'
        } else {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value.trim())) {
            error = 'El email no es válido'
          }
        }
        break
      case 'beneficiaryAge':
        if (value.trim()) {
          const age = parseInt(value.trim())
          if (isNaN(age) || age <= 0) {
            error = 'La edad debe ser un número válido mayor a 0'
          }
        }
        break
      case 'description':
        if (!value.trim()) {
          error = 'La descripción es obligatoria'
        } else if (value.trim().length < 50) {
          error = 'La descripción debe tener al menos 50 caracteres'
        }
        break
      case 'urgencyReason':
        if (formData.urgency === 'critical' || formData.urgency === 'high') {
          if (!value.trim()) {
            error = 'Debes explicar la razón de la urgencia'
          }
        }
        break
      default:
        break
    }
    
    // Map nested field names to error keys for consistency
    let errorKey = field
    if (field === 'organizer.name') errorKey = 'organizerName'
    if (field === 'organizer.phone') errorKey = 'organizerPhone'
    if (field === 'organizer.email') errorKey = 'organizerEmail'
    
    setErrors(prev => ({ ...prev, [errorKey]: error }))
    return error === ''
  }

  const getFieldsByStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['title', 'description', 'goal', 'location', 'category', 'urgency']
      case 2:
        return ['beneficiaryName', 'beneficiaryAge', 'currentSituation', 'requiredHelp', 'urgencyReason']
      case 3:
        return ['images']
      case 4:
        return ['organizerName', 'organizerPhone', 'organizerEmail', 'organizerWebsite', 'paymentMethods']
      default:
        return []
    }
  }

  const validateStep = (step: number): { isValid: boolean; errors: ValidationErrors } => {
    let stepErrors: ValidationErrors = {}
    let isValid = true

    switch (step) {
      case 1:
        // Validate required fields for step 1
        if (!formData.title.trim()) {
          stepErrors.title = 'El título de la campaña es obligatorio'
          isValid = false
        }
        if (!formData.description.trim()) {
          stepErrors.description = 'La descripción es obligatoria'
          isValid = false
        } else if (formData.description.trim().length < 50) {
          stepErrors.description = 'La descripción debe tener al menos 50 caracteres'
          isValid = false
        }
        if (!formData.goal.trim()) {
          stepErrors.goal = 'El objetivo de recaudación es obligatorio'
          isValid = false
        } else {
          const goalNumber = parseInt(formData.goal.trim())
          if (isNaN(goalNumber) || goalNumber <= 0) {
            stepErrors.goal = 'El objetivo debe ser un número válido mayor a 0'
            isValid = false
          }
        }
        if (!formData.location.trim()) {
          stepErrors.location = 'La ubicación es obligatoria'
          isValid = false
        }
        if (!formData.category) {
          stepErrors.category = 'Debes seleccionar una categoría'
          isValid = false
        }
        break

      case 2:
        // Validate required fields for step 2
        if (!formData.beneficiaryName.trim()) {
          stepErrors.beneficiaryName = 'El nombre del beneficiario es obligatorio'
          isValid = false
        }
        if (!formData.currentSituation.trim()) {
          stepErrors.currentSituation = 'La situación actual es obligatoria'
          isValid = false
        }
        if (!formData.requiredHelp.trim()) {
          stepErrors.requiredHelp = 'La ayuda necesaria es obligatoria'
          isValid = false
        }
        // Validate age if provided
        if (formData.beneficiaryAge.trim()) {
          const age = parseInt(formData.beneficiaryAge.trim())
          if (isNaN(age) || age <= 0) {
            stepErrors.beneficiaryAge = 'La edad debe ser un número válido mayor a 0'
            isValid = false
          }
        }
        // Validate urgency reason for high/critical urgency
        if ((formData.urgency === 'critical' || formData.urgency === 'high') && !formData.urgencyReason.trim()) {
          stepErrors.urgencyReason = 'Debes explicar la razón de la urgencia'
          isValid = false
        }
        break

      case 3:
        // Validate that at least one image is uploaded
        if (images.length === 0) {
          stepErrors.images = 'Debes agregar al menos una foto del caso'
          isValid = false
        }
        break

      case 4:
        // Validate required fields for step 4
        if (!formData.organizer.name.trim()) {
          stepErrors.organizerName = 'El nombre de la organización es obligatorio'
          isValid = false
        }
        if (!formData.organizer.phone?.trim()) {
          stepErrors.organizerPhone = 'El teléfono de contacto es obligatorio'
          isValid = false
        }
        if (!formData.organizer.email.trim()) {
          stepErrors.organizerEmail = 'El email de contacto es obligatorio'
          isValid = false
        } else {
          // Basic email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(formData.organizer.email.trim())) {
            stepErrors.organizerEmail = 'El email no es válido'
            isValid = false
          }
        }
        if (!formData.paymentMethods.length) {
          stepErrors.paymentMethods = 'Debes seleccionar al menos un método de pago'
          isValid = false
        }
        break

      default:
        break
    }

    return { isValid, errors: stepErrors }
  }

  const validateCurrentStep = (currentStep: number): boolean => {
    const validation = validateStep(currentStep)
    
    // Only show errors for fields that have been touched or when validation fails
    const currentFields = getFieldsByStep(currentStep)
    const filteredErrors: ValidationErrors = {}
    
    currentFields.forEach(field => {
      const errorKey = field === 'organizer.name' ? 'organizerName' :
                      field === 'organizer.phone' ? 'organizerPhone' :
                      field === 'organizer.email' ? 'organizerEmail' :
                      field === 'organizer.website' ? 'organizerWebsite' :
                      field
      
      if (touchedFields[field] || !validation.isValid) {
        if (validation.errors[errorKey]) {
          filteredErrors[errorKey] = validation.errors[errorKey]
        }
      }
    })

    setErrors(prev => ({ ...prev, ...filteredErrors }))
    return validation.isValid
  }

  const validateAllSteps = (): boolean => {
    let allErrors: ValidationErrors = {}
    let isAllValid = true

    for (let step = 1; step <= 4; step++) {
      const validation = validateStep(step)
      if (!validation.isValid) {
        isAllValid = false
        allErrors = { ...allErrors, ...validation.errors }
      }
    }

    setErrors(allErrors)
    return isAllValid
  }

  const clearErrors = () => {
    setErrors({})
  }

  const clearTouchedFields = () => {
    setTouchedFields({})
  }

  const markFieldsAsTouched = (fields: string[]) => {
    const newTouchedFields = { ...touchedFields }
    fields.forEach(field => {
      newTouchedFields[field] = true
    })
    setTouchedFields(newTouchedFields)
  }

  const clearFieldError = (field: string) => {
    const errorKey = field === 'organizer.name' ? 'organizerName' :
                    field === 'organizer.phone' ? 'organizerPhone' :
                    field === 'organizer.email' ? 'organizerEmail' :
                    field === 'organizer.website' ? 'organizerWebsite' :
                    field
    
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[errorKey]
      return newErrors
    })
  }

  return {
    errors,
    touchedFields,
    validateField,
    validateCurrentStep,
    validateAllSteps,
    validateStep,
    getFieldsByStep,
    clearErrors,
    clearTouchedFields,
    markFieldsAsTouched,
    clearFieldError,
    setErrors,
  }
}