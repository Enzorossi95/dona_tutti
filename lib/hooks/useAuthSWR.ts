'use client';

import useSWR from 'swr';
import { authenticatedFetcher, publicFetcher } from '@/lib/auth/swrConfig';
import { useAuth } from '@/lib/auth/authContext';

// Hook for authenticated SWR requests
export const useAuthSWR = <T>(url: string | null, options = {}) => {
  const { isAuthenticated } = useAuth();
  
  return useSWR<T>(
    isAuthenticated && url ? url : null,
    authenticatedFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options
    }
  );
};

// Hook for public SWR requests (no auth required)
export const usePublicSWR = <T>(url: string | null, options = {}) => {
  return useSWR<T>(
    url,
    publicFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options
    }
  );
};

// Hook for conditional SWR (can be public or authenticated)
export const useConditionalSWR = <T>(
  url: string | null, 
  requireAuth = false, 
  options = {}
) => {
  const { isAuthenticated } = useAuth();
  
  const shouldFetch = requireAuth ? isAuthenticated && url : url;
  const fetcherToUse = requireAuth ? authenticatedFetcher : publicFetcher;
  
  return useSWR<T>(
    shouldFetch ? url : null,
    fetcherToUse,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      ...options
    }
  );
};