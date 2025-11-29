import { usePublicSWR } from '@/lib/hooks/useAuthSWR'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999'

export interface Category {
  id: string
  created_at: string
  name: string
  description: string
}

export function useCategories() {
  const { data, error, isLoading } = usePublicSWR<Category[]>(`${API_URL}/api/categories`)

  return {
    categories: data || [],
    error,
    isLoading
  }
}