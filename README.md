# SendMate Node.js SDK

Official Node.js SDK for the SendMate API. This package provides a simple and efficient way to integrate SendMate's payment processing and wallet management capabilities into your Node.js applications.

## Installation

Choose your preferred package manager:

```bash
# Using npm
npm install sendmate-node

# Using yarn
yarn add sendmate-node

# Using pnpm
pnpm add sendmate-node
```

## Quick Start

### Basic Setup

```typescript
import { SendMateClient } from 'sendmate-node';

// Initialize the client
const client = new SendMateClient(
    process.env.PUBLISHABLE_KEY,
    process.env.SECRET_KEY,
    process.env.IS_SANDBOX === 'true'
);
```

### Environment Variables

```env
PUBLISHABLE_KEY=your_publishable_key
SECRET_KEY=your_secret_key
IS_SANDBOX=true  # Set to false for production
```

## Examples

### 1. Wallet Management

```typescript
// Get all wallets
const wallets = await client.wallet.get_wallets();

// Get wallet details
const walletDetails = await client.wallet.get_wallet('wallet_id');

// Get wallet transactions
const transactions = await client.wallet.get_wallet_transactions('wallet_id', {
    limit: 10,
    page: 1
});

// Set default wallet
const result = await client.wallet.set_default_wallet('wallet_id');
```

### 2. M-Pesa STK Push

```typescript
// Initiate STK Push
const stkPush = await client.mpesa.stk_push({
    phone_number: '254712345678',
    amount: 100,
    currency: 'KES',
    description: 'Payment for goods',
    callback_url: 'https://your-domain.com/callback'
});

// Check STK Push status
const status = await client.mpesa.check_stk_status(stkPush.id);
```

### 3. Checkout Sessions

```typescript
// Create a checkout session
const session = await client.checkout.create_session({
    amount: 1000,
    currency: 'KES',
    description: 'Premium Plan Subscription',
    success_url: 'https://your-domain.com/success',
    cancel_url: 'https://your-domain.com/cancel',
    metadata: {
        order_id: '12345',
        customer_id: '67890'
    }
});

// Get session details
const sessionDetails = await client.checkout.get_session(session.id);
```

### 4. Express.js Integration Example

```typescript
import express from 'express';
import { SendMateClient } from 'sendmate-node';

const app = express();
const client = new SendMateClient(
    process.env.PUBLISHABLE_KEY,
    process.env.SECRET_KEY,
    process.env.IS_SANDBOX === 'true'
);

// M-Pesa STK Push endpoint
app.post('/api/mpesa/stk-push', async (req, res) => {
    try {
        const { phone_number, amount } = req.body;
        
        const stkPush = await client.mpesa.stk_push({
            phone_number,
            amount,
            currency: 'KES',
            description: 'Payment for goods',
            callback_url: 'https://your-domain.com/callback'
        });

        res.json({ success: true, data: stkPush });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Checkout session endpoint
app.post('/api/checkout/session', async (req, res) => {
    try {
        const { amount, description } = req.body;
        
        const session = await client.checkout.create_session({
            amount,
            currency: 'KES',
            description,
            success_url: 'https://your-domain.com/success',
            cancel_url: 'https://your-domain.com/cancel'
        });

        res.json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

## API Documentation

### SendMateClient

#### Constructor
```typescript
new SendMateClient(publishableKey: string, secretKey: string, isSandbox: boolean)
```

### Wallet Methods

- `get_wallets()`: Get all wallets
- `get_wallet(id: string)`: Get wallet details
- `get_wallet_transactions(id: string, options?: { limit?: number, page?: number })`: Get wallet transactions
- `set_default_wallet(id: string)`: Set default wallet

### M-Pesa Methods

- `stk_push(options: { phone_number: string, amount: number, currency: string, description: string, callback_url: string })`: Initiate STK Push
- `check_stk_status(id: string)`: Check STK Push status
- `get_transaction(id: string)`: Get transaction details

### Checkout Methods

- `create_session(options: { amount: number, currency: string, description: string, success_url: string, cancel_url: string, metadata?: object })`: Create checkout session
- `get_session(id: string)`: Get session details
- `expire_session(id: string)`: Expire a session

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## License

MIT

## Support

For support, email support@sendmate.com or create an issue in the [GitHub repository](https://github.com/nextunesolutions/sendmate-node).


