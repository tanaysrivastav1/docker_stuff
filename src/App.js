import './App.css';
import Confetti from './Confetti';
import FogMachine from './FogMachine';
import React, { useState } from 'react';

const App = () => {

  // Sample list of YouTube links
  const youtubeLinks = [
    'https://www.youtube.com/watch?v=qYIdRQN_15E',
    'https://www.youtube.com/watch?v=dv3yzm7xfI8',
    'https://www.youtube.com/watch?v=rRJWzP2-tW8&t=296s',
    // ... Add more links 
  ];

  const getRandomYoutubeLink = () => {
    const randomIndex = Math.floor(Math.random() * youtubeLinks.length);
    return youtubeLinks[randomIndex];
  }

  // State for cryptocurrency balance (to be fetched dynamically later)
  const [cryptoBalance, setCryptoBalance] = useState('0.00 ETH');

  return (
    <div className="App">
      <Confetti />
      <header className="App-header">
        <FogMachine>
          <h1 style={{ marginBottom: "10px" }}>
            Slump Bro Docker App
          </h1>
        </FogMachine>

        <p style={{ marginTop: "20px", marginBottom: "40px" }}>
          Crypto on Docker - Tanay S. 🎉
        </p>

        {/* Add buttons for interactivity */}
        <div style={{ marginBottom: "20px" }}>
          <button 
            style={{ marginRight: "10px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            onClick={() => alert('Button 1 clicked!')}
          >
            Button 1
          </button>
          <button 
            style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            onClick={() => alert('Button 2 clicked!')}
          >
            Button 2
          </button>
        </div>

        {/* Display cryptocurrency balance */}
        <div style={{ marginTop: "20px", marginBottom: "40px", border: "2px solid white", padding: "20px", borderRadius: "10px" }}>
          <h2>Your Cryptocurrency Balance:</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{cryptoBalance}</p>
        </div>

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