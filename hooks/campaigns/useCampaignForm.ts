import { useState, useEffect } from 'react'
import { CreateCampaignForm, PaymentMethodSelection } from '@/types/createCampaingform'

interface UseCampaignFormProps {
  organizerInfo?: {
    id: string
    name?: string
    email?: string
    website?: string
    phone?: string
  } | null
  categories: Array<{ id: string; name: string }>
}

export function useCampaignForm({ organizerInfo, categories }: UseCampaignFormProps) {
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
  }, [organizerInfo?.id])

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: categories[0].id
      }))
    }
  }, [categories, formData.category])

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
  }

  const handlePaymentMethodChange = (
    paymentMethodId: number, 
    checked: boolean, 
    instructions: string = ""
  ) => {
    setFormData((prev: CreateCampaignForm) => {
      let newPaymentMethods: PaymentMethodSelection[]
      
      if (checked) {
        // Add new payment method
        newPaymentMethods = [...prev.paymentMethods, { payment_method_id: paymentMethodId, instructions }]
      } else {
        // Remove payment method
        newPaymentMethods = prev.paymentMethods.filter(pm => pm.payment_method_id !== paymentMethodId)
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

  const addImage = () => {
    // Simular agregar imagen
    setImages((prev) => [...prev, `/placeholder.svg?height=400&width=600&text=Imagen ${prev.length + 1}`])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const prepareSubmissionData = () => {
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

    return {
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
      organizer: organizerInfo,
    }
  }

  return {
    formData,
    images,
    handleInputChange,
    handlePaymentMethodChange,
    handlePaymentMethodInstructionsChange,
    isPaymentMethodSelected,
    getPaymentMethodInstructions,
    addImage,
    removeImage,
    prepareSubmissionData,
  }
}