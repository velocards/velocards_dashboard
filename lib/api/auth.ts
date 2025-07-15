import { apiClient, ApiResponse } from './client';

// Request types
export interface LoginRequest {
  email: string;
  password: string;
  captchaToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  captchaToken?: string;
}

// Response types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  emailVerified: boolean; // Backend confirmed this is returned
  kycStatus: 'pending' | 'approved' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'closed';
  virtualBalance: number;
  tier: {
    id: number;
    tierName: string;
    monthlyCardLimit: number;
    transactionLimit: number;
    benefits: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

// Auth API service
export const authApi = {
  // Login user
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },
  
  // Register new user
  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data);
    return response.data;
  },
  
  // Logout user
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout');
    return response.data;
  },
  
  // Refresh token
  refresh: async (): Promise<ApiResponse<{ tokens: AuthTokens }>> => {
    const response = await apiClient.post<ApiResponse<{ tokens: AuthTokens }>>('/auth/refresh');
    return response.data;
  },
  
  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },
  
  // Request password reset
  forgotPassword: async (email: string, captchaToken?: string | null): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { 
      email,
      ...(captchaToken && { captchaToken })
    });
    return response.data;
  },
  
  // Validate reset token
  validateResetToken: async (token: string): Promise<ApiResponse<{ valid: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ valid: boolean }>>('/auth/validate-reset-token', { token });
    return response.data;
  },
  
  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, password });
    return response.data;
  },
  
  // Change password (for logged-in users)
  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/change-password', { 
      oldPassword, 
      newPassword 
    });
    return response.data;
  },
  
  // Verify email with token
  verifyEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', { token });
    return response.data;
  },
  
  // Resend verification email
  resendVerification: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email });
    return response.data;
  },
  
  // Get verification status (authenticated users)
  getVerificationStatus: async (): Promise<ApiResponse<{ email_verified: boolean; email: string }>> => {
    const response = await apiClient.get<ApiResponse<{ email_verified: boolean; email: string }>>('/auth/verification-status');
    return response.data;
  },
};