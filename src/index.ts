import { SendMateClient } from './client';
import { SendMateAuth } from './auth';
import { SendMatePayment } from './payment';
import { SendMateConfig, AuthCredentials } from './types';

export * from './types';

export class SendMate {
  private client: SendMateClient;
  public auth: SendMateAuth;
  public payment: SendMatePayment;

  constructor(config: SendMateConfig) {
    this.client = new SendMateClient(config);
    this.auth = new SendMateAuth(this.client);
    this.payment = new SendMatePayment(this.client);
  }

  static create(baseUrl: string, credentials: AuthCredentials): SendMate {
    return new SendMate({
      baseUrl,
      credentials
    });
  }
} 