import { Donation } from '@/types/donation'

/**
 * Opens a receipt PDF in a new browser tab
 * @param receiptUrl - The S3 URL of the receipt PDF
 * @param donationId - The donation ID (for logging purposes)
 */
export const downloadReceipt = (receiptUrl: string, donationId: string): void => {
  if (!receiptUrl) {
    console.error('No receipt URL provided for donation:', donationId)
    return
  }
  
  // Open receipt in new tab
  window.open(receiptUrl, '_blank', 'noopener,noreferrer')
}

/**
 * Checks if a donation receipt is ready to be downloaded
 * @param donation - The donation object
 * @returns true if the receipt is available for download
 */
export const isReceiptReady = (donation: Donation): boolean => {
  return donation.status === 'completed' && !!donation.receipt_url
}

/**
 * Checks if a donation receipt is currently being generated
 * @param donation - The donation object
 * @returns true if the receipt is being generated
 */
export const isReceiptGenerating = (donation: Donation): boolean => {
  return donation.status === 'completed' && !donation.receipt_url
}

/**
 * Gets a user-friendly message about the receipt status
 * @param donation - The donation object
 * @returns A message describing the receipt status
 */
export const getReceiptStatusMessage = (donation: Donation): string => {
  if (isReceiptReady(donation)) {
    return 'Comprobante disponible'
  }
  
  if (isReceiptGenerating(donation)) {
    return 'Tu comprobante se está generando...'
  }
  
  if (donation.status === 'pending') {
    return 'El comprobante se generará cuando se confirme el pago'
  }
  
  if (donation.status === 'failed') {
    return 'No hay comprobante disponible para pagos fallidos'
  }
  
  if (donation.status === 'refunded') {
    return 'Este pago fue reembolsado'
  }
  
  return 'No hay comprobante disponible'
}

