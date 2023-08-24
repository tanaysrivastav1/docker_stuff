import './App.css';
import Confetti from './Confetti';
import FogMachine from './FogMachine';

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

  return (
    <div className="App">
      <Confetti />
      <header className="App-header">
      <FogMachine>
      <h1 style={{ marginBottom: "0px" }}>
          Slump Bro docker app
        </h1>
      </FogMachine>
        <p style={{ marginTop: "10px", marginBottom: "50px" }}>
          Confetti docker app

        </p>
        <div>
          <a target="_blank" href={getRandomYoutubeLink()} rel="noopener noreferrer" class="fa fa-youtube"> Random YouTube</a> 
          <a target="_blank" href={"https://github.com/tanaysrivastav1"} class="fa-brands fa-github fa-flip" rel="noopener noreferrer"> </a>
          <a target="_blank" href={"https://www.linkedin.com/in/tanay-s-a55892132/"} class="fa fa-linkedin" rel="noopener noreferrer"> </a>
        </div>
      </header>
    </div>
  );
}

export default App;
