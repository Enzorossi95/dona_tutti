'use client'

import { useState, useCallback } from 'react'

export interface ToastData {
  id: string
  message: string
  variant: 'success' | 'error'
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = useCallback((message: string, variant: 'success' | 'error', duration?: number) => {
    const id = Math.random().toString(36).substring(2, 15)
    const toast: ToastData = {
      id,
      message,
      variant,
      duration
    }

    setToasts(prev => [...prev, toast])

    return id
  }, [])

  const showSuccess = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }, [showToast])

  const showError = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }, [showToast])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    dismissToast,
    dismissAll
  }
}