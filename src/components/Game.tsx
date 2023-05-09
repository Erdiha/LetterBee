import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { words } from './data';
import { colors } from '../../assets/colors';
import Keyboard from './Keyboard';
import useScore from './useScore';
import Animated, { FlipInEasyX, BounceIn } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import Prompter from './Prompter';
import UserAvatar from './UserAvatar';
import {
  checkWord,
  getDate,
  getScoreSum,
  keyBoardColors,
  retrieveData,
  sortInfoByScore,
  storeData,
} from './Helper';
const TOTAL_SCORE = 150;
const MAX_ROUND = 3;
import renderGuesses from './RenderGuesses';
import PlayerData from './PlayerData';

const Game = ({ player, setPlayer, navigation }) => {
  const validWords = words;
  const [allGuesses, setAllGuesses] = useState<Array<Array<string>>>([]);
  const [secretWord, setSecretWord]: any = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const correctpos = useRef(0);
  const [guess, setGuess] = useState(['', '', '', '', '']);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [foundTheWord, setFoundTheWord] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const roundCount = useRef(1);
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState('');
  const playerScore = useRef({ 1: 0, 2: 0, 3: 0 });
  const [showProfile, setShowProfile] = useState(false);
  const [roundIsOver, setRoundIsOver] = useState(false);
  const data = {
    allGuesses,
    secretWord,
    gameOver,
    guess,
    row,
    col,
    foundTheWord,
    attempt,
    roundCount: roundCount.current,
    showInfo,
    playerScore: playerScore.current,
    showProfile,
    roundIsOver,
    player,
  };

  useEffect(() => {
    async function fetchData() {
      const { userData, gameState } = await retrieveData();
      setPlayer(userData);
      console.log('retrieve data', gameState, userData);
      if (gameState) {
        setAllGuesses(gameState.allGuesses);
        setSecretWord(gameState.secretWord);
        setGameOver(gameState.gameOver);
        setRow(gameState.row);
        setCol(gameState.col);
        setFoundTheWord(gameState.foundTheWord);
        setAttempt(gameState.attempt);
        playerScore.current = gameState.playerScore;
        setShowInfo(gameState.showInfo);
        setPlayer(gameState.player);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    if (roundCount.current === MAX_ROUND + 1) {
      setGameOver(true);
    }
    if (roundIsOver) {
      roundCount.current += 1;
      resetGame();
    }
  }, [roundIsOver]);

  useEffect(() => {
    !roundIsOver && handleScore();
  }, [allGuesses]);

  useEffect(() => {
    setInfo('gameover');
    if (gameOver) {
      console.log('getscoresum', getScoreSum(playerScore));
      const userData = { score: getScoreSum(playerScore), date: getDate() };
      player?.info?.push(userData);
      sortInfoByScore({ setPlayer });
      storeData({ playerData: player, type: 'user' });
      handleNewGame();
    }
  }, [gameOver]);

  const handleScore = () => {
    if (attempt < 0 || attempt > 5) {
      console.error('Attempt value is out of range');
      return;
    }

    if (foundTheWord) {
      // playerScore.current += 1;
      setAttempt(0);
      setRoundIsOver(true);
      setAllGuesses([]);
    } else if (attempt === 5) {
      if (!foundTheWord) {
        setAllGuesses([]);
        ToastAndroid.show('You lost', ToastAndroid.SHORT);
        setShowInfo(true);
        setInfo('lost');
        setRoundIsOver(true);
      }
    }
  };

  const newWord = () => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  };

  const proptUser = () => {
    return (
      <Prompter
        attempt={attempt}
        roundCount={roundCount}
        player={player}
        type={info}
        handleNewGame={handleNewGame}
        resetGame={resetGame}
        secretWord={secretWord}
        setShowInfo={setShowInfo}
      />
    );
  };

  const resetGame = () => {
    setCol(0);
    setRow(0);
    newWord();
    setAllGuesses([]);
    setGuess(['', '', '', '', '']);
    setFoundTheWord(false);
    setAttempt(0);
    setRoundIsOver(false);
    gameOver
      ? setShowInfo(true)
      : setTimeout(() => {
          setShowInfo(false);
        }, 2000);
  };

  const onPress = (letter: string) => {
    if (letter === 'ENTER') {
      if (guess.includes('')) {
        return;
      }
      setAttempt(attempt + 1);
      checkWord({ row: guess }).then((result) => {
        if (result) {
          setAllGuesses([...allGuesses, guess]);
        } else {
          ToastAndroid.show('INVALID WORD!!!', ToastAndroid.SHORT);
          setAllGuesses([...allGuesses, ['?', '?', '?', '?', '?']]);
        }
      });
      handleScore();
      setGuess(['', '', '', '', '']);
      setRow(0);
    } else if (letter === 'backspace') {
      if (row === 0) {
        return;
      }
      if (row > 0) {
        guess[row - 1] = '';
        setGuess(guess);
        setRow(row - 1);
      } else {
        // If we're at the beginning of the row, delete the last letter
        const lastRow = allGuesses[col].slice(0, -1);
        setAllGuesses([...allGuesses.slice(0, -1), lastRow]);
        setRow(4);
      }
    } else {
      if (row === 5) {
        return;
      } else {
        guess[row] = letter;
        setGuess(guess);
        setRow(row + 1);
      }
    }
  };

  const handleNewGame = () => {
    resetGame();
    setGameOver(false);
    setPlayer(player);
    roundCount.current = 0;
    navigation.navigate('Home');
    playerScore.current = { 1: 0, 2: 0, 3: 0 };
    for (let key in keyBoardColors) {
      keyBoardColors[key] = [];
    }
  };

  const handleScoreDisplay = () => {
    const newScore = useScore({ secretWord, attempt, allGuesses });
    playerScore.current[roundCount.current] = newScore;
    const totalScore: number = getScoreSum(playerScore);
    console.log(
      'newScore',
      newScore,
      'roundCount',
      roundCount.current,
      playerScore.current,
    );

    return TOTAL_SCORE - totalScore;
  };

  return (
    <View style={styles.gameWrapper}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          display: 'flex',
          position: 'relative',
        }}>
        <Animated.View entering={BounceIn}>
          <Text style={styles.headerText}>
            <Text
              style={{ fontWeight: '700', color: colors.red, fontSize: 25 }}>
              {handleScoreDisplay()}{' '}
            </Text>
            /{TOTAL_SCORE}
          </Text>
        </Animated.View>
        {/* <Ionicons name='trail-sign' size={32} color='green' /> */}
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            right: 10,
            borderRadius: 50,
            backgroundColor: colors.lightDark,
            borderWidth: 5,
          }}>
          <AntDesign
            size={35}
            name='infocirlceo'
            color={colors.light}
            style={{ fontWeight: 'bold' }}
            onPress={() => {
              setInfo('info');
              setShowInfo(!showInfo);
            }}
          />
        </View>
        <UserAvatar player={player} setShowProfile={setShowProfile} />
      </View>
      {/* guess row tiles */}
      <View style={styles.guessRow}>
        {guess?.map((letter, index) =>
          foundTheWord ? (
            <Animated.View
              entering={FlipInEasyX.damping(0.5).delay(300 * index)}
              key={index}
              style={[
                styles.guessCell,
                {
                  backgroundColor: foundTheWord ? colors.green : colors.light,
                },
                {},
              ]}>
              <Text style={styles.letter}>{letter.toUpperCase()}</Text>
            </Animated.View>
          ) : (
            <Animated.View
              entering={BounceIn.delay(300 * index)}
              key={index}
              style={[
                styles.guessCell,
                {
                  backgroundColor: foundTheWord ? colors.green : colors.light,
                },
                {
                  transform: [{ scale: row === index ? 1.1 : 0.9 }],
                },

                { borderColor: row === index ? colors.red : colors.lightDark },
              ]}>
              <Text style={styles.letter}>{letter.toUpperCase()}</Text>
            </Animated.View>
          ),
        )}
      </View>

      {renderGuesses({
        playerScore,
        secretWord,
        foundTheWord,
        roundIsOver,
        roundCount,
        resetGame,
        allGuesses,
        correctpos,
        setFoundTheWord,
        setGuess,
        handleScore,
        keyBoardColors,
      })}

      {/* keyboard */}
      <View style={styles.keyboardContainer}>
        <Keyboard
          onPress={onPress}
          foundTheWord={foundTheWord}
          gameOver={gameOver}
          roundIsOver={roundIsOver}
          keyboardColors={keyBoardColors}
        />
      </View>
      <>
        {showInfo && proptUser()}
        {showProfile && PlayerData({ player, setShowProfile })}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  gameWrapper: {
    alignSelf: 'stretch',
    backgroundColor: colors.light,
    flex: 1,
    gap: 5,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Roboto',
    color: colors.lightDark,
    textAlign: 'center',
    padding: 10,
    backgroundColor: colors.light,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.lightDark,
    fontWeight: 'bold',
  },

  guessedWordsContainer: {
    flex: 1,
    backgroundColor: colors.light,
    margin: 20,
  },
  keyboardContainer: {
    flex: 2 / 3,

    alignSelf: 'stretch',
    width: '100%',
  },
  guessRow: {
    flex: 1 / 5,
    backgroundColor: colors.light,
    flexDirection: 'row',
    display: 'flex',
    width: '98%',
    alignSelf: 'center',
  },

  guessCell: {
    alignSelf: 'stretch',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 8,

    transition: 'transform 0.2s ease-out',
    cursor: 'pointer',
  },

  letter: {
    color: colors.lightDark,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});

export default Game;
