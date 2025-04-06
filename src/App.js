import './App.css';
import FogMachine from './FogMachine';
import React, { useState } from 'react';
import axios from 'axios';
import Confetti from './Confetti';
import BlackjackGame from './BlackjackGame';

const App = () => {
  // State for user input wallet address
  const [walletAddress, setWalletAddress] = useState('');
  // State for cryptocurrency balance
  const [ethBalance, setEthBalance] = useState('0.00 ETH');
  // State for recent transactions
  const [transactions, setTransactions] = useState([]);
  
  // Website wallet balance state (starting at 10)
  const [websiteWalletBalance, setWebsiteWalletBalance] = useState(10);
  
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

  // Callback to handle when a bet is placed.
  // It subtracts the bet from the website wallet balance.
  const handlePlaceBet = (betAmount) => {
    if (betAmount > websiteWalletBalance) {
      alert("Insufficient funds in website wallet balance!");
      return false;
    }
    // Subtract the bet from the wallet balance
    setWebsiteWalletBalance(prev => prev - betAmount);
    return true;
  };

  // Callback to update wallet balance based on game result.
  // For a win, we add the bet amount (or a multiple of it) back to the balance.
  // For a loss, nothing is added back.
  const handleGameResult = (betAmount, result) => {
    if (result === 'win') {
      // For example, add back the bet amount plus winnings.
      // You can adjust this multiplier as needed.
      setWebsiteWalletBalance(prev => prev + betAmount * 2);
    }
    // If the result is a loss, the balance remains as is.
  };

  return (
    <div className="App">
      <header className="App-header">
        <Confetti>
          <h1 style={{ marginBottom: "10px" }}>
            Crypto
          </h1>
        </Confetti>

        <p style={{ marginTop: "20px", marginBottom: "40px" }}>
          Crypto on Gambling on Docker 🎉
        </p>

        {/* Display website wallet balance */}
        <div style={{ marginBottom: "20px", border: "2px solid white", padding: "10px", borderRadius: "10px" }}>
          <h3>Website Wallet Balance: {websiteWalletBalance}</h3>
        </div>

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

        <div style={{ marginTop: "40px" }}>
          {/* Render the Blackjack game and pass wallet management callbacks */}
          <BlackjackGame 
            websiteWalletBalance={websiteWalletBalance} 
            onPlaceBet={handlePlaceBet} 
            onGameResult={handleGameResult} 
          />
        </div>

        <div>
          <a target="_blank" href={"https://github.com/tanaysrivastav1"} className="fa fa-github-border" aria-hidden="true" rel="noopener noreferrer" style={{ marginRight: "15px" }}>
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