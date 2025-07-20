"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, X, Plus, MapPin, DollarSign, Camera, Save, Eye, User, LogOut } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { CreateCampaignForm, PaymentMethod, PaymentMethodSelection, OrganizerInfo } from "@/types/createCampaingform"
import { CreateCampaignRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/lib/auth/authContext"
import { useInitialData } from "@/hooks/api/campaigns/useInitialData"
import { useCreateCampaign } from "@/hooks/api/campaigns/useCreateCampaign"
import { useCategories } from "@/hooks/api/categories/useCategories"
import { useToast } from "@/hooks/useToast"
import { Toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"

export default function CreateCampaignPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { isLoading: isLoadingData, paymentMethods: availablePaymentMethods, organizer: organizerInfo, error } = useInitialData(user?.id)
  const { createCampaign, isLoading: isCreating, error: createError, isSuccess } = useCreateCampaign()
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()
  const { toasts, showSuccess, showError, dismissToast } = useToast()
  
  const [formData, setFormData] = useState<CreateCampaignForm>({
    title: "",
    description: "",
    goal: "",
    location: "",
    urgency: "medium",
    category: "",
    beneficiaryName: "",
    beneficiaryAge: "",
    requiredHelp: "",
    urgencyReason: "",
    currentSituation: "",
    paymentMethods: [],
    organizer: {
      id: "",
      name: "",
      email: "",
      website: "",
      phone: "",
    },
  })

  const [images, setImages] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({})

  // Pre-load organizer information when it becomes available
  useEffect(() => {
    if (organizerInfo && !formData.organizer.id) {
      setFormData(prev => ({
        ...prev,
        organizer: {
          id: organizerInfo.id,
          name: organizerInfo.name || "",
          phone: organizerInfo.phone || "",
          email: organizerInfo.email || "",
          website: organizerInfo.website || "",
        },
      }))
    }
  }, [organizerInfo?.id]) // Only depend on organizer ID to avoid unnecessary re-runs

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      // Set the first category as default
      setFormData(prev => ({
        ...prev,
        category: categories[0].id
      }))
    }
  }, [categories, formData.category])

  // Show error if data loading fails
  useEffect(() => {
    if (error) {
      console.error('Error loading initial data:', error)
    }
    if (categoriesError) {
      console.error('Error loading categories:', categoriesError)
    }
  }, [error, categoriesError])

  // Handle successful campaign creation
  useEffect(() => {
    if (isSuccess) {
      showSuccess('¡Campaña creada exitosamente!')
      setTimeout(() => {
        router.push('/admin/campanas')
      }, 4000) // Give more time to see the success message
    }
  }, [isSuccess, router, showSuccess])

  // Show creation errors
  useEffect(() => {
    if (createError) {
      console.error('Error creating campaign:', createError)
      showError(`Error al crear la campaña: ${createError.message}`)
    }
  }, [createError, showError])

  const handleInputChange = (field: string, value: string) => {
    setFormData((estadoActual: CreateCampaignForm) => {
      // Handle nested organizer fields
      if (field.startsWith('organizer.')) {
        const organizerField = field.split('.')[1]
        return {
          ...estadoActual,
          organizer: {
            ...estadoActual.organizer,
            [organizerField]: value
          }
        }
      }
      
      // Handle regular fields
      return { ...estadoActual, [field]: value }
    })
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePaymentMethodChange = (paymentMethodId: number, checked: boolean, instructions: string = "") => {
    setFormData((prev: CreateCampaignForm) => {
      let newPaymentMethods: PaymentMethodSelection[]
      
      if (checked) {
        // Add new payment method
        newPaymentMethods = [...prev.paymentMethods, { payment_method_id: paymentMethodId, instructions }]
      } else {
        // Remove payment method
        newPaymentMethods = prev.paymentMethods.filter(pm => pm.payment_method_id !== paymentMethodId)
      }
      
      // Clear payment methods error if at least one is selected
      if (newPaymentMethods.length > 0 && errors.paymentMethods) {
        setErrors(prevErrors => ({ ...prevErrors, paymentMethods: '' }))
      }
      
      return { ...prev, paymentMethods: newPaymentMethods }
    })
  }

  const handlePaymentMethodInstructionsChange = (paymentMethodId: number, instructions: string) => {
    setFormData((prev: CreateCampaignForm) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(pm => 
        pm.payment_method_id === paymentMethodId 
          ? { ...pm, instructions }
          : pm
      )
    }))
  }

  const isPaymentMethodSelected = (paymentMethodId: number): boolean => {
    return formData.paymentMethods.some(pm => pm.payment_method_id === paymentMethodId)
  }

  const getPaymentMethodInstructions = (paymentMethodId: number): string => {
    const paymentMethod = formData.paymentMethods.find(pm => pm.payment_method_id === paymentMethodId)
    return paymentMethod?.instructions || ""
  }

  const validateField = (field: string, value: string) => {
    // Marcar el campo como tocado
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
      case 'paymentMethods':
        // Para paymentMethods, value no es usado ya que es un array
        // La validación se hace en validateCurrentStep
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

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    // This function is only used for non-paymentMethods string arrays
    if (field === 'paymentMethods') {
      console.warn('Use handlePaymentMethodChange for payment methods')
      return
    }
    
    setFormData((estadoActual: CreateCampaignForm) => {
      // Create a new object with the updated array field
      // Since we exclude paymentMethods above, we know this is a string array
      const newFormData = { ...estadoActual }
      
      // Type assertion is safe here since we've excluded paymentMethods
      const currentArray = (estadoActual as any)[field] as string[] || []
      let newArray: string[]
      
      if (checked) {
        newArray = [...currentArray, value]
      } else {
        newArray = currentArray.filter((item: string) => item !== value)
      }
      
      (newFormData as any)[field] = newArray
      return newFormData
    })
  }

  const addImage = () => {
    // Simular agregar imagen
    setImages((prev) => [...prev, `/placeholder.svg?height=400&width=600&text=Imagen ${prev.length + 1}`])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateCurrentStep = () => {
    let stepErrors: {[key: string]: string} = {}
    let isValid = true

    switch (currentStep) {
      case 1:
        // Validar campos obligatorios del paso 1
        if (!formData.title.trim()) {
          stepErrors.title = 'El título de la campaña es obligatorio'
          isValid = false
        }
        if (!formData.goal.trim()) {
          stepErrors.goal = 'El objetivo de recaudación es obligatorio'
          isValid = false
        }
        if (!formData.location.trim()) {
          stepErrors.location = 'La ubicación es obligatoria'
          isValid = false
        }
        break
      case 2:
        // Validar campos obligatorios del paso 2
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
        break
      case 3:
        // Validar que haya al menos una imagen
        if (images.length === 0) {
          stepErrors.images = 'Debes agregar al menos una foto del caso'
          isValid = false
        }
        break
      default:
        break
      case 4:
        // Validar campos obligatorios del paso 4
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
        }
        if (!formData.paymentMethods.length) {
          stepErrors.paymentMethods = 'Debes seleccionar al menos un método de pago'
          isValid = false
        }
        break
    }

    // Solo mostrar errores para campos que han sido tocados o cuando se intenta avanzar
    const currentFields = getFieldsByStep(currentStep)
    const filteredErrors: {[key: string]: string} = {}
    
    currentFields.forEach(field => {
      if (touchedFields[field] || !isValid) {
        if (stepErrors[field]) {
          filteredErrors[field] = stepErrors[field]
        }
      }
    })

    setErrors(prev => ({ ...prev, ...filteredErrors }))
    return isValid
  }

  const getFieldsByStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['title', 'goal', 'location']
      case 2:
        return ['beneficiaryName', 'currentSituation', 'requiredHelp']
      case 3:
        return ['images']
      case 4:
        return ['organizerName', 'organizerPhone', 'organizerEmail', 'paymentMethods']
      default:
        return []
    }
  }

  const nextStep = () => {
    const isValid = validateCurrentStep()
    
    if (isValid && currentStep < totalSteps) {
      // Si es válido, limpiar errores y campos tocados antes de avanzar
      const currentFields = getFieldsByStep(currentStep)
      setErrors({})
      setTouchedFields({})
      setCurrentStep(currentStep + 1)
    } else if (!isValid) {
      // Si no es válido, marcar todos los campos como tocados para mostrar errores
      const currentFields = getFieldsByStep(currentStep)
      const newTouchedFields = { ...touchedFields }
      currentFields.forEach(field => {
        newTouchedFields[field] = true
      })
      setTouchedFields(newTouchedFields)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      // Limpiar todos los errores y campos tocados al retroceder
      setErrors({})
      setTouchedFields({})
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validar el paso actual antes de enviar
    if (!validateCurrentStep()) {
      return // No enviar si hay errores
    }

    // Don't submit if already creating
    if (isCreating) {
      return
    }

    try {
      // Validate required fields
      if (!formData.goal.trim()) {
        throw new Error('El objetivo de recaudación es obligatorio')
      }

      // Prepare data in the format expected by the backend
      const organizerInfo = {
        id: formData.organizer.id,
        name: formData.organizer.name,
        phone: formData.organizer.phone || undefined,
        email: formData.organizer.email,
        website: formData.organizer.website || undefined,
      }

      // Parse and validate numeric fields
      const goalNumber = parseInt(formData.goal.trim())
      if (isNaN(goalNumber) || goalNumber <= 0) {
        throw new Error('El objetivo debe ser un número válido mayor a 0')
      }

      const beneficiaryAge = formData.beneficiaryAge.trim() 
        ? parseInt(formData.beneficiaryAge.trim()) 
        : null
      
      if (beneficiaryAge !== null && (isNaN(beneficiaryAge) || beneficiaryAge <= 0)) {
        throw new Error('La edad debe ser un número válido mayor a 0')
      }

      const campaignData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: images[0] || "", // Use first image as main image
        goal: goalNumber,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        location: formData.location.trim(),
        category: formData.category,
        urgency: formData.urgency === "critical" ? 10 : formData.urgency === "high" ? 8 : formData.urgency === "medium" ? 5 : 2,
        status: "active",
        payment_methods: formData.paymentMethods,
        beneficiary_name: formData.beneficiaryName.trim(),
        beneficiary_age: beneficiaryAge,
        current_situation: formData.currentSituation.trim(),
        urgency_reason: formData.urgencyReason.trim(),
        required_help: formData.requiredHelp.trim(),
        // Contact information
        organizer: organizerInfo,
      }

      // Add detailed logging for debugging
      console.log('Sending campaign data to API:', JSON.stringify(campaignData, null, 2))

      // Use the hook to create the campaign
      await createCampaign(campaignData)
      
    } catch (error) {
      // Handle validation errors and show them as toasts
      console.error('Error submitting campaign:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Error inesperado al crear la campaña')
      }
    }
  }

  return (
    <CreateCampaignRoute>
      {/* Toast Container */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => dismissToast(toast.id)}
        >
          {toast.message}
        </Toast>
      ))}
      
      <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Campaña</h1>
              <p className="text-gray-600 mt-1">Completa todos los pasos para publicar tu campaña</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.firstName || user?.email}</span>
              <Badge variant="outline">{user?.role?.name}</Badge>
            </div>
            
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Paso {currentStep} de {totalSteps}
            </Badge>
            
          </div>
        </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Error Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            Error cargando datos iniciales: {error.message}
          </p>
        </div>
      )}

      {/* Loading Initial Data */}
      {isLoadingData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            Cargando información inicial...
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Información Básica"}
                {currentStep === 2 && "Detalles del Beneficiario"}
                {currentStep === 3 && "Imágenes y Multimedia"}
                {currentStep === 4 && "Configuración Final"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Paso 1: Información Básica */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium mb-2">Título de la Campaña *</Label>
                    <Input
                      id="title"
                      placeholder="Ej: Ayuda a Luna - Cirugía de Emergencia"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      onBlur={(e) => validateField("title", e.target.value)}
                      className={errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      required
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium mb-2">Descripción de la Historia *</Label>
                    <Textarea
                      id="description"
                      placeholder="Cuenta la historia del animal, qué le pasó, qué necesita..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      //onBlur={(e) => validateField("description", e.target.value)}
                      //className={errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {/*errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )*/}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal" className="text-sm font-medium mb-2">Objetivo de Recaudación (ARS) *</Label>
                      <Input
                        id="goal"
                        type="number"
                        placeholder="150000"
                        value={formData.goal}
                        onChange={(e) => handleInputChange("goal", e.target.value)}
                        onBlur={(e) => validateField("goal", e.target.value)}
                        className={errors.goal ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.goal && (
                        <p className="text-red-500 text-sm mt-1">{errors.goal}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium mb-2">Ubicación *</Label>
                      <Input
                        id="location"
                        placeholder="Buenos Aires, Argentina"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        onBlur={(e) => validateField("location", e.target.value)}
                        className={errors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="urgency" className="text-sm font-medium mb-2">Nivel de Urgencia</Label>
                      <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium mb-2">Categoría</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                          ) : categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-categories" disabled>No hay categorías disponibles</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {categoriesError && (
                        <p className="text-red-500 text-sm mt-1">Error cargando categorías</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Detalles del Beneficiario */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="beneficiaryName" className="text-sm font-medium mb-2">Nombre del Beneficiario *</Label>
                      <Input
                        id="beneficiaryName"
                        placeholder="Ej: Luna, Familia García, Comunidad San José"
                        value={formData.beneficiaryName}
                        onChange={(e) => handleInputChange("beneficiaryName", e.target.value)}
                        onBlur={(e) => validateField("beneficiaryName", e.target.value)}
                        className={errors.beneficiaryName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.beneficiaryName && (
                        <p className="text-red-500 text-sm mt-1">{errors.beneficiaryName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="beneficiaryAge" className="text-sm font-medium mb-2">Edad (Opcional)</Label>
                      <Input
                        id="beneficiaryAge"
                        type="number"
                        placeholder="2"
                        value={formData.beneficiaryAge}
                        onChange={(e) => handleInputChange("beneficiaryAge", e.target.value)}
                        onBlur={(e) => validateField("beneficiaryAge", e.target.value)}
                        className={errors.beneficiaryAge ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.beneficiaryAge && (
                        <p className="text-red-500 text-sm mt-1">{errors.beneficiaryAge}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currentSituation" className="text-sm font-medium mb-2">Situación Actual *</Label>
                    <Textarea
                      id="currentSituation"
                      placeholder="Describe la situación actual del beneficiario, síntomas, condiciones, estado..."
                      rows={4}
                      value={formData.currentSituation}
                      onChange={(e) => handleInputChange("currentSituation", e.target.value)}
                      onBlur={(e) => validateField("currentSituation", e.target.value)}
                      className={errors.currentSituation ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.currentSituation && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentSituation}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="requiredHelp" className="text-sm font-medium mb-2">Ayuda Necesaria *</Label>
                    <Textarea
                      id="requiredHelp"
                      placeholder="Describe qué tipo de ayuda se necesita: tratamiento médico, reconstrucción, alimentos, medicamentos..."
                      rows={4}
                      value={formData.requiredHelp}
                      onChange={(e) => handleInputChange("requiredHelp", e.target.value)}
                      onBlur={(e) => validateField("requiredHelp", e.target.value)}
                      className={errors.requiredHelp ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {errors.requiredHelp && (
                      <p className="text-red-500 text-sm mt-1">{errors.requiredHelp}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="urgencyReason" className="text-sm font-medium mb-2">Motivo de la Urgencia</Label>
                    <Textarea
                      id="urgencyReason"
                      placeholder="Explica por qué es urgente esta donación y qué pasaría si no se recibe ayuda a tiempo..."
                      rows={3}
                      value={formData.urgencyReason}
                      onChange={(e) => handleInputChange("urgencyReason", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Paso 3: Imágenes */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Fotos del Caso *</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Agrega fotos que muestren la situación del animal. La primera imagen será la principal.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Imagen ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {index === 0 && <Badge className="absolute bottom-2 left-2 text-xs">Principal</Badge>}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addImage}
                        className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        <Plus className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Agregar Foto</span>
                      </button>
                    </div>
                    {errors.images && (
                      <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                    )}
                  </div>
                  {/*
                  <div>
                    <Label>Documentos Médicos (Opcional)</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Sube informes veterinarios, radiografías, análisis, etc.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Documentos
                    </Button>
                  </div>
                  */}
                </div>
              )}

              {/* Paso 4: Configuración Final */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Información de Contacto</Label>
                    {organizerInfo && (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ℹ️ Información pre-cargada desde tu perfil de organizador. Puedes modificarla si es necesario.
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName" className="text-sm font-medium mb-2">Nombre de la organización</Label>
                      <Input
                        id="contactName"
                        placeholder="Ej: Fundación Animal"
                        value={formData.organizer.name}
                        onChange={(e) => handleInputChange("organizer.name", e.target.value)}
                        onBlur={(e) => validateField("organizer.name", e.target.value)}
                        className={errors.organizerName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.organizerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.organizerName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-sm font-medium mb-2">Teléfono de contacto</Label>
                      <Input
                        id="contactPhone"
                        placeholder="11-1234-5678"
                        value={formData.organizer.phone}
                        onChange={(e) => handleInputChange("organizer.phone", e.target.value)}
                        onBlur={(e) => validateField("organizer.phone", e.target.value)}
                        className={errors.organizerPhone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.organizerPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.organizerPhone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium mb-2">Email de contacto</Label>
                      <Input 
                        id="contactEmail" 
                        placeholder="Email de contacto" 
                        value={formData.organizer.email} 
                        onChange={(e) => handleInputChange("organizer.email", e.target.value)} 
                        type="email"
                        onBlur={(e) => validateField("organizer.email", e.target.value)}
                        className={errors.organizerEmail ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                      />
                      {errors.organizerEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.organizerEmail}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contactWebsite" className="text-sm font-medium mb-2">Sitio web (opcional)</Label>
                      <Input
                        id="organizer.website"
                        placeholder="Sitio web (opcional)" 
                        value={formData.organizer.website} onChange={(e) => handleInputChange("organizer.website", e.target.value)} />
                    </div>
                  </div>
                  </div>

                  <div>
                    <Label>Métodos de Pago *</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Selecciona los métodos de pago que aceptarás y agrega instrucciones específicas para cada uno.
                    </p>
                    <div className="space-y-4 mt-2">
                      {availablePaymentMethods.map((pm: PaymentMethod) => (
                        <div key={pm.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={`pm-${pm.id}`} 
                              checked={isPaymentMethodSelected(pm.id)}
                              onChange={(e) => handlePaymentMethodChange(pm.id, e.target.checked, "")}
                            />
                            <label htmlFor={`pm-${pm.id}`} className="text-sm font-medium">
                              {pm.name}
                            </label>
                          </div>
                          
                          {isPaymentMethodSelected(pm.id) && (
                            <div>
                              <Label htmlFor={`instructions-${pm.id}`} className="text-sm font-medium mb-2">
                                Instrucciones para {pm.name}
                              </Label>
                              <Textarea
                                id={`instructions-${pm.id}`}
                                placeholder={`Ingresa las instrucciones específicas para ${pm.name.toLowerCase()} (ej: número de cuenta, CBU, datos de contacto, etc.)`}
                                value={getPaymentMethodInstructions(pm.id)}
                                onChange={(e) => handlePaymentMethodInstructionsChange(pm.id, e.target.value)}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {availablePaymentMethods.length === 0 && !isLoadingData && (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No hay métodos de pago disponibles
                        </div>
                      )}
                      
                      {isLoadingData && (
                        <div className="text-sm text-gray-500 text-center py-4">
                          Cargando métodos de pago...
                        </div>
                      )}
                    </div>
                    {errors.paymentMethods && (
                      <p className="text-red-500 text-sm mt-1">{errors.paymentMethods}</p>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Antes de Publicar</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Asegúrate de que toda la información sea veraz</li>
                      <li>• Las fotos deben mostrar claramente la situación</li>
                      <li>• Mantén actualizaciones regulares de la campaña</li>
                      <li>• Proporciona comprobantes de todos los gastos</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Botones de Navegación */}
              <div className="flex justify-between pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1 || isCreating}
                >
                  Anterior
                </Button>

                <div className="space-x-2">
                  <Button type="button" variant="outline" disabled={isCreating}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={nextStep} disabled={isCreating}>Siguiente</Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creando Campaña...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Publicar Campaña
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {images.length > 0 && (
                  <Image
                    src={images[0] || "/placeholder.svg"}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}

                <div>
                  <h3 className="font-semibold text-lg">{formData.title || "Título de la campaña"}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.beneficiaryName && `Para ${formData.beneficiaryName}`}
                  </p>
                </div>

                {formData.goal && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Objetivo:</span>
                      <span className="font-medium">${Number.parseInt(formData.goal).toLocaleString()}</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}

                {formData.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {formData.location}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Camera className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p>Usa fotos de alta calidad que muestren claramente la situación</p>
                </div>
                <div className="flex items-start space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500 mt-0.5" />
                  <p>Establece un objetivo realista basado en costos reales</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </form>
    </CreateCampaignRoute>
  )
}
