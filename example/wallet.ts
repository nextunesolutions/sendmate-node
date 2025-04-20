import { WalletClient } from '../src';
import dotenv from 'dotenv';

dotenv.config();

const wallet = new WalletClient(
    process.env.PUBLISHABLE_KEY as string,
    process.env.SECRET_KEY as string,
    process.env.IS_SANDBOX === 'true'
);

async function main() {
    try {
        // Get all wallets
        const wallets = await wallet.get_wallets();
        console.log('All Wallets:', wallets);

        if (wallets && wallets.length > 0) {
            const firstWallet = wallets[0];

            // Get a specific wallet
            const walletDetails = await wallet.get_wallet(firstWallet.id);
            console.log('Wallet Details:', walletDetails);

            // Get wallet transactions
            const transactions = await wallet.get_wallet_transactions(firstWallet.id, {
                page: 1,
                limit: 10
            });
            console.log('Wallet Transactions:', transactions);

            // Set wallet as default
            const defaultWallet = await wallet.set_default_wallet(firstWallet.id);
            console.log('Default Wallet:', defaultWallet);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 