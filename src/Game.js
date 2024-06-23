// import React, { useState } from 'react';
// import './game.css';  // Optional: For styling, create Game.css

// const Game = () => {
//   const [guess, setGuess] = useState('');
//   const [message, setMessage] = useState('');
//   const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
//   const [attempts, setAttempts] = useState(0);

//   const handleGuessChange = (event) => {
//     setGuess(event.target.value);
//   };

//   const checkGuess = () => {
//     const numberGuess = parseInt(guess, 10);
//     setAttempts(attempts + 1);

//     if (numberGuess < targetNumber) {
//       setMessage('Too Low!');
//     } else if (numberGuess > targetNumber) {
//       setMessage('Too High!');
//     } else {
//       setMessage(`Correct! You guessed it in ${attempts + 1} attempts.`);
//     }
//   };

//   const resetGame = () => {
//     setGuess('');
//     setMessage('');
//     setTargetNumber(Math.floor(Math.random() * 100) + 1);
//     setAttempts(0);
//   };

//   return (
//     <div className="game-container">
//       <h1>Number Guessing Game</h1>
//       <p>Guess a number between 1 and 100</p>
//       <input
//         type="number"
//         value={guess}
//         onChange={handleGuessChange}
//         placeholder="Enter your guess"
//       />
//       <button onClick={checkGuess}>Guess</button>
//       <button onClick={resetGame}>Reset Game</button>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default Game;
// src/components/Game.js
import React, { useState, useEffect, useRef } from 'react';
import Car from './Car';
import Obstacle from './Obstacle';
import './Game.css';

const Game = () => {
  const [carPosition, setCarPosition] = useState(150);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const gameAreaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (!gameStarted || gameOver) return;
    switch (e.key) {
      case 'ArrowLeft':
        setCarPosition((prev) => Math.max(0, prev - 20));
        break;
      case 'ArrowRight':
        setCarPosition((prev) => Math.min(300, prev + 20));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setObstacles((prev) => {
          let newObstacles = prev.map((obstacle) => ({
            ...obstacle,
            top: obstacle.top + 5,
          }));

          newObstacles = newObstacles.filter(
            (obstacle) => obstacle.top < gameAreaRef.current.clientHeight
          );

          if (Math.random() < 0.1) {
            newObstacles.push({
              id: Date.now(),
              position: Math.random() * 300,
              top: 0,
            });
          }

          for (let obstacle of newObstacles) {
            if (
              obstacle.top > 460 &&
              obstacle.top < 500 &&
              obstacle.position > carPosition - 30 &&
              obstacle.position < carPosition + 30
            ) {
              setGameOver(true);
              clearInterval(interval);
            }
          }

          if (!gameOver) {
            setScore((prevScore) => prevScore + 1);
          }

          return newObstacles;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [carPosition, gameStarted, gameOver]);

  const startGame = () => {
    setCarPosition(150);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className={`game-container ${gameStarted ? 'started' : 'stopped'}`} ref={gameAreaRef}>
      <h1>Car Racing Game</h1>
      <div className="score-board">Score: {score}</div>
      {gameOver && <h2>Game Over! Press Start to play again.</h2>}
      {!gameStarted && <button onClick={startGame} className="start-button">Start Game</button>}
      {gameStarted && <Car position={carPosition} />}
      {gameStarted && obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} position={obstacle.position} top={obstacle.top} />
      ))}
    </div>
  );
};

export default Game;
