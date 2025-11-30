'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, FileText, CheckSquare, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/auth/authContext'
import { useContractFlow } from '@/hooks/campaigns/useContractFlow'
import { PDFViewer } from '@/components/contract/PDFViewer'
import { ContractSuccess } from '@/components/contract/ContractSuccess'
import { OrganizerDataForm } from '@/components/contract/OrganizerDataForm'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/hooks/useToast'
import { useInitialData } from '@/hooks/api/campaigns/useInitialData'

export default function ContractPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  const { user } = useAuth()
  const { toasts, showSuccess, showError, dismissToast } = useToast()
  
  // Get organizer data
  const { organizer, isLoading: isLoadingOrganizer } = useInitialData(user?.id)
  
  // Contract flow hook
  const {
    step,
    loading,
    contractUrl,
    hasReadCheckbox,
    error,
    generateContract,
    acceptContract,
    setHasReadCheckbox,
    resetError,
    validateOrganizerData,
  } = useContractFlow(campaignId, organizer?.id || '')

  const [showOrganizerForm, setShowOrganizerForm] = useState(false)
  const [missingOrganizerFields, setMissingOrganizerFields] = useState<string[]>([])

  // Check organizer data when it loads
  useEffect(() => {
    if (organizer && !isLoadingOrganizer) {
      const validation = validateOrganizerData(organizer)
      if (!validation.isValid) {
        setMissingOrganizerFields(validation.missingFields)
        setShowOrganizerForm(true)
      }
    }
  }, [organizer, isLoadingOrganizer, validateOrganizerData])

  // Show error toasts
  useEffect(() => {
    if (error) {
      showError(error)
      resetError()
    }
  }, [error, showError, resetError])

  // Handle organizer form completion
  const handleOrganizerDataComplete = async (data: any) => {
    // TODO: Save organizer data to backend
    console.log('Organizer data to save:', data)
    
    // For now, just hide the form and proceed
    setShowOrganizerForm(false)
    setMissingOrganizerFields([])
    
    showSuccess('Información guardada. Puedes continuar.')
  }

  // Handle generate contract
  const handleGenerateContract = async () => {
    // Check if organizer data is complete
    if (organizer) {
      const validation = validateOrganizerData(organizer)
      if (!validation.isValid) {
        setMissingOrganizerFields(validation.missingFields)
        setShowOrganizerForm(true)
        showError('Por favor, completa tu información de organizador antes de generar el contrato')
        return
      }
    }

    await generateContract()
  }

  // Get step progress
  const getStepNumber = () => {
    switch (step) {
      case 'generate': return 1
      case 'view': return 2
      case 'accept': return 2
      case 'success': return 3
      default: return 1
    }
  }

  const stepNumber = getStepNumber()
  const progressPercentage = (stepNumber / 3) * 100

  if (isLoadingOrganizer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/campanas">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contrato Legal</h1>
              <p className="text-gray-600 mt-1">
                Paso final para publicar tu campaña
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Paso {stepNumber} de 3
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="mt-4 flex justify-between text-sm">
            <div className={`flex items-center ${stepNumber >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <FileText className="h-4 w-4 mr-1" />
              Generar
            </div>
            <div className={`flex items-center ${stepNumber >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <CheckSquare className="h-4 w-4 mr-1" />
              Revisar y Firmar
            </div>
            <div className={`flex items-center ${stepNumber >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
              <FileCheck className="h-4 w-4 mr-1" />
              Confirmado
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Step 1: Generate Contract */}
          {step === 'generate' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 rounded-full p-4">
                    <FileText className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-center text-2xl">
                  ✅ ¡Campaña Creada Exitosamente!
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  📄 Paso Final: Contrato Legal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-gray-700 mb-4">
                    Antes de publicar tu campaña, debes revisar y aceptar nuestro contrato legal que establece:
                  </p>

                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span>Compromiso de veracidad en la información</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span>Uso correcto y transparente de los fondos recaudados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span>Responsabilidad en la rendición de cuentas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">•</span>
                      <span>Procedimiento ante denuncias o irregularidades</span>
                    </li>
                  </ul>

                  <p className="text-sm text-gray-600 mb-6">
                    Este proceso toma menos de 2 minutos
                  </p>
                </div>

                {/* Organizer Data Form */}
                {showOrganizerForm && (
                  <div className="mb-6">
                    <OrganizerDataForm
                      missingFields={missingOrganizerFields}
                      organizerData={organizer}
                      onComplete={handleOrganizerDataComplete}
                      loading={loading}
                    />
                  </div>
                )}

                {/* Generate Button */}
                {!showOrganizerForm && (
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      onClick={handleGenerateContract}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 px-8"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generando Contrato...
                        </>
                      ) : (
                        <>
                          <FileText className="h-5 w-5 mr-2" />
                          Generar Mi Contrato
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: View and Accept Contract */}
          {(step === 'view' || step === 'accept') && contractUrl && (
            <Card>
              <CardHeader>
                <CardTitle>📄 Contrato Legal - DonaAyuda</CardTitle>
                <CardDescription>
                  Por favor, lee el contrato completo antes de aceptar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* PDF Viewer */}
                <PDFViewer url={contractUrl} />

                {/* Checkbox and Accept Button */}
                <div className="border-t pt-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="accept-terms"
                      checked={hasReadCheckbox}
                      onChange={(e) => setHasReadCheckbox(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer">
                      He leído y acepto los términos del contrato legal. Confirmo que toda la información proporcionada es veraz y me comprometo a cumplir con las obligaciones establecidas.
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Al aceptar, registraremos tu firma digital con fecha, hora e IP. Este proceso es seguro y legalmente válido.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/admin/campanas')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="lg"
                      onClick={acceptContract}
                      disabled={!hasReadCheckbox || loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <FileCheck className="h-5 w-5 mr-2" />
                          Aceptar y Firmar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <ContractSuccess campaignId={campaignId} />
          )}
        </div>
      </div>
    </div>
  )
}

