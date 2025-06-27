import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiError
} from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9999';

// Helper function to parse JWT payload
const parseJWTPayload = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
};

class AuthApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AuthApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthApiError(
      errorData.message || 'Error en la solicitud',
      response.status,
      errorData.errors
    );
  }
  return response.json();
};

export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await handleApiResponse(response);
      console.log('Login response:', data);
      
      // Get user info with the access token from /user/me endpoint
      let userData;
      try {
        userData = await authApi.getCurrentUser(data.token.access_token);
      } catch (userError) {
        console.warn('Could not fetch user data from /user/me:', userError);
        
        // Fallback: Parse JWT token to get user info
        const tokenPayload = parseJWTPayload(data.token.access_token);
        console.log('JWT Payload fallback:', tokenPayload);
        
        // Use data from JWT token as fallback
        userData = {
          id: tokenPayload.sub || '',
          email: credentials.email,
          firstName: credentials.email.split('@')[0],
          lastName: '',
          role: { 
            id: tokenPayload.role_id || '', 
            name: tokenPayload.role || 'guest', 
            permissions: [] 
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      // Map backend response to frontend structure
      const mappedResponse: LoginResponse = {
        user: userData,
        tokens: {
          accessToken: data.token.access_token,
          refreshToken: data.token.access_token, // Use access token as refresh token for now
          expiresIn: data.token.expires_in,
          tokenType: data.token.token_type
        }
      };
      
      console.log('Mapped response:', mappedResponse);
      return mappedResponse;
    } catch (error) {
      console.error('Login API Error:', error);
      throw new AuthApiError(
        'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.',
        0
      );
    }
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      console.log('Attempting register to:', `${API_BASE_URL}/auth/register`);
      
      // Map frontend data to backend expected structure
      const backendData = {
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password
      };
      
      console.log('Sending to backend:', backendData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const data = await handleApiResponse(response);
      console.log('Register response:', data);
      
      // Parse JWT token to get user info if we have a token
      let tokenPayload: any = {};
      if (data.token?.access_token) {
        tokenPayload = parseJWTPayload(data.token.access_token);
        console.log('JWT Payload from register:', tokenPayload);
      }
      
      // Map backend response to frontend structure
      const mappedResponse: RegisterResponse = {
        user: {
          id: data.id || tokenPayload.sub || '',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: { 
            id: tokenPayload.role_id || '', 
            name: tokenPayload.role || 'guest', 
            permissions: [] 
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        tokens: {
          accessToken: data.token?.access_token || '',
          refreshToken: data.token?.access_token || '', // Use access token as refresh token for now
          expiresIn: data.token?.expires_in || 3600,
          tokenType: data.token?.token_type || 'Bearer'
        }
      };
      
      console.log('Mapped register response:', mappedResponse);
      return mappedResponse;
    } catch (error) {
      console.error('Register API Error:', error);
      
      // Re-throw AuthApiError with original message if it's already an AuthApiError
      if (error instanceof AuthApiError) {
        throw error;
      }
      
      throw new AuthApiError(
        'No se pudo registrar el usuario. Verifica la información e intenta de nuevo.',
        0
      );
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleApiResponse(response);
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        newPassword
      }),
    });

    return handleApiResponse(response);
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    return handleApiResponse(response);
  },

  // Get current user
  getCurrentUser: async (accessToken: string) => {
    try {
      console.log('Fetching current user from:', `${API_BASE_URL}/users/me`);
      
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await handleApiResponse(response);
      console.log('User data from /user/me:', data);
      
      // Map backend response to frontend User interface
      const mappedUser = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: {
          id: data.role.id,
          name: data.role.name,
          permissions: [] // Will be empty for now
        },
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      console.log('Mapped user data:', mappedUser);
      return mappedUser;
    } catch (error) {
      console.error('getCurrentUser API Error:', error);
      throw error;
    }
  },

  // Logout (if backend has logout endpoint)
  logout: async (accessToken: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Logout can fail, but we should still clear local tokens
      console.warn('Logout API call failed:', error);
    }
  }
};