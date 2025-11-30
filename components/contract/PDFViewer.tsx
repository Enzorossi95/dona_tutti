'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface PDFViewerProps {
  url: string
  onLoad?: () => void
  className?: string
}

export function PDFViewer({ url, onLoad, className = '' }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    if (onLoad) {
      onLoad()
    }
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const handleDownload = () => {
    window.open(url, '_blank')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Cargando contrato...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center p-6">
            <p className="text-red-800 mb-4">Error al cargar el PDF del contrato</p>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
      )}

      {/* PDF iframe */}
      {!hasError && (
        <div className="relative">
          <iframe
            src={url}
            className={`w-full rounded-lg border border-gray-300 ${isLoading ? 'hidden' : 'block'}`}
            style={{ height: '600px' }}
            title="Contrato Legal"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      )}

      {/* Download button */}
      {!hasError && !isLoading && (
        <div className="flex justify-center">
          <Button onClick={handleDownload} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      )}
    </div>
  )
}

