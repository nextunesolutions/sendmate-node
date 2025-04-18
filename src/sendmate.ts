import RequestClient from './request';
import CheckOut from './checkout';
import Collection from './collection';

class SendMateService extends RequestClient {
    public checkout: CheckOut;
    public collection: Collection;

    constructor(publishableKey: string, secretKey: string, isSandbox: boolean) {
        super(publishableKey, secretKey, isSandbox);
        this.checkout = new CheckOut(publishableKey, secretKey, isSandbox);
        this.collection = new Collection(publishableKey, secretKey, isSandbox);
    }
}

export default SendMateService;