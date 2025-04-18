import RequestClient from './request';

class Collection extends RequestClient {
    constructor(publishableKey: string, secretKey: string, isSandbox: boolean) {
        super(publishableKey, secretKey, isSandbox);
    }

    async mpesa_stk_push(data:MpesaDepositRequest): Promise<MpesaDepositResponse | undefined> {
        return await this.post<MpesaDepositResponse>('/payments/mpesa/stkpush', data);
    }

    async mpesa_check_mpesa_status(reference:string): Promise<MpesaTransactionStatusResponse | undefined> {
        return await this.get<MpesaTransactionStatusResponse>(`/payments/mpesa/check-transaction-status/${reference}`);
    }

    
}

export default Collection;

