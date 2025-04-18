import RequestClient from './request';
import {
    CheckoutSessionRequest,
    CreateCheckoutSessionResponse,
    CheckoutSessionResponse,
    CheckoutSessionStatusResponse
} from './types';
class CheckOut extends RequestClient {
    constructor(publishableKey: string, secretKey: string, isSandbox: boolean) {
        super(publishableKey, secretKey, isSandbox);
    }

    async create_checkout_session(data:CheckoutSessionRequest): Promise<CreateCheckoutSessionResponse | undefined> {
        return await this.post<CreateCheckoutSessionResponse>('/payments/checkout', data);
    }


    async get_sessions(): Promise<CheckoutSessionResponse[] | undefined> {
        return await this.get<CheckoutSessionResponse[]>('/payments/sessions');
    }

  
    async get_checkout_session(session_id:string): Promise<CheckoutSessionResponse | undefined> {
        return await this.get<CheckoutSessionResponse>(`/payments/checkout/${session_id}`);
    }

    async get_checkout_session_status(session_id:string): Promise<CheckoutSessionStatusResponse | undefined> {
        return await this.get<CheckoutSessionStatusResponse>(`/payments/checkout/${session_id}/verify`);
    }

}

export default CheckOut;


