export interface Receipt {
  id: number
  campaignId: string
  date: string
  type: ReceiptType
  amount: number
  description: string
  document: string
  image: string
  vendor: string
  status: ReceiptStatus
  breakdown?: Array<{
    item: string
    amount: number
  }>
  notes?: string
}

export type ReceiptType = 
  | 'Consulta Veterinaria'
  | 'Medicamentos'
  | 'Radiografías'
  | 'Alimento Especial'
  | 'Transporte'
  | 'Cirugía'
  | 'Hospitalización'
  | 'Análisis'
  | 'Otro'

export type ReceiptStatus = 'Pagado' | 'Pendiente' | 'Rechazado'

export interface ReceiptFilters {
  searchTerm: string
  type: string
  status: string
  dateFrom?: string
  dateTo?: string
}

export interface ReceiptSummary {
  totalAmount: number
  totalReceipts: number
  byType: Record<ReceiptType, number>
  byStatus: Record<ReceiptStatus, number>
} 