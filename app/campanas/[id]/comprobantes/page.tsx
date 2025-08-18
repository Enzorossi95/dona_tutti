"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Calendar, AlertCircle } from "lucide-react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ReceiptList } from "@/components/receipts/ReceiptList"
import { ReceiptDetail } from "@/components/receipts/ReceiptDetail"
import { useCampaignPublicReceipts } from "@/hooks/campaigns/useCampaignPublicReceipts"
import { useCampaign } from "@/hooks/campaigns/useCampaign"
import { Receipt } from "@/types/receipt"

export default function ReceiptsPage() {
  const params = useParams()
  const campaignId = params.id as string
  
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Fetch campaign data to get the title
  const { campaign, isLoading: campaignLoading } = useCampaign(campaignId)
  
  // Fetch receipts from backend
  const { receipts, totalSpent, isLoading: receiptsLoading, error } = useCampaignPublicReceipts(campaignId)

  // Get unique types and statuses for filters
  const receiptTypes = useMemo(() => {
    const types = new Set(receipts.map(r => r.type))
    return Array.from(types).sort()
  }, [receipts])

  //const receiptStatuses = useMemo(() => {
  //  const statuses = new Set(receipts.map(r => r.status))
  //  return Array.from(statuses).sort()
  //}, [receipts])

  // Filter receipts based on search and filters
  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchesSearch =
        receipt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.type.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === "all" || receipt.type.toLowerCase().includes(filterType.toLowerCase())
      //const matchesStatus = filterStatus === "all" || receipt.status.toLowerCase() === filterStatus.toLowerCase()

      return matchesSearch && matchesType //&& matchesStatus
    })
  }, [receipts, searchTerm, filterType, filterStatus])

  const filteredTotalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.total, 0)

  // Loading state
  if (campaignLoading || receiptsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando comprobantes...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar comprobantes</h2>
            <p className="text-gray-600 mb-4">No pudimos cargar los comprobantes. Por favor, intenta nuevamente.</p>
            <Link href={`/campanas/${campaignId}`}>
              <button className="text-blue-600 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4 inline mr-2" />
                Volver a la campaña
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb y Header */}
        <div className="mb-6">
          <Link href={`/campanas/${campaignId}`} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la campaña
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comprobantes de Gastos</h1>
              <p className="text-gray-600 mt-1">{campaign?.title || 'Campaña'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total gastado</p>
              <p className="text-2xl font-bold text-green-600">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar comprobantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tipo de gasto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {receiptTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                {/*
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {receiptStatuses.map(status => (
                    <SelectItem key={status} value={status.toLowerCase()}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
                */}
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {filteredReceipts.length} comprobante{filteredReceipts.length !== 1 ? "s" : ""}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Comprobantes */}
        {filteredReceipts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron comprobantes
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== "all" || filterStatus !== "all" 
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay comprobantes registrados para esta campaña"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ReceiptList 
            receipts={filteredReceipts}
            variant="public"
            onViewDetail={setSelectedReceipt}
            showActions={true}
          />
        )}

        {/* Resumen Total */}
        {filteredReceipts.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Resumen de Gastos</h3>
                  <p className="text-gray-600">
                    {filteredReceipts.length} comprobante{filteredReceipts.length !== 1 ? "s" : ""}
                    {searchTerm || filterType !== "all" || filterStatus !== "all" ? " (filtrado)" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-3xl font-bold text-green-600">${filteredTotalAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Detalle del Comprobante */}
        <ReceiptDetail
          receipt={selectedReceipt}
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      </main>
    </div>
  )
}