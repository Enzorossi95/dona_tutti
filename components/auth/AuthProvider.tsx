'use client';

import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext } from '@/lib/auth/authContext';
import { authApi } from '@/lib/auth/authApi';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { authUtils } from '@/lib/auth/authUtils';
import {
  User,
  AuthState,
  LoginRequest,
  RegisterRequest,
  AuthContextType
} from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = tokenStorage.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(refreshTokenValue);
      
      // Update only access token
      const currentTokens = {
        accessToken: response.accessToken,
        refreshToken: refreshTokenValue,
        expiresIn: response.expiresIn,
        tokenType: 'Bearer'
      };
      
      tokenStorage.setTokens(currentTokens);

      // Get updated user data
      const userData = await authApi.getCurrentUser(response.accessToken);
      setState(prev => ({
        ...prev,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenStorage.clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      throw error;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenStorage.getAccessToken();
        
        if (!accessToken || tokenStorage.isTokenExpired()) {
          // Try to refresh token
          const refreshTokenValue = tokenStorage.getRefreshToken();
          if (refreshTokenValue) {
            await refreshToken();
            return;
          }
          
          // No valid tokens, user is not authenticated
          setState(prev => ({
            ...prev,
            isLoading: false,
            isAuthenticated: false,
            user: null
          }));
          return;
        }

        // Get current user with existing token
        const userData = await authApi.getCurrentUser(accessToken);
        setState(prev => ({
          ...prev,
          user: userData,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

      } catch (error) {
        console.error('Auth initialization failed:', error);
        tokenStorage.clearTokens();
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: authUtils.formatApiError(error)
        }));
      }
    };

    initializeAuth();
  }, [refreshToken]);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.login(credentials);
      
      // Store tokens
      tokenStorage.setTokens(response.tokens);
      
      setState(prev => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authUtils.formatApiError(error)
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await authApi.register(userData);
      
      // Only store tokens if we have a valid access token
      if (response.tokens.accessToken) {
        tokenStorage.setTokens(response.tokens);
        
        setState(prev => ({
          ...prev,
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
      } else {
        // Registration successful but no token provided
        // User needs to login separately
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        }));
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authUtils.formatApiError(error)
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (accessToken) {
        await authApi.logout(accessToken);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      tokenStorage.clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await authApi.forgotPassword(email);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authUtils.formatApiError(error)
      }));
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await authApi.resetPassword(token, newPassword);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: authUtils.formatApiError(error)
      }));
      throw error;
    }
  }, []);

  const hasPermission = useCallback((resource: string, action: string): boolean => {
    return authUtils.hasPermission(state.user, resource, action);
  }, [state.user]);

  const hasRole = useCallback((roleName: string): boolean => {
    return authUtils.hasRole(state.user, roleName);
  }, [state.user]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};