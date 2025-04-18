import express from 'express';
import dotenv from 'dotenv';
import { SendMateService } from '../src';
import path from 'path';
import fs from 'fs';
import expressLayouts from 'express-ejs-layouts';

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
const sendmate = new SendMateService(
  process.env.SENDMATE_PUBLISHABLE_KEY || 'YOUR_PUBLISHABLE_KEY',
  process.env.SENDMATE_SECRET_KEY || 'YOUR_SECRET_KEY',
  process.env.SENDMATE_SANDBOX === 'true'
);

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'SendMate Payment Demo',
    description: 'A simple demo of SendMate payment integration',
    publishableKey: process.env.SENDMATE_PUBLISHABLE_KEY || 'YOUR_PUBLISHABLE_KEY'
  });
});

// Create checkout session endpoint
app.post('/api/checkout', async (req, res) => {
  try {
    const { amount, description, currency = 'KES' } = req.body;
    
    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount is required' 
      });
    }

    const session = await sendmate.checkout.create_checkout_session({
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

    const status = await sendmate.checkout.get_checkout_session_status(sessionId);
    
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

// Success callback route
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

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 SendMate Payment Demo server running at http://localhost:${PORT}`);
  console.log('💡 Use the web interface to test payment integration');
});

