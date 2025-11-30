'use client'

import { CheckCircle, Clock, Mail, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface ContractSuccessProps {
  campaignId: string
}

export function ContractSuccess({ campaignId }: ContractSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-green-900 mb-4">
            ¡Contrato Firmado Exitosamente!
          </h1>

          <p className="text-lg text-green-800 mb-8">
            Tu campaña ha sido enviada para revisión del equipo de DonaAyuda
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-yellow-100 rounded-full mb-8">
            <Clock className="h-5 w-5 text-yellow-700 mr-2" />
            <span className="text-lg font-semibold text-yellow-800">
              Estado: Pendiente de Aprobación
            </span>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-green-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Notificación por Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    Te notificaremos cuando tu campaña sea aprobada y publicada
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-green-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Tiempo de Revisión
                  </h3>
                  <p className="text-sm text-gray-600">
                    El proceso de aprobación toma entre 24-48 horas hábiles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg p-6 mb-8 text-left border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Próximos Pasos
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Nuestro equipo revisará tu campaña y el contrato firmado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Verificaremos que toda la información sea correcta</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Una vez aprobada, tu campaña será publicada automáticamente</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>Podrás empezar a recibir donaciones inmediatamente</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/campanas/${campaignId}`}>
              <Button variant="outline" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Ver Mi Campaña
              </Button>
            </Link>
            <Link href="/admin/campanas">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Ir al Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Si tienes alguna pregunta sobre el proceso de revisión, puedes contactarnos en{' '}
          <a href="mailto:soporte@donaayuda.com" className="text-green-600 hover:underline">
            soporte@donaayuda.com
          </a>
        </p>
      </div>
    </div>
  )
}

