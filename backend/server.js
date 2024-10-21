const express = require('express');
const path = require('path');
const pool = require('./db'); // PostgreSQL connection
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve the static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API route to store wallet data in PostgreSQL
app.post('/api/store-wallet', async (req, res) => {
  const { walletAddress, ethBalance, transactions } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO wallet_data (wallet_address, eth_balance, transactions) VALUES ($1, $2, $3) RETURNING *',
      [walletAddress, ethBalance, JSON.stringify(transactions)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error storing wallet data:', error);
    res.status(500).send('Server error');
  }
});

// Catch-all route to serve React frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});