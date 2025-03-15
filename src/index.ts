import { SendMateClient } from './client';
import { SendMateAuth } from './auth';
import { SendMatePayment } from './payment';
import { SendMateConfig, AuthCredentials } from './types';

export * from './types';

// Define API URLs
const LIVE_API_URL = 'https://sendmate.finance/pay/api/v1';
const SANDBOX_API_URL = 'https://sendmate.finance/pay/sandbox/api/v1';

export class SendMate {
  private client: SendMateClient;
  public auth: SendMateAuth;
  public payment: SendMatePayment;

  constructor(config: SendMateConfig) {
    // Determine the base URL based on sandbox flag
    if (!config.baseUrl) {
      config.baseUrl = config.sandbox ? SANDBOX_API_URL : LIVE_API_URL;
    }
    
    this.client = new SendMateClient(config);
    this.auth = new SendMateAuth(this.client);
    this.payment = new SendMatePayment(this.client);
  }

  static create(
    credentials: AuthCredentials, 
    sandbox: boolean = false
  ): SendMate {
    return new SendMate({
      baseUrl: sandbox ? SANDBOX_API_URL : LIVE_API_URL,
      credentials,
      sandbox
    });
  }
} 