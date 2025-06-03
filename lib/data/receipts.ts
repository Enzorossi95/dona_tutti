import { Receipt } from '@/types/receipt'

export const receipts: Receipt[] = [
  {
    id: 1,
    campaignId: "1",
    date: "2024-01-15",
    type: "Consulta Veterinaria",
    amount: 25000,
    description: "Consulta y diagnóstico Dr. García",
    document: "Factura_Consulta_15012024.pdf",
    image: "/placeholder.svg?height=400&width=300",
    vendor: "Clínica Veterinaria San Martín",
    status: "Pagado",
    breakdown: [
      { item: "Consulta veterinaria", amount: 15000 },
      { item: "Examen físico completo", amount: 5000 },
      { item: "Análisis de sangre", amount: 3000 },
      { item: "Certificado médico", amount: 2000 },
    ],
    notes: "Consulta de emergencia realizada el mismo día del rescate. El Dr. García confirmó la fractura y recomendó cirugía urgente.",
  },
  {
    id: 2,
    campaignId: "1",
    date: "2024-01-12",
    type: "Medicamentos",
    amount: 12500,
    description: "Analgésicos y antiinflamatorios",
    document: "Factura_Farmacia_12012024.pdf",
    image: "/placeholder.svg?height=400&width=300",
    vendor: "Farmacia Veterinaria Central",
    status: "Pagado",
    breakdown: [
      { item: "Tramadol 50mg (20 comprimidos)", amount: 4500 },
      { item: "Meloxicam 1.5mg (15 comprimidos)", amount: 3500 },
      { item: "Antibiótico Amoxicilina", amount: 3000 },
      { item: "Vendas y gasas", amount: 1500 },
    ],
    notes: "Medicamentos para el manejo del dolor post-rescate y prevención de infecciones.",
  },
  {
    id: 3,
    campaignId: "1",
    date: "2024-01-10",
    type: "Radiografías",
    amount: 12000,
    description: "Radiografías digitales (2 placas)",
    document: "Factura_Radiografias_10012024.pdf",
    image: "/placeholder.svg?height=400&width=300",
    vendor: "Centro de Diagnóstico Veterinario",
    status: "Pagado",
    breakdown: [
      { item: "Radiografía lateral de pata trasera", amount: 4000 },
      { item: "Radiografía frontal de pata trasera", amount: 4000 },
      { item: "Sedación ligera", amount: 2500 },
      { item: "Análisis e interpretación", amount: 1500 },
    ],
    notes: "Radiografías necesarias para evaluar la severidad de la fractura y planificar la cirugía.",
  },
  {
    id: 4,
    campaignId: "1",
    date: "2024-01-08",
    type: "Alimento Especial",
    amount: 8500,
    description: "Alimento medicado para recuperación",
    document: "Factura_Alimento_08012024.pdf",
    image: "/placeholder.svg?height=400&width=300",
    vendor: "Pet Shop Salud Animal",
    status: "Pagado",
    breakdown: [
      { item: "Alimento terapéutico Hills i/d (3kg)", amount: 5000 },
      { item: "Suplemento vitamínico", amount: 2000 },
      { item: "Probióticos", amount: 1500 },
    ],
    notes: "Alimento especial para facilitar la digestión durante el período de recuperación.",
  },
  {
    id: 5,
    campaignId: "1",
    date: "2024-01-05",
    type: "Transporte",
    amount: 3500,
    description: "Traslado de emergencia a clínica",
    document: "Recibo_Transporte_05012024.pdf",
    image: "/placeholder.svg?height=400&width=300",
    vendor: "Taxi Pet Emergencias",
    status: "Pagado",
    breakdown: [
      { item: "Traslado de emergencia", amount: 2500 },
      { item: "Caja transportadora", amount: 1000 },
    ],
    notes: "Transporte urgente desde el lugar del rescate hasta la clínica veterinaria.",
  },
]

// Funciones helper
export const getReceiptsByCampaign = (campaignId: string): Receipt[] => {
  return receipts.filter(receipt => receipt.campaignId === campaignId)
}

export const getReceiptById = (id: number): Receipt | undefined => {
  return receipts.find(receipt => receipt.id === id)
}

export const getTotalSpentByCampaign = (campaignId: string): number => {
  return getReceiptsByCampaign(campaignId)
    .reduce((total, receipt) => total + receipt.amount, 0)
}

export const getReceiptsByType = (campaignId: string, type: string): Receipt[] => {
  return getReceiptsByCampaign(campaignId)
    .filter(receipt => receipt.type.toLowerCase().includes(type.toLowerCase()))
} 