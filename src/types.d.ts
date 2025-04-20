declare global {
  // Checkout Types
  interface CheckoutSessionRequest {
    amount: string;
    description?: string;
    currency?: string;
    return_url?: string;
    cancel_url?: string;
    metadata?: Record<string, any>;
  }

  interface CreateCheckoutSessionResponse {
    id: string;
    session_id: string;
    url: string;
    amount: string;
    currency: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    type: 'CHECKOUT';
    user?: {
      name: string;
    };
    return_url?: string;
    cancel_url?: string;
    description?: string;
    metadata?: object;
    created_at: string;
    updated_at: string;
  }

  interface CheckoutSessionResponse {
    id: string;
    amount: string;

    description?: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    return_url?: string;
    cancel_url?: string;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
  }

  interface CheckoutSessionStatusResponse {
    id: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    amount: string;
    completed: boolean;
    failed: boolean;
    currency: string;
    created_at: string;
    updated_at: string;
  }

  // Payment Types
  interface MpesaDepositRequest {
    amount: string;
    phone_number: string;
    description?: string;
    session_id?: string;
    callback_url?: string;
  }

  interface MpesaDepositResponse {
    reference: string;
    status: string;
    message: string;
  }

  interface MpesaTransactionStatusResponse {
    reference: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    completed: boolean;
    failed: boolean;
    amount: number;
    receipt_number?: string;
    phone_number?: string;
    message: string;
  }
}

export {
  CheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CheckoutSessionResponse,
  CheckoutSessionStatusResponse,
  MpesaDepositRequest,
  MpesaDepositResponse,
  MpesaTransactionStatusResponse
};

export interface Currency {
    code: string;
    name: string;
    symbol: string;
    is_active: boolean;
}

export interface Recipient {
    id: string;
    name: string;
    phone_number: string;
    email: string | null;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    amount: string;
    type: 'CREDIT' | 'DEBIT';
    status: string;
    description: string;
    reference: string;
    is_money_in: boolean;
    is_money_out: boolean;
    currency: Currency;
    metadata: Record<string, any>;
    recipient: Recipient | null;
    recipients: Recipient[];
    created_at: string;
    updated_at: string;
}

export interface Wallet {
    id: string;
    currency: Currency;
    transactions: Transaction[];
    balance: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
} 

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}


export interface PaginationParams {
    page?: number;
    per_page?: number;
}


export interface TransactionPaginatedResponse extends PaginatedResponse<Transaction> {}