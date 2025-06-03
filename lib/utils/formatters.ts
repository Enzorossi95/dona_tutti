export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-AR').format(num)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-AR', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const formatPercentage = (value: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Hace menos de 1 hora'
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`
  
  return formatDate(dateString)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
} 