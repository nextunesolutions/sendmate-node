import RequestClient from './request';
import { PaginationParams, Wallet, TransactionPaginatedResponse } from './types';

class WalletClient extends RequestClient {
    constructor(publishableKey: string, secretKey: string, isSandbox: boolean) {
        super(publishableKey, secretKey, isSandbox);
    }

    /**
     * Get all wallets for the authenticated user
     * @returns Promise<Wallet[] | undefined>
     */
    async get_wallets(): Promise<Wallet[] | undefined> {
        return await this.get<Wallet[]>('/payments/wallets');
    }

    /**
     * Get a specific wallet by ID
     * @param walletId - The ID of the wallet to retrieve
     * @returns Promise<Wallet | undefined>
     */
    async get_wallet(walletId: string): Promise<Wallet | undefined> {
        return await this.get<Wallet>(`/payments/wallets/${walletId}`);
    }

    /**
     * Get transactions for a specific wallet
     * @param walletId - The ID of the wallet
     * @param params - Optional query parameters (page, limit, etc.)
     * @returns Promise<Wallet | undefined>
     */
    async get_wallet_transactions(walletId: string, params?: PaginationParams): Promise<TransactionPaginatedResponse | undefined> {
        return await this.get<TransactionPaginatedResponse>(`/payments/wallets/${walletId}/transactions`, params);
    }

    /**
     * Set a wallet as default
     * @param walletId - The ID of the wallet to set as default
     * @returns Promise<Wallet | undefined>
     */
    async set_default_wallet(walletId: string): Promise<Wallet | undefined> {
        return await this.post<Wallet>(`/payments/wallets/${walletId}/set-default`, {});
    }
}

export default WalletClient;
