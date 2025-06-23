export interface Summary {
  result: {
    total_campaigns: number;
    total_contributors: number;
    total_goal: number;
  }
}

// Response transformada para mantener consistencia con el frontend
export interface TransformedSummary {
  totalCampaigns: number;
  activeCampaigns: number; // Por ahora será igual a totalCampaigns
  totalRaised: number; // Usaremos total_goal por ahora
  totalDonors: number;
  thisMonthRaised: number; // Por ahora no tenemos este dato
  thisMonthDonors: number; // Por ahora no tenemos este dato
} 