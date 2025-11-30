'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormBuilder, FormField } from '@/components/forms/FormBuilder'
import { useCampaignActivities, CreateActivityData } from '@/hooks/campaigns/useCampaignActivities'
import { CampaignActivity } from '@/types/campaign'
import { Plus, Edit, Eye, Trash2, AlertCircle, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'

interface CampaignActivitiesTabProps {
  campaignId: string
  readOnly?: boolean
}

export function CampaignActivitiesTab({ campaignId, readOnly = false }: CampaignActivitiesTabProps) {
  const [showAddUpdate, setShowAddUpdate] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<CampaignActivity | null>(null)
  const [editingUpdate, setEditingUpdate] = useState<CampaignActivity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formType, setFormType] = useState<'medical' | 'expense' | 'general'>('general')

  const { activities, isLoading, error, createActivity, updateActivity, deleteActivity } = useCampaignActivities(campaignId)

  // Form fields configuration
  const getFormFields = (): FormField[] => {
    const baseFields: FormField[] = [
      {
        name: 'type',
        label: 'Tipo de Actividad',
        type: 'select',
        required: true,
        options: [
          { value: 'general', label: 'Actualización General' },
          { value: 'medical', label: 'Actualización Médica' },
          { value: 'expense', label: 'Registro de Gasto' },
        ],
      },
      {
        name: 'author',
        label: 'Autor',
        type: 'text',
        placeholder: 'Nombre del autor',
        required: true,
      },
      {
        name: 'title',
        label: 'Título',
        type: 'text',
        placeholder: 'Título de la actividad',
        required: true,
      },
      {
        name: 'content',
        label: 'Resumen',
        type: 'textarea',
        placeholder: 'Breve descripción de la actividad...',
        rows: 3,
        required: true,
      },
    ]


    return baseFields
  }

  const handleSubmit = async (formData: Record<string, unknown>) => {
    setIsSubmitting(true)
    
    try {

      const data: CreateActivityData = {
        type: formData.type as 'medical' | 'expense' | 'general',
        title: formData.title as string,
        content: formData.content as string,
        author: formData.author as string,
      }

      if (editingUpdate) {
        await updateActivity!(editingUpdate.id, data)
        toast.success('Actividad actualizada exitosamente')
        setEditingUpdate(null)
      } else {
        await createActivity!(data)
        toast.success('Actividad creada exitosamente')
      }

      setShowAddUpdate(false)
      setFormType('general')
    } catch (error) {
      console.error('Error saving activity:', error)
      toast.error(error instanceof Error ? error.message : 'Error al guardar la actividad')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (updateId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta actividad?')) return
    
    try {
      await deleteActivity!(updateId)
      toast.success('Actividad eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast.error('Error al eliminar la actividad')
    }
  }


  const handleFormChange = (data: Record<string, unknown>) => {
    if (data.type && data.type !== formType) {
      const newType = data.type as 'medical' | 'expense' | 'general'
      setFormType(newType)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3">Cargando actividades...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error al cargar las actividades</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Actividades y Actualizaciones</CardTitle>
            {!readOnly && (
              <Button onClick={() => setShowAddUpdate(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Actividad
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No hay actividades registradas aún</p>
              {!readOnly && (
                <Button variant="outline" onClick={() => setShowAddUpdate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Actividad
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {activities.map((update) => (
                <div key={update.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{update.type}</Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(update.date).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">
                        Publicado
                      </Badge>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingUpdate(update)
                            setShowAddUpdate(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUpdate(update)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(update.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{update.title}</h4>
                  <p className="text-gray-700 mb-3">{update.description}</p>
                  
                  
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Por: {update.author}
                    </span>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Activity Dialog */}
      <Dialog open={showAddUpdate} onOpenChange={(open) => {
        setShowAddUpdate(open)
        if (!open) {
          setEditingUpdate(null)
          setFormType('general')
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingUpdate ? 'Editar Actividad' : 'Nueva Actividad'}
            </DialogTitle>
          </DialogHeader>
          <FormBuilder
            title=""
            fields={getFormFields()}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowAddUpdate(false)
              setEditingUpdate(null)
            }}
            submitLabel={editingUpdate ? "Actualizar" : "Crear Actividad"}
            isLoading={isSubmitting}
            onChange={handleFormChange}
          />
        </DialogContent>
      </Dialog>

      {/* View Activity Detail Dialog */}
      {selectedUpdate && (
        <Dialog open={!!selectedUpdate} onOpenChange={() => setSelectedUpdate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{selectedUpdate.type}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedUpdate.date).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <Badge variant="default">
                  Publicado
                </Badge>
              </div>
              <DialogTitle className="text-xl">{selectedUpdate.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {selectedUpdate.description}
                </p>
              </div>



              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Publicado por: {selectedUpdate.author}
                  </span>
                </div>
              </div>

              {!readOnly && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingUpdate(selectedUpdate)
                      setSelectedUpdate(null)
                      setShowAddUpdate(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Actividad
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}