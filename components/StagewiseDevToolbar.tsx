"use client"

import { StagewiseToolbar } from '@stagewise/toolbar-next'
import { ReactPlugin } from '@stagewise-plugins/react'

// Importar configuración del archivo externo si existe
const getConfig = () => {
  const baseConfig = {
    plugins: [ReactPlugin],
    workspace: {
      name: 'donate_me',
      path: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
    editor: {
      type: 'cursor',
    },
    debug: process.env.NODE_ENV === 'development'
  }

  return baseConfig
}

export function StagewiseDevToolbar() {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const config = getConfig()

  // Agregar logging para debug
  if (typeof window !== 'undefined') {
    console.log('Stagewise Toolbar loading with config:', config)
    console.log('Current environment:', process.env.NODE_ENV)
    console.log('Window location:', window.location.href)
  }

  return <StagewiseToolbar config={config} />
} 