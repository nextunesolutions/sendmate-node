// API Response Types
export interface SendMateResponse<T> {
  message: {
    code: number;
    success?: string[];
    error?: string[];
  };
  data: T;
  type: 'success' | 'error';
}

// Authentication Types
export interface AuthCredentials {
  clientId: string;
  secretId: string;
  baseUrl?: string;
}

export interface TokenResponse {
  access_token: string;
  expire_time: number;
}

// Payment Types
export interface PaymentRequest {
  amount: string;
  currency: string;
  return_url: string;
  cancel_url?: string;
}

export interface PaymentResponse {
  token: string;
  payment_url: string;
}

export interface PaymentStatusResponse {
  token: string;
  trx_id: string;
  payer: {
    username: string;
    email: string;
  };
}

// Configuration
export interface SendMateConfig {
  baseUrl?: string;
  credentials: AuthCredentials;
  sandbox?: boolean;
} 