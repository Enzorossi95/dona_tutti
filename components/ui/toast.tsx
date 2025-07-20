'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        success: "bg-green-50 text-green-800 border-green-200",
        error: "bg-red-50 text-red-800 border-red-200",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export interface ToastProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof toastVariants> {
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, onClose, autoClose = true, duration = 4000, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useEffect(() => {
      // Trigger animation on mount
      setIsVisible(true)

      if (autoClose && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => {
            onClose?.()
          }, 300) // Wait for exit animation
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [autoClose, duration, onClose])

    const handleClose = () => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300)
    }

    const Icon = variant === "success" ? CheckCircle : XCircle

    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{children}</div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
)

Toast.displayName = "Toast"

export { Toast, toastVariants }