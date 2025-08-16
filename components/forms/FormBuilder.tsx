'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera } from "lucide-react"

export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'file' | 'date'
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  rows?: number
}

export interface FormBuilderProps {
  title: string
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void
  onCancel: () => void
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  onChange?: (data: Record<string, unknown>) => void
}

export function FormBuilder({
  title,
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  isLoading = false,
  onChange
}: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleInputChange = (name: string, value: any) => {
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    onChange?.(newData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        )

      case 'select':
        return (
          <Select value={value} onValueChange={(val: any) => handleInputChange(field.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {field.name.includes('image') ? (
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            )}
            <p className="text-sm text-gray-600">
              {field.placeholder || "Arrastra archivos aquí o haz clic para seleccionar"}
            </p>
          </div>
        )

      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {fields.map((field) => (
        <div key={field.name} className={field.type === 'select' && field.name.includes('grid') ? 'grid grid-cols-2 gap-4' : ''}>
          <div>
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderField(field)}
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}