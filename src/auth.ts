import { SendMateClient } from './client';
import { SendMateResponse, TokenResponse } from './types';

export class SendMateAuth {
  private client: SendMateClient;

  constructor(client: SendMateClient) {
    this.client = client;
  }

  async getToken(): Promise<TokenResponse> {
    const response = await this.client.request<SendMateResponse<TokenResponse>>(
      'POST',
      '/authentication/token',
      {
        client_id: this.client.getConfig().credentials.clientId,
        secret_id: this.client.getConfig().credentials.secretId,
      },
      false
    );

    if (response.type === 'error') {
      throw new Error(`Authentication failed: ${response.message.error?.join(', ')}`);
    }

    return response.data;
  }
} 