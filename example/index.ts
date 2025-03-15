import express from 'express';
import dotenv from 'dotenv';
import { SendMate } from '../src';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the SendMate client
const sendmate = SendMate.create(
  process.env.SENDMATE_API_URL || 'https://sendmate.finance/',
  {
    clientId: process.env.SENDMATE_CLIENT_ID || 'YOUR_CLIENT_ID',
    secretId: process.env.SENDMATE_SECRET_ID || 'YOUR_SECRET_ID'
  }
);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  } catch (error) {
    console.error('Payment initiation error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate payment',
      error: error.message 
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
  } catch (error) {
    console.error('Payment status check error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check payment status',
      error: error.message 
    });
  }
});

// Payment success callback route
app.get('/payment-success', (req, res) => {
  const { token } = req.query;
  res.send(`
    <html>
      <head>
        <title>Payment Successful</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .success { color: green; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="success">Payment Successful!</h1>
          <p>Your payment has been processed successfully.</p>
          <p>Token: ${token}</p>
          <button onclick="checkStatus('${token}')">Check Payment Status</button>
          <div id="status-result" style="margin-top: 20px;"></div>
          <p><a href="/">Return to Home</a></p>
        </div>
        <script>
          function checkStatus(token) {
            document.getElementById('status-result').innerHTML = 'Loading...';
            fetch('/api/payments/' + token)
              .then(response => response.json())
              .then(data => {
                document.getElementById('status-result').innerHTML = 
                  '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              })
              .catch(error => {
                document.getElementById('status-result').innerHTML = 
                  'Error: ' + error.message;
              });
          }
        </script>
      </body>
    </html>
  `);
});

// Payment cancel callback route
app.get('/payment-cancel', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Payment Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .cancelled { color: #f44336; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="cancelled">Payment Cancelled</h1>
          <p>Your payment has been cancelled.</p>
          <p><a href="/">Return to Home</a></p>
        </div>
      </body>
    </html>
  `);
});

// Create a simple HTML form for the home page
app.use((req, res, next) => {
  if (req.path === '/' && !fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
    res.send(`
      <html>
        <head>
          <title>SendMate Payment Demo</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input, select { width: 100%; padding: 8px; box-sizing: border-box; }
            button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
            .result { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>SendMate Payment Integration Demo</h1>
          <div class="form-group">
            <label for="amount">Amount:</label>
            <input type="text" id="amount" placeholder="100.00" />
          </div>
          <div class="form-group">
            <label for="currency">Currency:</label>
            <select id="currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <button onclick="initiatePayment()">Initiate Payment</button>
          
          <div id="result" class="result" style="display: none;"></div>
          
          <script>
            function initiatePayment() {
              const amount = document.getElementById('amount').value;
              const currency = document.getElementById('currency').value;
              
              if (!amount) {
                alert('Please enter an amount');
                return;
              }
              
              document.getElementById('result').style.display = 'block';
              document.getElementById('result').innerHTML = 'Processing...';
              
              fetch('/api/payments', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency }),
              })
                .then(response => response.json())
                .then(data => {
                  if (data.success) {
                    document.getElementById('result').innerHTML = 
                      '<h3>Payment Initiated</h3>' +
                      '<p>Token: ' + data.data.token + '</p>' +
                      '<p><a href="' + data.data.payment_url + '" target="_blank">Click here to complete payment</a></p>';
                  } else {
                    document.getElementById('result').innerHTML = 
                      '<h3>Error</h3><p>' + data.message + '</p>';
                  }
                })
                .catch(error => {
                  document.getElementById('result').innerHTML = 
                    '<h3>Error</h3><p>' + error.message + '</p>';
                });
            }
          </script>
        </body>
      </html>
    `);
  } else {
    next();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 SendMate Payment Demo server running at http://localhost:${PORT}`);
  console.log('💡 Use the web interface to test payment integration');
});

// Import fs for the middleware
import fs from 'fs'; 