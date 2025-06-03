"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, FileText, Download, Eye, Search, Filter, Calendar, DollarSign } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { receipts } from "@/lib/data/receipts"
import { ReceiptList } from "@/components/receipts/ReceiptList"
import { ReceiptDetailModal } from "@/components/receipts/ReceiptDetailModal"

export default function ReceiptsPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")


  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || receipt.type.toLowerCase().includes(filterType.toLowerCase())
    const matchesStatus = filterStatus === "all" || receipt.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesType && matchesStatus
  })

  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0)


  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb y Header */}
        <div className="mb-6">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la campaña
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comprobantes de Gastos</h1>
              <p className="text-gray-600 mt-1">Ayuda a Luna - Cirugía de Emergencia</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total gastado</p>
              <p className="text-2xl font-bold text-green-600">${totalAmount.toLocaleString()}</p>
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
                  <SelectItem value="consulta">Consultas</SelectItem>
                  <SelectItem value="medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="radiografías">Radiografías</SelectItem>
                  <SelectItem value="alimento">Alimento</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pagado">Pagado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {filteredReceipts.length} comprobante{filteredReceipts.length !== 1 ? "s" : ""}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Comprobantes */}
        <div className="space-y-4">
          {filteredReceipts.map((receipt) => (
            <ReceiptList 
            receipts={filteredReceipts}
            variant="public"
            onViewDetail={setSelectedReceipt}
            onDownload={(receipt) => {}}
            showActions={true}
          />
          ))}
        </div>

        {/* Resumen Total */}
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
                <p className="text-3xl font-bold text-green-600">${totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de Detalle del Comprobante */}
        <ReceiptDetailModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onDownload={(receipt) => {}}
        onViewOriginal={(receipt) => {}}
      />
      </main>
    </div>
  )
}
