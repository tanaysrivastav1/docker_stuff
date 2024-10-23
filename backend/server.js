const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// Set up PostgreSQL connection
// npm install express cors pg --> Node server.js
const pool = new Pool({
  user: 'postgres_user',
  host: 'localhost',
  database: 'wallet_db',
  password: 'postgres_password', // Replace with your actual PostgreSQL password
  port: 5433, // Use the port you forwarded with `oc port-forward`
});

// Endpoint to store wallet data
// Endpoint to store wallet data
app.post('/api/store-wallet', async (req, res) => {
    const { walletAddress, ethBalance, transactions } = req.body;
  
    try {
      // Insert wallet balance into the 'wallet_data' table
      await pool.query(
        'INSERT INTO wallet_data (wallet_address, eth_balance, transactions, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
        [walletAddress, ethBalance, transactions]
      );
  
      res.status(200).json({ message: 'Wallet data stored successfully!' });
    } catch (error) {
      console.error('Error storing wallet data:', error);
      res.status(500).json({ message: 'Error storing wallet data' });
    }
  });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});