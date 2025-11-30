/**
 * Tipos para el sistema de cierre de campañas y auditoría (HU-012)
 */

export type ClosureType = 'goal_reached' | 'end_date' | 'manual'

export interface CloseCampaignRequest {
  closure_type: ClosureType
  reason?: string // Obligatorio si closure_type === 'manual'
}

export interface TransparencyBreakdown {
  documentation_score: number
  activity_score: number
  goal_progress_score: number
  timeliness_score: number
  alerts_deduction_score: number
  bonus_score: number
}

export interface ClosureReport {
  id: string
  campaign_id: string
  closure_type: ClosureType
  closure_reason?: string
  closed_by?: string
  total_raised: number
  total_donors: number
  total_donations: number
  campaign_goal: number
  goal_percentage: number
  total_expenses: number
  total_receipts: number
  receipts_with_documents: number
  total_activities: number
  transparency_score: number
  transparency_breakdown: TransparencyBreakdown
  alerts_count: number
  alerts_resolved: number
  report_pdf_url?: string
  report_hash?: string
  closed_at: string
  created_at: string
}

export interface PublicAuditReport {
  campaign_id: string
  campaign_title: string
  organizer_name: string
  closed_at: string
  total_raised: number
  campaign_goal: number
  goal_percentage: number
  total_donors: number
  total_expenses: number
  transparency_score: number
  report_pdf_url?: string
}

/**
 * Helper para obtener el label del tipo de cierre
 */
export function getClosureTypeLabel(type: ClosureType): string {
  switch (type) {
    case 'goal_reached':
      return 'Meta alcanzada'
    case 'end_date':
      return 'Fecha límite'
    case 'manual':
      return 'Cierre manual'
    default:
      return type
  }
}

/**
 * Helper para obtener el color del score de transparencia
 */
export function getTransparencyScoreColor(score: number): {
  bg: string
  text: string
  label: string
} {
  if (score >= 80) {
    return { bg: 'bg-green-100', text: 'text-green-800', label: 'Excelente' }
  } else if (score >= 60) {
    return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Bueno' }
  } else if (score >= 40) {
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Regular' }
  } else {
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'Necesita mejoras' }
  }
}
