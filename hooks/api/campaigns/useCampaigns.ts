'use client';

import { useAuthSWR } from '@/lib/hooks/useAuthSWR';
import { Campaign } from '@/types/campaign';

export interface UseCampaignsOptions {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
}

export function useCampaigns(options: UseCampaignsOptions = {}) {
  const {
    data: campaigns,
    error,
    isLoading,
    isValidating,
    mutate: refetch
  } = useAuthSWR<Campaign[]>(
    '/campaigns',
    {
      revalidateOnFocus: options.revalidateOnFocus ?? false,
      revalidateOnReconnect: options.revalidateOnReconnect ?? true,
      refreshInterval: options.refreshInterval ?? 0,
      ...options
    }
  );

  // Transform data to add calculated fields
  const transformedCampaigns = campaigns?.map(campaign => ({
    ...campaign,
    // Calculate days left from end_date
    daysLeft: campaign.end_date 
      ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 0,
    // Set default values for optional fields
    raised: campaign.raised ?? 0,
    donors: campaign.donors ?? 0,
    // Use created_at for lastUpdate if not provided
    lastUpdate: campaign.lastUpdate ?? new Date(campaign.created_at).toLocaleDateString('es-AR')
  }));

  return {
    campaigns: transformedCampaigns,
    error,
    isLoading,
    isValidating,
    refetch,
    isEmpty: !isLoading && !transformedCampaigns?.length
  };
}