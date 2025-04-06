import React, { useState } from 'react';

// Card suits and ranks
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Create a new deck of cards
function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Calculate the value of a hand, handling aces as 1 or 11
function calculateHandValue(hand) {
  let value = 0;
  let aces = 0;
  for (const card of hand) {
    if (card.rank === 'A') {
      aces++;
      value += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      value += 10;
    } else {
      value += parseInt(card.rank);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }
  return value;
}

// Card component for visual display
const Card = ({ card, hidden }) => {
  const style = {
    width: '60px',
    height: '90px',
    border: '1px solid black',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5px',
    backgroundColor: 'white',
    fontSize: '20px',
    color: 'black'
  };

  if (hidden) {
    return <div style={style}>?</div>;
  }

  return (
    <div style={style}>
      {card.rank}{card.suit}
    </div>
  );
};

const BlackjackGame = ({ websiteWalletBalance, onPlaceBet, onGameResult }) => {
  const [bet, setBet] = useState('');
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('betting'); // 'betting', 'playerTurn', 'dealerTurn', 'finished'
  const [message, setMessage] = useState('');

  // Start game: validate bet, ensure sufficient funds, and then deal cards
  const startGame = () => {
    const betAmount = Number(bet);
    if (!bet || isNaN(betAmount) || betAmount <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }
    if (betAmount > websiteWalletBalance) {
      alert('Insufficient website wallet balance');
      return;
    }
    // Deduct the bet amount from the wallet using the callback
    const betPlaced = onPlaceBet(betAmount);
    if (!betPlaced) return;

    const newDeck = shuffleDeck(createDeck());
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameStatus('playerTurn');
    setMessage('');
  };

  // Player chooses to hit
  const hit = () => {
    if (deck.length === 0) return;
    const newDeck = [...deck];
    const card = newDeck.pop();
    const newPlayerHand = [...playerHand, card];
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);

    const playerValue = calculateHandValue(newPlayerHand);
    if (playerValue > 21) {
      setMessage('You busted!');
      setGameStatus('finished');
      // Report a loss so the bet remains subtracted
      onGameResult(Number(bet), 'loss');
    }
  };

  // Player stands and dealer plays
  const stand = () => {
    setGameStatus('dealerTurn');
    let newDealerHand = [...dealerHand];
    let dealerValue = calculateHandValue(newDealerHand);
    // Dealer draws until reaching 17 or higher
    while (dealerValue < 17 && deck.length > 0) {
      const newDeck = [...deck];
      const card = newDeck.pop();
      newDealerHand.push(card);
      setDeck(newDeck);
      dealerValue = calculateHandValue(newDealerHand);
    }
    setDealerHand(newDealerHand);

    const playerValue = calculateHandValue(playerHand);

    let result = 'loss';
    if (dealerValue > 21) {
      result = 'win';
      setMessage('Dealer busted! You win!');
    } else if (dealerValue > playerValue) {
      result = 'loss';
      setMessage('Dealer wins!');
    } else if (dealerValue < playerValue) {
      result = 'win';
      setMessage('You win!');
    } else {
      result = 'push';
      setMessage("Push! It's a tie.");
    }
    setGameStatus('finished');
    // Report the game result so the wallet balance can be updated accordingly
    onGameResult(Number(bet), result);
  };

  // Reset the game for a new round
  const resetGame = () => {
    setBet('');
    setDeck([]);
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('betting');
    setMessage('');
  };

  return (
    <div style={{ marginTop: '40px', padding: '20px', border: '2px solid white', borderRadius: '10px' }}>
      <h2>Blackjack Game</h2>
      {gameStatus === 'betting' && (
        <div>
          <input 
            type="number" 
            placeholder="Enter your bet" 
            value={bet} 
            onChange={(e) => setBet(e.target.value)}
            style={{ padding: '10px', fontSize: '16px', width: '200px' }}
          />
          <button 
            onClick={startGame} 
            style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Place Bet & Deal Cards
          </button>
        </div>
      )}

      {(gameStatus === 'playerTurn' || gameStatus === 'finished' || gameStatus === 'dealerTurn') && (
        <div style={{ marginTop: '20px' }}>
          <div>
            <h3>Your Hand ({calculateHandValue(playerHand)})</h3>
            <div style={{ display: 'flex' }}>
              {playerHand.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Dealer's Hand {gameStatus === 'playerTurn' ? '' : `(${calculateHandValue(dealerHand)})`}</h3>
            <div style={{ display: 'flex' }}>
              {dealerHand.map((card, index) => (
                <Card key={index} card={card} hidden={gameStatus === 'playerTurn' && index === 1} />
              ))}
            </div>
          </div>
        </div>
      )}

      {gameStatus === 'playerTurn' && (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={hit} 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginRight: '10px' }}
          >
            Hit
          </button>
          <button 
            onClick={stand} 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Stand
          </button>
        </div>
      )}

      {(gameStatus === 'finished' || gameStatus === 'dealerTurn') && (
        <div style={{ marginTop: '20px' }}>
          <h3>{message}</h3>
          <button 
            onClick={resetGame} 
            style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default BlackjackGame;