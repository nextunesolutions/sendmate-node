import express from 'express';
import dotenv from 'dotenv';
import { SendMateService } from '../src';
import path from 'path';
import fs from 'fs';
import expressLayouts from 'express-ejs-layouts';
import walletRoutes from './routes/wallet';
import client from './client';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts as any);
app.set('layout', 'layout');

// Initialize the SendMate client with publishable and secret keys


// Wallet Routes
app.use('/wallets', walletRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'SendMate Payment Demo',
    description: 'Choose your preferred payment method'
  });
});

// Card payment checkout page
app.get('/checkout', (req, res) => {
  res.render('checkout', {
    title: 'Card Payment',
    description: 'Make a payment using your card'
  });
});

// M-Pesa payment page
app.get('/mpesa', (req, res) => {
  res.render('mpesa', {
    title: 'M-Pesa Payment',
    description: 'Make a payment using M-Pesa'
  });
});

// Create checkout session endpoint for card payments
app.post('/api/checkout', async (req, res) => {
  try {
    const { amount, description, currency = 'KES' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount is required' 
      });
    }

    const session = await client.checkout.create_checkout_session({
      amount,
      description,
      currency,
      return_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`
    });

    if (!session) {
      throw new Error('Failed to create checkout session');
    }

    res.json({
      success: true,
      data: {
        session_id: session.session_id,
        url: session.url
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Checkout error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create checkout session',
      error: errorMessage 
    });
  }
});

// M-Pesa STK push endpoint
app.post('/api/mpesa/stk', async (req, res) => {
  try {
    const { phone, amount, description } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount is required' 
      });
    }

    // Check phone number format
    if (!phone.startsWith('+254') || phone.length !== 13) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be in format +254XXXXXXXXX'
      });
    }

    // Make the M-Pesa STK push request
    const stkPushResponse = await client.collection.mpesa_stk_push({
      amount: parseFloat(amount) as any,
      phone_number: phone,
      description: description || 'Payment for services',
    });

    if (!stkPushResponse) {
      throw new Error('Failed to initiate M-Pesa payment');
    }

    res.json({
      success: true,
      message: 'M-Pesa STK push initiated successfully',
      data: {
        reference: stkPushResponse.reference,
        status: stkPushResponse.status
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('M-Pesa STK push error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate M-Pesa payment',
      error: errorMessage 
    });
  }
});

// Check M-Pesa payment status endpoint
app.get('/api/mpesa/status/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction reference is required' 
      });
    }

    const statusResponse = await client.collection.mpesa_check_mpesa_status(reference);
    
    if (!statusResponse) {
      throw new Error('Failed to check M-Pesa status');
    }

    res.json({
      success: true,
      data: statusResponse
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('M-Pesa status check error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check M-Pesa payment status',
      error: errorMessage 
    });
  }
});

// M-Pesa success callback (for webhook or redirect)
app.get('/mpesa/success', (req, res) => {
  const { reference, amount, phone } = req.query;
  res.render('mpesa-success', {
    title: 'M-Pesa Payment Successful',
    reference,
    amount,
    phone
  });
});

// Check session status endpoint
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID is required' 
      });
    }

    const status = await client.checkout.get_checkout_session_status(sessionId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Session status error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check session status',
      error: errorMessage 
    });
  }
});




// Success callback route for card payments
app.get('/success', (req, res) => {
  const { session_id } = req.query;
  res.render('success', { 
    title: 'Payment Successful',
    session_id,
    message: 'Your payment was processed successfully!'
  });
});

// Cancel callback route
app.get('/cancel', (req, res) => {
  res.render('cancel', { 
    title: 'Payment Cancelled',
    message: 'Your payment was cancelled.'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    title: 'Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 SendMate Payment Demo server running at http://localhost:${PORT}`);
  console.log('💡 Use the web interface to test payment integration');
});

