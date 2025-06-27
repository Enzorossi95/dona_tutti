import { User, Permission } from '@/types/auth';

export const authUtils = {
  // Parse JWT token (basic parsing without verification)
  parseJWT: (token: string) => {
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
      return null;
    }
  },

  // Check if user has specific permission
  hasPermission: (user: User | null, resource: string, action: string): boolean => {
    if (!user || !user.role || !user.role.permissions) return false;
    
    return user.role.permissions.some(
      (permission: Permission) => 
        permission.resource === resource && permission.action === action
    );
  },

  // Check if user has specific role
  hasRole: (user: User | null, roleName: string): boolean => {
    if (!user || !user.role) return false;
    return user.role.name.toLowerCase() === roleName.toLowerCase();
  },

  // Check if user is admin
  isAdmin: (user: User | null): boolean => {
    return authUtils.hasRole(user, 'admin');
  },

  // Format API error message
  formatApiError: (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.response?.data?.errors) {
      const errors = error.response.data.errors;
      const firstError = Object.values(errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0] as string;
      }
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'Ha ocurrido un error inesperado';
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  isValidPassword: (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      };
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos una letra minúscula'
      };
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos una letra mayúscula'
      };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: 'La contraseña debe contener al menos un número'
      };
    }
    
    return {
      isValid: true,
      message: 'Contraseña válida'
    };
  }
};