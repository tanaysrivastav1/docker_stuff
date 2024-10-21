const express = require('express');
const pool = require('./db'); // Import the PostgreSQL pool from db.js
const app = express();

app.use(express.json()); // To parse incoming requests with JSON

// API endpoint to store wallet data
app.post('/api/store-wallet', async (req, res) => {
  const { walletAddress, ethBalance, transactions } = req.body;

  try {
    // Insert wallet data into PostgreSQL
    const result = await pool.query(
      'INSERT INTO wallet_data (wallet_address, eth_balance, transactions) VALUES ($1, $2) RETURNING *',
      [walletAddress, ethBalance, transactions]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error storing wallet data:', error);
    res.status(500).send('Server error');
  }
});

// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});