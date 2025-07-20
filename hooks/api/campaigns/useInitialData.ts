import { PaymentMethod } from "@/types/createCampaingform"
import { useEffect } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useInitialData(userId?: string) {
    if (!userId) return {
        isLoading: false,
        paymentMethods: [],
        organizer: null,
        error: null,
    }
    
    const { data: paymentMethods, error: pmError, isLoading: pmLoading } = useSWR(
        userId ? "http://localhost:9999/api/payment-methods" : null,
        fetcher
    )

    // Obtener datos del organizador
    const { data: organizerData, error: orgError, isLoading: orgLoading } = useSWR(
        userId ? `http://localhost:9999/api/organizers?user_id=${userId}` : null,
        fetcher
    )

    const activePaymentMethods = paymentMethods?.filter((pm: PaymentMethod) => pm.is_active) || []
    
    // Only log when payment methods actually change, not on every render
    useEffect(() => {
        if (activePaymentMethods.length > 0) {
            console.log('Active payment methods loaded:', activePaymentMethods)
        }
    }, [activePaymentMethods.length]) // Only depend on length to avoid deep comparison
    
    return {
        isLoading: pmLoading || orgLoading,
        paymentMethods: activePaymentMethods,
        organizer: organizerData?.[0] || null,
        error: pmError || orgError,
    }
}
