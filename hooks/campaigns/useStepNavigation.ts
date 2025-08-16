import { useState, useCallback } from 'react'

interface UseStepNavigationProps {
  totalSteps: number
  validateCurrentStep: (step: number) => boolean
  onStepChange?: (newStep: number, previousStep: number) => void
  clearErrors?: () => void
  clearTouchedFields?: () => void
  markFieldsAsTouched?: (fields: string[]) => void
  getFieldsByStep?: (step: number) => string[]
}

export function useStepNavigation({
  totalSteps,
  validateCurrentStep,
  onStepChange,
  clearErrors,
  clearTouchedFields,
  markFieldsAsTouched,
  getFieldsByStep,
}: UseStepNavigationProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const progressPercentage = (currentStep / totalSteps) * 100

  const canGoToStep = useCallback((targetStep: number): boolean => {
    // Can always go back
    if (targetStep < currentStep) {
      return true
    }

    // To go forward, must validate all steps up to target
    for (let step = currentStep; step < targetStep; step++) {
      if (!validateCurrentStep(step)) {
        return false
      }
    }

    return true
  }, [currentStep, validateCurrentStep])

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep < 1 || targetStep > totalSteps) {
      return false
    }

    const previousStep = currentStep

    if (targetStep < currentStep) {
      // Going backward - clear errors and touched fields
      clearErrors?.()
      clearTouchedFields?.()
      setCurrentStep(targetStep)
      onStepChange?.(targetStep, previousStep)
      return true
    }

    if (targetStep > currentStep) {
      // Going forward - validate current step first
      const isValid = validateCurrentStep(currentStep)
      
      if (isValid) {
        // Clear errors and touched fields before advancing
        clearErrors?.()
        clearTouchedFields?.()
        setCurrentStep(targetStep)
        onStepChange?.(targetStep, previousStep)
        return true
      } else {
        // Mark all current step fields as touched to show errors
        if (markFieldsAsTouched && getFieldsByStep) {
          const currentFields = getFieldsByStep(currentStep)
          markFieldsAsTouched(currentFields)
        }
        return false
      }
    }

    // Same step - no change needed
    return true
  }, [currentStep, totalSteps, validateCurrentStep, clearErrors, clearTouchedFields, markFieldsAsTouched, getFieldsByStep, onStepChange])

  const nextStep = useCallback(() => {
    const isValid = validateCurrentStep(currentStep)
    
    if (isValid && currentStep < totalSteps) {
      // Clear errors and touched fields before advancing
      clearErrors?.()
      clearTouchedFields?.()
      const previousStep = currentStep
      setCurrentStep(currentStep + 1)
      onStepChange?.(currentStep + 1, previousStep)
      return true
    } else if (!isValid) {
      // Mark all current step fields as touched to show errors
      if (markFieldsAsTouched && getFieldsByStep) {
        const currentFields = getFieldsByStep(currentStep)
        markFieldsAsTouched(currentFields)
      }
      return false
    }
    
    return false
  }, [currentStep, totalSteps, validateCurrentStep, clearErrors, clearTouchedFields, markFieldsAsTouched, getFieldsByStep, onStepChange])

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      // Clear errors and touched fields when going back
      clearErrors?.()
      clearTouchedFields?.()
      const previousStep = currentStep
      setCurrentStep(currentStep - 1)
      onStepChange?.(currentStep - 1, previousStep)
      return true
    }
    return false
  }, [currentStep, clearErrors, clearTouchedFields, onStepChange])

  const resetSteps = useCallback(() => {
    clearErrors?.()
    clearTouchedFields?.()
    const previousStep = currentStep
    setCurrentStep(1)
    onStepChange?.(1, previousStep)
  }, [currentStep, clearErrors, clearTouchedFields, onStepChange])

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  const hasNextStep = currentStep < totalSteps
  const hasPrevStep = currentStep > 1

  const getStepStatus = useCallback((step: number): 'completed' | 'current' | 'upcoming' => {
    if (step < currentStep) return 'completed'
    if (step === currentStep) return 'current'
    return 'upcoming'
  }, [currentStep])

  const isStepCompleted = useCallback((step: number): boolean => {
    return step < currentStep
  }, [currentStep])

  const isStepActive = useCallback((step: number): boolean => {
    return step === currentStep
  }, [currentStep])

  return {
    currentStep,
    progressPercentage,
    nextStep,
    prevStep,
    goToStep,
    canGoToStep,
    resetSteps,
    isFirstStep,
    isLastStep,
    hasNextStep,
    hasPrevStep,
    getStepStatus,
    isStepCompleted,
    isStepActive,
    totalSteps,
  }
}