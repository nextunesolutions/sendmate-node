import express from 'express';
import dotenv from 'dotenv';
import client from '../client';

dotenv.config();

const router = express.Router();


// Get all wallets
router.get('/', async (req, res) => {
    try {
        const wallets = await client.wallet.get_wallets();
        if (!wallets) {
            return res.status(404).render('error', { 
                message: 'No wallets found',
                title: 'Error - No Wallets'
            });
        }

        // Get transactions for the first wallet to display in the overview
        const transactions = wallets.length > 0 ? 
            (await client.wallet.get_wallet_transactions(
                wallets[0].id, 
                { per_page: 10 , page:1 }
            ))?.results || [] : 
            [];

        res.render('wallet', { 
            wallets,
            transactions,
            title: 'My Wallets'
        });
    } catch (error) {
        console.error('Error fetching wallets:', error);
        res.status(500).render('error', { 
            message: 'Error fetching wallets',
            title: 'Error - Fetching Wallets'
        });
    }
});

// Get wallet details
router.get('/:id', async (req, res) => {
    try {
        const walletDetails = await client.wallet.get_wallet(req.params.id);
        if (!walletDetails) {
            return res.status(404).render('error', { 
                message: 'Wallet not found',
                title: 'Error - Wallet Not Found'
            });
        }

        res.render('wallet-detail', { 
            wallet: walletDetails,
            title: `${walletDetails.currency.name} Wallet`
        });
    } catch (error) {
        console.error('Error fetching wallet details:', error);
        res.status(500).render('error', { 
            message: 'Error fetching wallet details',
            title: 'Error - Fetching Wallet Details'
        });
    }
});

// Set default wallet
router.post('/:id/set-default', async (req, res) => {
    try {
        const result = await client.wallet.set_default_wallet(req.params.id);
        if (!result) {
            return res.status(400).render('error', { 
                message: 'Failed to set default wallet',
                title: 'Error - Setting Default Wallet'
            });
        }

        res.redirect('/wallets');
    } catch (error) {
        console.error('Error setting default wallet:', error);
        res.status(500).render('error', { 
            message: 'Error setting default wallet',
            title: 'Error - Setting Default Wallet'
        });
    }
});

export default router; 