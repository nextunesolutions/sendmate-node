# SendMate Node.js SDK

Official Node.js SDK for the SendMate API. This package provides a simple and efficient way to integrate SendMate's payment processing and wallet management capabilities into your Node.js applications.

## Installation

```bash
npm install sendmate-node
```

## Usage

```typescript
import { WalletClient } from 'sendmate-node';

// Initialize the client
const wallet = new WalletClient(
    process.env.PUBLISHABLE_KEY,
    process.env.SECRET_KEY,
    process.env.IS_SANDBOX === 'true'
);

// Get all wallets
const wallets = await wallet.get_wallets();

// Get wallet details
const walletDetails = await wallet.get_wallet('wallet_id');

// Get wallet transactions
const transactions = await wallet.get_wallet_transactions('wallet_id', {
    limit: 10,
    page: 1
});

// Set default wallet
const result = await wallet.set_default_wallet('wallet_id');
```

## Configuration

The SDK requires the following environment variables:

- `PUBLISHABLE_KEY`: Your SendMate publishable key
- `SECRET_KEY`: Your SendMate secret key
- `IS_SANDBOX`: Set to 'true' for sandbox environment

## API Documentation

### WalletClient

#### Constructor
```typescript
new WalletClient(publishableKey: string, secretKey: string, isSandbox: boolean)
```

#### Methods

- `get_wallets()`: Get all wallets
- `get_wallet(id: string)`: Get wallet details
- `get_wallet_transactions(id: string, options?: { limit?: number, page?: number })`: Get wallet transactions
- `set_default_wallet(id: string)`: Set default wallet

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

For support, email support@sendmate.com or create an issue in the [GitHub repository](https://github.com/sendmate/sendmate-node).


