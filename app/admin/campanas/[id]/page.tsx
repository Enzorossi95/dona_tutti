"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Edit,
  Share2,
  Eye,
  Plus,
  Users,
  Calendar,
  MapPin,
  Camera,
  ExternalLink,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Receipt, ReceiptList } from "@/components/receipts/ReceiptList"
import { ReceiptDetailModal } from "@/components/receipts/ReceiptDetailModal"
import { campaigns, getCampaignDonations, getCampaignUpdates } from "@/lib/data/campaigns"
import { getReceiptsByCampaign } from "@/lib/data/receipts"

export default function AdminCampaignDetailPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null)
  const [showAddUpdate, setShowAddUpdate] = useState(false)

  // Datos de ejemplo
  const campaign = campaigns[0]

  const receipts = getReceiptsByCampaign(campaign.id)

  const updates = getCampaignUpdates(campaign.id)

  const progressPercentage = (campaign.raised / campaign.goal) * 100

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const donations = getCampaignDonations(campaign.id)

  return (
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
            <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(campaign.status)}>
                {campaign.status === "active" ? "Activa" : campaign.status}
              </Badge>
              <span className="text-sm text-gray-500">Creada el {campaign.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/campanas/${campaign.id}`}>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Público
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Contenido Principal */}
        <div className="xl:col-span-3">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="donations">Donaciones</TabsTrigger>
              <TabsTrigger value="receipts">Comprobantes</TabsTrigger>
              <TabsTrigger value="updates">Actividades</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            {/* Tab: Resumen */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  {/* Galería de Imágenes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <Image
                        src={campaign.images?.[0] || "/placeholder.svg"}
                        alt="Luna"
                        width={600}
                        height={400}
                        className="w-full h-64 md:h-80 object-cover rounded-lg"
                      />
                    </div>
                    <Image
                      src={campaign.images?.[1] || "/placeholder.svg"}
                      alt="Luna"
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Image
                      src={campaign.images?.[2] || "/placeholder.svg"}
                      alt="Luna"
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Información del Animal */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-lg mb-2">Sobre el Beneficiario</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Nombre:</span>
                        <p className="font-medium">{campaign.animal?.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{campaign.animal?.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Edad:</span>
                        <p className="font-medium">{campaign.animal?.age}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Raza:</span>
                        <p className="font-medium">{campaign.animal?.breed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Historia del Caso</h3>
                    <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Donaciones */}
            <TabsContent value="donations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Donaciones ({donations.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div key={donation.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>{donation.donorName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{donation.donorName}</h4>
                              <p className="text-sm text-gray-500">ID: {donation.transactionId}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">${donation.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{donation.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant={donation.status === "completed" ? "default" : "secondary"}>
                              {donation.status === "completed" ? "Completada" : "Pendiente"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalle
                            </Button>
                          </div>
                          {donation.message && (
                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-2">{donation.message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Comprobantes */}
            <TabsContent value="receipts" className="space-y-6">
              <ReceiptList 
                receipts={receipts}
                variant="admin"
                onViewDetail={setSelectedReceipt}
                showActions={true}
              />
            </TabsContent>

            {/* Tab: Actividades */}
            <TabsContent value="updates" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Actividades y Actualizaciones</CardTitle>
                    <Dialog open={showAddUpdate} onOpenChange={setShowAddUpdate}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Nueva Actividad
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Nueva Actividad</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="update-type">Tipo de Actividad</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="medical">Médica</SelectItem>
                                  <SelectItem value="update">Actualización</SelectItem>
                                  <SelectItem value="expense">Gasto</SelectItem>
                                  <SelectItem value="milestone">Hito</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="update-author">Autor</Label>
                              <Input id="update-author" placeholder="Nombre del autor" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="update-title">Título</Label>
                            <Input id="update-title" placeholder="Título de la actividad" />
                          </div>
                          <div>
                            <Label htmlFor="update-content">Contenido</Label>
                            <Textarea id="update-content" rows={4} placeholder="Describe la actividad..." />
                          </div>
                          <div>
                            <Label>Imágenes (Opcional)</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                Arrastra las imágenes aquí o haz clic para seleccionar
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowAddUpdate(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={() => setShowAddUpdate(false)}>Publicar Actividad</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {updates.map((update) => (
                      <div key={update.id} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{update.type}</Badge>
                            <span className="text-sm text-gray-500">
                              {update.date} - {update.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={update.published ? "default" : "secondary"}>
                              {update.published ? "Publicado" : "Borrador"}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUpdate(update)}>
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalle
                            </Button>
                          </div>
                        </div>
                        <h4 className="font-semibold mb-2">{update.title}</h4>
                        <p className="text-gray-700 mb-3">{update.content}</p>
                        {update.images && (
                          <div className="flex space-x-2 mb-2">
                            {update.images.map((img, idx) => (
                              <Image
                                key={idx}
                                src={img || "/placeholder.svg"}
                                alt="Actualización"
                                width={100}
                                height={80}
                                className="w-20 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-gray-500">Por: {update.author}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Configuración */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de la Campaña</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Estado de la Campaña</h4>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline">Pausar Campaña</Button>
                      <Button variant="outline">Marcar como Completada</Button>
                      <Button variant="destructive">Eliminar Campaña</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Configuración de Donaciones</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Permitir donaciones anónimas</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Mostrar lista de donantes</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Permitir comentarios</span>
                        <input type="checkbox" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar de Donación */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              {/* Progreso de Donación */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">${campaign.raised.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">de ${campaign.goal.toLocaleString()}</span>
                </div>
                <Progress value={progressPercentage} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">{Math.round(progressPercentage)}% del objetivo alcanzado</p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="font-bold text-lg">{campaign.donors}</span>
                  </div>
                  <p className="text-xs text-gray-500">Donantes</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="font-bold text-lg">{campaign.daysLeft}</span>
                  </div>
                  <p className="text-xs text-gray-500">Días restantes</p>
                </div>
              </div>

              {/* Información del Organizador */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Organizado por</h4>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={campaign.organizer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>FP</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-sm">{campaign.organizer.name}</span>
                      {campaign.organizer.verified && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {campaign.location}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar Campaña
              </Button>
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir Campaña
              </Button>
              <Link href={`/campana/${campaign.id}`}>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver en Sitio Público
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Modal de Detalle del Comprobante */}
      <ReceiptDetailModal
        receipt={selectedReceipt}
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        onDownload={(receipt) => {/* lógica download */}}
        onViewOriginal={(receipt) => {/* lógica view original */}}
      />

      {/* Modal de Detalle de Actividad */}
      {selectedUpdate && (
        <Dialog open={!!selectedUpdate} onOpenChange={() => setSelectedUpdate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{selectedUpdate.type}</Badge>
                  <span className="text-sm text-gray-500">
                    {selectedUpdate.date} - {selectedUpdate.time}
                  </span>
                </div>
                <Badge variant={selectedUpdate.published ? "default" : "secondary"}>
                  {selectedUpdate.published ? "Publicado" : "Borrador"}
                </Badge>
              </div>
              <DialogTitle className="text-xl">{selectedUpdate.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Contenido completo */}
              <div>
                <p className="text-gray-700 leading-relaxed">{selectedUpdate.content}</p>
              </div>

              {/* Imágenes */}
              {selectedUpdate.images && selectedUpdate.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Imágenes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUpdate.images.map((img: string, idx: number) => (
                      <Image
                        key={idx}
                        src={img || "/placeholder.svg"}
                        alt={`Imagen ${idx + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Información adicional */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Publicado por: {selectedUpdate.author}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Actividad
                </Button>
                {!selectedUpdate.published && <Button>Publicar Ahora</Button>}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
