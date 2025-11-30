import { Campaign } from '@/types/campaign'

/**
 * Determines if the contract button should be shown for a campaign
 * @param campaign - The campaign object
 * @returns true if the campaign is in draft or pending_approval status
 */
export function shouldShowContractButton(campaign: Campaign): boolean {
  return campaign.status === 'draft' || campaign.status === 'pending_approval'
}

/**
 * Gets the appropriate button text based on campaign status
 * @param campaign - The campaign object
 * @returns Button text string
 */
export function getContractButtonText(campaign: Campaign): string {
  if (campaign.status === 'draft') {
    return 'Firmar Contrato'
  }
  return 'Ver Contrato'
}

/**
 * Gets the badge text for contract status
 * @param campaign - The campaign object
 * @returns Badge text or null if no badge should be shown
 */
export function getContractStatusBadge(campaign: Campaign): string | null {
  if (campaign.status === 'draft') {
    return 'Pendiente de Contrato'
  }
  if (campaign.status === 'pending_approval') {
    return 'Pendiente de Aprobación'
  }
  return null
}

