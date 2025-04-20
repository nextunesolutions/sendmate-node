import axios, { AxiosInstance } from 'axios';


class RequestClient  {
    private readonly prod_url = 'https://api.sendmate.finance/v1';
    private readonly sandbox_url = 'https://api-sandbox.sendmate.finance/v1';

    publishableKey: string;
    secretKey: string;
    isSandbox: boolean = false;
    API_CLIENT: AxiosInstance;

    constructor(publishableKey: string ,secretKey: string ,isSandbox: boolean) {
        this.publishableKey = publishableKey;
        this.secretKey = secretKey;
        this.isSandbox = isSandbox;
        this.API_CLIENT = axios.create({
            baseURL: this.getBaseUrl(),
            headers: this.getHeaders()
        });
    }

    private getBaseUrl() {
        return this.isSandbox ? this.sandbox_url : this.prod_url;
    }


    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.secretKey}`,
            'SENDMATE-PUBLISHABLE-KEY': this.publishableKey
        }
    }

    public async get<T>(url: string, params?: Record<string, any>): Promise<T | undefined> {
        try {
            const response = await this.API_CLIENT.get(url, { params });
            // const response = await this.API_CLIENT.get(url);
            return response.data as T;
        } catch (error: any) {
            throw new Error(
                error.response.data ?
                JSON.stringify(error.response.data) : error.message 
            );        }
    }

    public async post<T>(url: string, data: any): Promise<T | undefined> {
        try {
            const response = await this.API_CLIENT.post(url, data);
            return response.data as T;
        } catch (error: any) {
            throw new Error(
                error.response.data ?
                JSON.stringify(error.response.data) : error.message 
            );
        }
    }

    public async put<T>(url: string, data: any): Promise<T | undefined> {
        try {
            const response = await this.API_CLIENT.put(url, data);
            return response.data as T;
        } catch (error: any) {
            throw new Error(
                error.response.data ?
                JSON.stringify(error.response.data) : error.message 
            );
        }
    }

    public async delete<T>(url: string): Promise<T | undefined> {
        try {
            const response = await this.API_CLIENT.delete(url);
            return response.data as T;
        } catch (error: any) {
            throw new Error(
                error.response.data ?
                JSON.stringify(error.response.data) : error.message 
            );
        }
    }
}

export default RequestClient;


