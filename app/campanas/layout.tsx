import type React from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Público */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">DonaTutti</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </Link>
              <Link href="/#como-funciona" className="text-gray-500 hover:text-gray-900">
                Cómo Funciona
              </Link>
              <Link href="/contacto" className="text-gray-500 hover:text-gray-900">
                Contacto
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              
              <Link href="/admin/campanas/crear">
                <Button variant="outline">Crear Campaña Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {children}
    </div>
  )
}
