import { SendMateClient } from './client';
import { 
  PaymentRequest, 
  PaymentResponse, 
  PaymentStatusResponse, 
  SendMateResponse 
} from './types';

export class SendMatePayment {
  private client: SendMateClient;

  constructor(client: SendMateClient) {
    this.client = client;
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    const response = await this.client.request<SendMateResponse<PaymentResponse>>(
      'POST',
      '/payment/create',
      request
    );

    if (response.type === 'error') {
      throw new Error(`Payment initiation failed: ${response.message.error?.join(', ')}`);
    }

    return response.data;
  }

  async checkPaymentStatus(token: string): Promise<PaymentStatusResponse> {
    const response = await this.client.request<SendMateResponse<PaymentStatusResponse>>(
      'GET',
      `/payment/status/${token}`
    );

    if (response.type === 'error') {
      throw new Error(`Payment status check failed: ${response.message.error?.join(', ')}`);
    }

    return response.data;
  }
} 