import express from 'express';
import dotenv from 'dotenv';
import { SendMate } from '../src';
import path from 'path';
import fs from 'fs';
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

// Initialize the SendMate client
const sendmate = SendMate.create(
  {
    baseUrl: process.env.SENDMATE_BASE_URL || undefined,
    clientId: process.env.SENDMATE_CLIENT_ID || 'YOUR_CLIENT_ID',
    secretId: process.env.SENDMATE_SECRET_ID || 'YOUR_SECRET_ID'
  },
  process.env.SENDMATE_SANDBOX === 'true'
);

// console.log(sendmate);

// Routes
app.get('/', (req, res) => {
  // Check if custom index.html exists
  if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  
  // Otherwise render the EJS template
  res.render('index');
});

// Initiate payment endpoint
app.post('/api/payments', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount || !currency) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount and currency are required' 
      });
    }

    const payment = await sendmate.payment.initiatePayment({
      amount,
      currency,
      return_url: `${req.protocol}://${req.get('host')}/payment-success`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment-cancel`
    });

    res.json({
      success: true,
      data: {
        token: payment.token,
        payment_url: payment.payment_url
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment initiation error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate payment',
      error: errorMessage 
    });
  }
});

// Check payment status endpoint
app.get('/api/payments/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment token is required' 
      });
    }

    const status = await sendmate.payment.checkPaymentStatus(token);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Payment status check error:', errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check payment status',
      error: errorMessage 
    });
  }
});

// Payment success callback route
app.get('/payment-success', (req, res) => {
  const { token } = req.query;
  res.render('payment-success', { token });
});

// Payment cancel callback route
app.get('/payment-cancel', (req, res) => {
  res.render('payment-cancel');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 SendMate Payment Demo server running at http://localhost:${PORT}`);
  console.log('💡 Use the web interface to test payment integration');
});

