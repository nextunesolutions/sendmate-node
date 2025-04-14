import RequestClient from './request';
import CheckOut from './checkout';
import Collection from './collection';
class SendMateService extends RequestClient {
    constructor(publishableKey: string, secretKey: string, isSandbox: boolean) {
        super(publishableKey, secretKey, isSandbox);
    }

    checkout(){
        return new CheckOut(this.publishableKey, this.secretKey, this.isSandbox);
    }

    collection(){
        return new Collection(this.publishableKey, this.secretKey, this.isSandbox);
    }
}

export default SendMateService;