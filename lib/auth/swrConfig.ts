'use client';

import { tokenStorage } from './tokenStorage';
import { authApi } from './authApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

// Authenticated fetcher for SWR
export const authenticatedFetcher = async (url: string) => {
  let accessToken = tokenStorage.getAccessToken();
  
  // Check if token is expired and try to refresh
  if (tokenStorage.isTokenExpired()) {
    const refreshToken = tokenStorage.getRefreshToken();
    const currentAccessToken = tokenStorage.getAccessToken(); // Get current token even if expired
    
    if (refreshToken) {
      try {
        // Pass current access token for authorization header
        const response = await authApi.refreshToken(refreshToken, currentAccessToken || undefined);
        const newTokens = {
          accessToken: response.accessToken,
          refreshToken: refreshToken,
          expiresIn: response.expiresIn,
          tokenType: 'Bearer'
        };
        tokenStorage.setTokens(newTokens);
        accessToken = response.accessToken;
      } catch (error) {
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    } else {
      // No refresh token, redirect to login
      tokenStorage.clearTokens();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
  }

  // Construct full URL if relative
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // Handle different response types
  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid, try to refresh once more
      const refreshToken = tokenStorage.getRefreshToken();
      const expiredAccessToken = tokenStorage.getAccessToken(); // Get the expired token
      
      if (refreshToken) {
        try {
          // Pass expired access token for authorization header
          const refreshResponse = await authApi.refreshToken(refreshToken, expiredAccessToken || undefined);
          const newTokens = {
            accessToken: refreshResponse.accessToken,
            refreshToken: refreshToken,
            expiresIn: refreshResponse.expiresIn,
            tokenType: 'Bearer'
          };
          tokenStorage.setTokens(newTokens);
          
          // Retry original request with new token
          const retryResponse = await fetch(fullUrl, {
            headers: {
              'Authorization': `Bearer ${refreshResponse.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        } catch (refreshError) {
          tokenStorage.clearTokens();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
      } else {
        tokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    }
    
    if (response.status === 403) {
      throw new Error('No tienes permisos para acceder a este recurso');
    }
    
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Public fetcher for non-authenticated endpoints
export const publicFetcher = async (url: string) => {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Default fetcher (public)
export const fetcher = publicFetcher;

// SWR configuration with error handling
export const swrConfig = {
  onError: (error: Error) => {
    console.error('SWR Error:', error);
    
    // Show user-friendly error messages
    if (error.message.includes('Authentication required')) {
      // Already handled by redirecting to login
      return;
    }
    
    if (error.message.includes('No tienes permisos')) {
      // You can show a toast or notification here
      console.warn('Permission denied:', error.message);
      return;
    }
    
    // Handle other errors
    console.error('API Error:', error.message);
  },
  
  onErrorRetry: (error: Error, key: string, config: any, revalidate: any, { retryCount }: any) => {
    // Don't retry on 401 or 403
    if (error.message.includes('Authentication required') || 
        error.message.includes('No tienes permisos')) {
      return;
    }
    
    // Don't retry more than 3 times
    if (retryCount >= 3) return;
    
    // Retry after 5 seconds
    setTimeout(() => revalidate({ retryCount }), 5000);
  }
};