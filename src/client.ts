import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SendMateConfig } from './types';

export class SendMateClient {
  private client: AxiosInstance;
  private config: SendMateConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: SendMateConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  async request<T>(
    method: string,
    url: string,
    data?: any,
    requiresAuth: boolean = true
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
    };

    if (requiresAuth) {
      // Check if token is expired or not set
      if (!this.accessToken || Date.now() >= this.tokenExpiry) {
        await this.refreshToken();
      }
      
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
    }

    try {
      const response = await this.client(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`SendMate API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async refreshToken(): Promise<void> {
    const response = await this.request<any>(
      'POST',
      '/authentication/token',
      {
        client_id: this.config.credentials.clientId,
        secret_id: this.config.credentials.secretId,
      },
      false
    );

    if (response.type === 'success' && response.data.access_token) {
      this.accessToken = response.data.access_token;
      // Set expiry time (in milliseconds) - subtract 30 seconds for safety
      this.tokenExpiry = Date.now() + (response.data.expire_time * 1000) - 30000;
    } else {
      throw new Error('Failed to obtain access token');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getConfig(): SendMateConfig {
    return this.config;
  }
} 