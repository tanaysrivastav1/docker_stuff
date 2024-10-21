const { Pool } = require('pg');

// Setup connection pool to PostgreSQL
const pool = new Pool({
  user: process.env.PG_USER || 'postgres_user',
  host: process.env.PG_HOST || 'postgresql', // The service name for PostgreSQL in OpenShift
  database: process.env.PG_DATABASE || 'wallet_db',
  password: process.env.PG_PASSWORD || 'postgres_password',
  port: 5432, // PostgreSQL default port
});

module.exports = pool;

/*
oc rsh postgresql-pod
psql -u usr -p pwd

CREATE TABLE wallet_data (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  eth_balance VARCHAR(255) NOT NULL,
  transactions TEXT NOT NULL,  -- Use TEXT for longer transaction data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

      env:
        - name: PG_HOST
          value: "postgresql"  # Service name for PostgreSQL in OpenShift
        - name: PG_USER
          value: "postgres_user"
        - name: PG_PASSWORD
          value: "postgres_password"
        - name: PG_DATABASE
          value: "wallet_db"

*/