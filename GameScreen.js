import React, { useState, useEffect, useRef } from 'react';
import PopEffect from './components/PopEffect';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import Bubble from './components/Bubble';
import Laser from './components/Laser';
import Gun from './components/Gun';
import { ImageBackground } from 'react-native';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameScreen() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [laser, setLaser] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gunX, setGunX] = useState(screenWidth / 2); // to start centered

  const bubbleIdRef = useRef(0);
  const gameTimerRef = useRef(null);
  const bubbleSpawnerRef = useRef(null);
  const bubbleAnimationRef = useRef(null);


  const [popEffects, setPopEffects] = useState([]);
  const [hitBubbles, setHitBubbles] = useState([]);

  
  useEffect(() => {
    if (hitBubbles.length > 0) {
      setPopEffects(prev => [
        ...prev,
        ...hitBubbles.map(b => ({ id: b.id, x: b.x, y: b.y})),
      ]);

    setTimeout(() => {
      setPopEffects(prev => 
        prev.filter(effect => !hitBubbles.some(b => 
        b.id === effect.id))
        );
    },300);

    setHitBubbles([]);
    }
  }, [hitBubbles]);
  

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(120);
    setBubbles([]);
    setLaser(null);
    
    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start bubble spawner
    bubbleSpawnerRef.current = setInterval(() => {
      spawnBubble();
    }, 500);

    // Start bubble animation loop
    animateBubbles();
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (bubbleSpawnerRef.current) {
      clearInterval(bubbleSpawnerRef.current);
    }
    if (bubbleAnimationRef.current) {
      clearInterval(bubbleAnimationRef.current);
    }
  };

  // Spawn a new bubble
  const spawnBubble = () => {
    const getRandomColor = () => {
      const colors = ['#DC143C','#00FFFF', '#BDB76B', '#6B8E23', '#DDA0DD', '#48D1CC', '#F08080'];
      return colors[Math.floor(Math.random() * colors.length)];
  };

    const isPowerUp = Math.random() < 0.2; //20 percent chance of popping up

    const newBubble = {
      id: bubbleIdRef.current++,
      x: Math.random() * (screenWidth - 60), // 60 is bubble diameter
      y: screenHeight - 100,
      radius: 30,
      color: getRandomColor(),
      color: isPowerUp ? 'gold' : getRandomColor(),
      type: isPowerUp ? 'powerup' : 'normal',
    };
    
    setBubbles(prev => [...prev, newBubble]);
  };

  // Animate bubbles upward
  const animateBubbles = () => {
    bubbleAnimationRef.current = setInterval(() => {
      setBubbles(prev => 
        prev
          .map(bubble => ({ ...bubble, y: bubble.y - 2 }))
          .filter(bubble => bubble.y > -60) // Remove bubbles that left the screen
      );
    }, 16); // ~60 FPS
  };

  // Handle screen tap
  const handleTap = (event) => {
    if (!gameStarted || gameOver) return;

    const { locationX } = event.nativeEvent;
    
   // Fire laser from tap point
    setLaser({
      x: locationX,
      visible: true,
    });

    checkLaserHits(locationX);

    // Move gun to tap point
    setGunX(locationX);

    // Hide laser after 300ms
    setTimeout(() => {
      setLaser(null);
    }, 300);
  };

  // Check if laser hits any bubbles
  const checkLaserHits = (laserX) => {
    setBubbles(prev => {
      const hits = [];
      const remainingBubbles = prev.filter(bubble => {
        const distance = Math.abs(bubble.x + bubble.radius - laserX);
        if (distance <= bubble.radius) {
          hits.push(bubble);
          return false; // Remove this bubble
        }
        return true; // Keep this bubble
      });

      // Update score for each hit
      if (hits.length > 0) {
      //   setScore(prevScore => prevScore + hits.length);
      //   setHitBubbles(hits);
      // }
      hits.forEach(hit => {
        if (hit.type === 'powerup') {
          setScore(prevScore => prevScore + 5); // bonus points
          setTimeLeft(prevTime => prevTime + 5); // extra time
        } else {
          setScore(prevScore => prevScore + 1);
        }
      });
      setHitBubbles(hits);
    }

      return remainingBubbles;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (bubbleSpawnerRef.current) clearInterval(bubbleSpawnerRef.current);
      if (bubbleAnimationRef.current) clearInterval(bubbleAnimationRef.current);
    };
  }, []);

  // Game Over Screen
  if (gameOver) {
    return (
      <ImageBackground
      source={require('./assets/background1.png')} 
      style={styles.startContainer}
      resizeMode="cover"
    >        
        <Text style={styles.gameOverTitle}>Game Over!</Text>
        <Text style={styles.finalScore}>Final Score: {score}</Text>
        <Pressable style={styles.playAgainButton} onPress={startGame}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </Pressable>
      </ImageBackground>
    );
  }

  // Start Screen
  if (!gameStarted) {
    return (
      <ImageBackground
        source={require('./assets/background1.png')}
        style={styles.startContainer}
        resizeMode="cover"
      >        
        <Text style={styles.title}>Bubble Popper</Text>
        <Text style={styles.instructions}>
          Tap anywhere to shoot lasers and pop bubbles!{'\n'}
          You have 120 seconds to get the highest score.
        </Text>
        <Pressable style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </Pressable>
      </ImageBackground>
    );
  }

  // Game Screen
  return (
    //adding background image
    <ImageBackground
    source={require('./assets/background1.png')}
    style={styles.gameContainer}
    resizeMode="cover"  
    >
      <Pressable style={styles.gameContainer} onPress={handleTap}>
        {/* Score and Timer */}
        <View style={styles.hud}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.timerText}>Time: {timeLeft}s</Text>
        </View>

        {/* Bubbles */}
        {bubbles.map(bubble => (
          <Bubble
            key={bubble.id}
            x={bubble.x}
            y={bubble.y}
            radius={bubble.radius}
            color={bubble.color}
          />
        ))}

        {/* render the pop effects*/}
        {popEffects.map(effect => (
          <PopEffect 
            key={effect.id}
            x={effect.x}
            y={effect.y}
          />
        ))}


        {/* Laser */}
        {laser && (
          <Laser
            x={laser.x}
            visible={laser.visible}
          />
        )}
        
        {/* Gun */}
        <Gun x={gunX} />
        
      </Pressable>
    </ImageBackground>
  );
      }

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // to make image the full screen
  },

  overlay: {
    flex: 1,
    position: 'relative',
  },

  gameContainer: {
    flex: 1,
    //backgroundColor: '#ADD8E6',
    position: 'relative',
  },

  hud: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1000,
  },

  scoreText: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'LuckiestGuy_400Regular',

  },

  timerText: {
    color: '#fff',
    fontSize: 35,
    fontWeight: 'bold',
    fontFamily: 'LuckiestGuy_400Regular',

  },

  startContainer: {
    flex: 1,
    //backgroundColor: '#001122',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: {
    color: '#DAA520',
    fontSize: 90,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'LuckiestGuy_400Regular',
    textAlign: 'center',
    textShadowColor: '#F0E68C',  
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 3,
  },

  instructions: {
    color: '#483D8B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: 'LuckiestGuy_400Regular',
  },

  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },

  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'LuckiestGuy_400Regular',

  },

  gameOverContainer: {
    flex: 1,
    //backgroundColor: '#001122',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  gameOverTitle: {
    color: '#ff4444',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'LuckiestGuy_400Regular',
    textShadowColor: '#B22222',  
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 3,
  },

  finalScore: {
    color: '#483D8B',
    fontSize: 30,
    marginBottom: 40,
    fontFamily: 'LuckiestGuy_400Regular',
  },

  playAgainButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },

  playAgainText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'LuckiestGuy_400Regular',
  },

});
