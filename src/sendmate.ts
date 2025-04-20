import RequestClient from './request';
import CheckOut from './checkout';
import Collection from './collection';
import WalletClient from './wallet';

class SendMateService extends RequestClient {
    public checkout: CheckOut;
    public collection: Collection;
    public wallet: WalletClient;

    constructor(publishableKey: string, secretKey: string, isSandbox: boolean) {
        super(publishableKey, secretKey, isSandbox);
        this.checkout = new CheckOut(publishableKey, secretKey, isSandbox);
        this.collection = new Collection(publishableKey, secretKey, isSandbox);
        this.wallet = new WalletClient(publishableKey, secretKey, isSandbox);
    }
}

export default SendMateService;