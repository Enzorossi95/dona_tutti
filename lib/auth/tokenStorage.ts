import Cookies from 'js-cookie';
import { AuthTokens } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'donaayuda_access_token';
const REFRESH_TOKEN_KEY = 'donaayuda_refresh_token';
const TOKEN_EXPIRY_KEY = 'donaayuda_token_expiry';

export const tokenStorage = {
  // Store tokens in cookies with security flags
  setTokens: (tokens: AuthTokens) => {
    console.log('Storing tokens:', tokens);
    
    // Validate required fields
    if (!tokens.accessToken) {
      throw new Error('accessToken is required');
    }
    if (!tokens.refreshToken) {
      throw new Error('refreshToken is required');
    }
    if (!tokens.expiresIn && tokens.expiresIn !== 0) {
      throw new Error('expiresIn is required');
    }
    
    const expiryDate = new Date(Date.now() + tokens.expiresIn * 1000);
    
    Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
      expires: expiryDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: false // Need to access in client-side
    });
    
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
      expires: 7, // 7 days for refresh token
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: false
    });
    
    Cookies.set(TOKEN_EXPIRY_KEY, expiryDate.toISOString(), {
      expires: expiryDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: false
    });
  },

  // Get access token
  getAccessToken: (): string | null => {
    return Cookies.get(ACCESS_TOKEN_KEY) || null;
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return Cookies.get(REFRESH_TOKEN_KEY) || null;
  },

  // Check if token is expired
  isTokenExpired: (): boolean => {
    const expiryStr = Cookies.get(TOKEN_EXPIRY_KEY);
    if (!expiryStr) return true;
    
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    // Consider token expired 5 minutes before actual expiry for safety
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return now.getTime() + bufferTime >= expiry.getTime();
  },

  // Check if tokens exist
  hasTokens: (): boolean => {
    return !!(Cookies.get(ACCESS_TOKEN_KEY) && Cookies.get(REFRESH_TOKEN_KEY));
  },

  // Clear all tokens
  clearTokens: () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(TOKEN_EXPIRY_KEY);
  },

  // Get token expiry date
  getTokenExpiry: (): Date | null => {
    const expiryStr = Cookies.get(TOKEN_EXPIRY_KEY);
    return expiryStr ? new Date(expiryStr) : null;
  }
};