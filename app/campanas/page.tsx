"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"
import { campaigns } from "@/lib/data/campaigns"
import { CampaignCard } from "@/components/campaign/CampaignCard"


export default function CampanasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")


  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || campaign.category.toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campañas Activas</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre las campañas que necesitan tu ayuda. Cada donación es transparente y rastreada con comprobantes
            reales.
          </p>
        </div>
      </div>
      {/* Filtros y Búsqueda */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar campañas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="médico">Médico</SelectItem>
                <SelectItem value="refugio">Refugio</SelectItem>
                <SelectItem value="alimentación">Alimentación</SelectItem>
                <SelectItem value="rescate">Rescate</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center text-sm text-gray-600">
              <span>
                {filteredCampaigns.length} campaña{filteredCampaigns.length !== 1 ? "s" : ""} encontrada
                {filteredCampaigns.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Campañas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Tienes un caso que necesita ayuda?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Crea tu campaña de forma gratuita y transparente. Nuestra plataforma te ayuda a llegar a más personas que
          quieren ayudar.
        </p>
        <Link href="/admin/campanas/crear">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Crear Mi Campaña
          </Button>
        </Link>
      </div>
    </main>
  )
}
