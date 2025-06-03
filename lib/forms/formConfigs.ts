import { FormField } from '@/components/forms/FormBuilder'

// Configuración para formulario de comprobantes
export const receiptFormFields: FormField[] = [
  {
    name: 'type',
    label: 'Tipo de Gasto',
    type: 'select',
    required: true,
    placeholder: 'Seleccionar tipo',
    options: [
      { value: 'medical', label: 'Médico' },
      { value: 'food', label: 'Alimentación' },
      { value: 'transport', label: 'Transporte' },
      { value: 'other', label: 'Otro' }
    ]
  },
  {
    name: 'amount',
    label: 'Monto',
    type: 'number',
    required: true,
    placeholder: '0'
  },
  {
    name: 'description',
    label: 'Descripción',
    type: 'text',
    required: true,
    placeholder: 'Descripción del gasto'
  },
  {
    name: 'vendor',
    label: 'Proveedor',
    type: 'text',
    required: true,
    placeholder: 'Nombre del proveedor'
  },
  {
    name: 'date',
    label: 'Fecha',
    type: 'date',
    required: true
  },
  {
    name: 'image',
    label: 'Imagen del Comprobante',
    type: 'file',
    placeholder: 'Arrastra la imagen aquí o haz clic para seleccionar'
  }
]

// Configuración para formulario de actividades
export const activityFormFields: FormField[] = [
  {
    name: 'type',
    label: 'Tipo de Actividad',
    type: 'select',
    required: true,
    placeholder: 'Seleccionar tipo',
    options: [
      { value: 'medical', label: 'Médica' },
      { value: 'update', label: 'Actualización' },
      { value: 'expense', label: 'Gasto' },
      { value: 'milestone', label: 'Hito' }
    ]
  },
  {
    name: 'author',
    label: 'Autor',
    type: 'text',
    required: true,
    placeholder: 'Nombre del autor'
  },
  {
    name: 'title',
    label: 'Título',
    type: 'text',
    required: true,
    placeholder: 'Título de la actividad'
  },
  {
    name: 'content',
    label: 'Contenido',
    type: 'textarea',
    required: true,
    rows: 4,
    placeholder: 'Describe la actividad...'
  },
  {
    name: 'images',
    label: 'Imágenes (Opcional)',
    type: 'file',
    placeholder: 'Arrastra las imágenes aquí o haz clic para seleccionar'
  }
]

// Handlers para cada tipo de formulario
export const createReceiptHandler = (data: Record<string, any>) => {
  console.log('Creando comprobante:', data)
  // Aquí iría la lógica para crear el comprobante
  // Ejemplo: await createReceipt(data)
}

export const createActivityHandler = (data: Record<string, any>) => {
  console.log('Creando actividad:', data)
  // Aquí iría la lógica para crear la actividad
  // Ejemplo: await createActivity(data)
} 