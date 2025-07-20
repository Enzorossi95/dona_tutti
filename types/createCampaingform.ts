export interface PaymentMethodSelection {
  payment_method_id: number;
  instructions: string;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  is_active: boolean;
}

export interface OrganizerInfo {
  id: string;
  name: string;
  phone?: string;
  email: string;
  website?: string;
}

export interface CreateCampaignForm {
    title: string,
    description: string,
    goal: string,
    location: string,
    urgency: "low" | "medium" | "high" | "critical",
    category: string, // Changed to string to store category ID
    beneficiaryName: string,
    beneficiaryAge: string,
    requiredHelp: string,
    urgencyReason: string,
    currentSituation: string,
    paymentMethods: PaymentMethodSelection[],
    organizer: OrganizerInfo,
  }