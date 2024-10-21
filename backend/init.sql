CREATE TABLE wallet_data (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  eth_balance VARCHAR(255) NOT NULL,
  transactions TEXT NOT NULL,  -- Use TEXT for longer transaction data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);