import { usePublicSWR } from '@/lib/hooks/useAuthSWR'

export interface Category {
  id: string
  created_at: string
  name: string
  description: string
}

export function useCategories() {
  const { data, error, isLoading } = usePublicSWR<Category[]>('/categories')

  return {
    categories: data || [],
    error,
    isLoading
  }
}