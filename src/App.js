import './App.css';
import FogMachine from './FogMachine';
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  // State for user input wallet address
  const [walletAddress, setWalletAddress] = useState('');
  // State for cryptocurrency balance
  const [ethBalance, setEthBalance] = useState('0.00 ETH');
  // State for recent transactions
  const [transactions, setTransactions] = useState([]);
  
  const etherscanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;

  const fetchEthBalance = async () => {
    if (!walletAddress) {
      alert('Please enter a valid wallet address');
      return;
    }

    try {
      const response = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`);
      const data = await response.json();

      // Convert Wei to ETH (1 ETH = 10^18 Wei)
      const balanceInETH = data.result / 1e18;
      setEthBalance(`${balanceInETH} ETH`);

      // Fetch recent transactions
      const transactionResponse = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`);
      const transactionData = await transactionResponse.json();
      setTransactions(transactionData.result.slice(0, 5)); // Show last 5 transactions
    } catch (error) {
      console.error('Error fetching ETH balance or transactions:', error);
    }
  };

    // Function to store the wallet address and balance in the database
    const storeWalletData = async () => {
      try {
        const response = await axios.post('/api/store-wallet', {
          walletAddress,
          ethBalance,
          transactions
        });
        alert('Wallet data stored successfully!');
      } catch (error) {
        console.error('Error storing wallet data:', error);
        alert('Failed to store wallet data.');
      }
    };

  return (
    <div className="App">
      <header className="App-header">
        <FogMachine>
          <h1 style={{ marginBottom: "10px" }}>
            Crypto Dashboard
          </h1>
        </FogMachine>

        <p style={{ marginTop: "20px", marginBottom: "40px" }}>
          Crypto on Docker - Tanay S. 🎉
        </p>

        {/* Input field for wallet address */}
        <div style={{ marginBottom: "20px" }}>
          <input 
            type="text" 
            placeholder="Enter Ethereum wallet address" 
            value={walletAddress} 
            onChange={(e) => setWalletAddress(e.target.value)} 
            style={{ padding: "10px", fontSize: "16px", width: "300px" }}
          />
          <button 
            style={{ marginLeft: "10px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            onClick={fetchEthBalance}
          >
            Get Balance & Transactions
          </button>
        </div>

        {/* Display Ethereum balance */}
        <div style={{ marginTop: "20px", marginBottom: "40px", border: "2px solid white", padding: "20px", borderRadius: "10px" }}>
          <h2>Your Ethereum Balance:</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{ethBalance}</p>
        </div>

        {/* Display recent transactions */}
        {transactions.length > 0 && (
          <div style={{ marginTop: "20px", marginBottom: "40px", border: "2px solid white", padding: "20px", borderRadius: "10px" }}>
            <h2>Recent Transactions:</h2>
            <ul style={{ textAlign: 'left', fontSize: "14px" }}>
              {transactions.map((tx, index) => (
                <li key={index}>
                  <p>Hash: {tx.hash}</p>
                  <p>From: {tx.from}</p>
                  <p>To: {tx.to}</p>
                  <p>Value: {tx.value / 1e18} ETH</p>
                  <p>Block: {tx.blockNumber}</p>
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={storeWalletData}>
        Store Wallet Balance
        </button>

        <div>
          <a target="_blank" href={"https://github.com/tanaysrivastav1"} class="fa fa-github-border" aria-hidden="true" rel="noopener noreferrer" style={{ marginRight: "15px" }}>
            GitHub
          </a>
          <a target="_blank" href={"https://www.linkedin.com/in/tanay-s-a55892132/"} className="fa fa-linkedin" rel="noopener noreferrer">
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;