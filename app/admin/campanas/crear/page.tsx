"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload, X, Plus, MapPin, DollarSign, Camera, Save, Eye } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { CreateCampaignForm } from "@/types/createCampaingform"

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState<CreateCampaignForm>({
    title: "",
    description: "",
    goal: "",
    location: "",
    urgency: "medium",
    category: "medical",
    beneficiaryName: "",
    beneficiaryAge: "",
    requiredHelp: "",
    urgencyReason: "",
    currentSituation: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactWebsite: "",
    paymentMethods: [],
  })

  const [images, setImages] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handleInputChange = (field: string, value: string) => {
    setFormData((estadoActual: CreateCampaignForm) => ({ ...estadoActual, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData((estadoActual: CreateCampaignForm) => {
      const currentArray = estadoActual[field as keyof CreateCampaignForm] as string[]
      if (checked) {
        return { ...estadoActual, [field]: [...currentArray, value] }
      } else {
        return { ...estadoActual, [field]: currentArray.filter((item: string) => item !== value) }
      }
    })
  }

  const addImage = () => {
    // Simular agregar imagen
    setImages((prev) => [...prev, `/placeholder.svg?height=400&width=600&text=Imagen ${prev.length + 1}`])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
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
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Paso {currentStep} de {totalSteps}
        </Badge>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progressPercentage} className="h-2" />
      </div>

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
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium mb-2">Descripción de la Historia *</Label>
                    <Textarea
                      id="description"
                      placeholder="Cuenta la historia del animal, qué le pasó, qué necesita..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium mb-2">Ubicación *</Label>
                      <Input
                        id="location"
                        placeholder="Buenos Aires, Argentina"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Médico</SelectItem>
                          <SelectItem value="rescue">Rescate</SelectItem>
                          <SelectItem value="food">Alimentación</SelectItem>
                          <SelectItem value="shelter">Refugio</SelectItem>
                        </SelectContent>
                      </Select>
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="beneficiaryAge" className="text-sm font-medium mb-2">Edad (Opcional)</Label>
                      <Input
                        id="beneficiaryAge"
                        placeholder="2 años, 35 años, etc."
                        value={formData.beneficiaryAge}
                        onChange={(e) => handleInputChange("beneficiaryAge", e.target.value)}
                      />
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="requiredHelp" className="text-sm font-medium mb-2">Ayuda Necesaria *</Label>
                    <Textarea
                      id="requiredHelp"
                      placeholder="Describe qué tipo de ayuda se necesita: tratamiento médico, reconstrucción, alimentos, medicamentos..."
                      rows={4}
                      value={formData.requiredHelp}
                      onChange={(e) => handleInputChange("requiredHelp", e.target.value)}
                    />
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
                        onClick={addImage}
                        className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        <Plus className="h-6 w-6 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-500">Agregar Foto</span>
                      </button>
                    </div>
                  </div>

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
                </div>
              )}

              {/* Paso 4: Configuración Final */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Información de Contacto</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactName" className="text-sm font-medium mb-2">Nombre de la organización</Label>
                      <Input
                        id="contactName"
                        placeholder="Ej: Fundación Animal"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-sm font-medium mb-2">Teléfono de contacto</Label>
                      <Input
                        id="contactPhone"
                        placeholder="11-1234-5678"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-sm font-medium mb-2">Email de contacto</Label>
                      <Input 
                        id="contactEmail" 
                        placeholder="Email de contacto" 
                        value={formData.contactEmail} 
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)} 
                        type="email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactWebsite" className="text-sm font-medium mb-2">Sitio web (opcional)</Label>
                      <Input
                        id="contactWebsite"
                        placeholder="Sitio web (opcional)" 
                        value={formData.contactWebsite} onChange={(e) => handleInputChange("contactWebsite", e.target.value)} />
                    </div>
                  </div>
                  </div>

                  <div>
                    <Label>Métodos de Pago</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="mercadopago" 
                          defaultChecked 
                          onChange={(e) => handleArrayChange("paymentMethods", "mercadopago", e.target.checked)}
                        />
                        <label htmlFor="mercadopago" className="text-sm">
                          MercadoPago
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="transfer" 
                          onChange={(e) => handleArrayChange("paymentMethods", "transfer", e.target.checked)}
                        />
                        <label htmlFor="transfer" className="text-sm">
                          Transferencia Bancaria
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="cash" 
                          onChange={(e) => handleArrayChange("paymentMethods", "cash", e.target.checked)}
                        />
                        <label htmlFor="cash" className="text-sm">
                          Efectivo
                        </label>
                      </div>
                    </div>
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
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  Anterior
                </Button>

                <div className="space-x-2">
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Borrador
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button onClick={nextStep}>Siguiente</Button>
                  ) : (
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <Eye className="h-4 w-4 mr-2" />
                      Publicar Campaña
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
  )
}
