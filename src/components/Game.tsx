import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { words } from './data';
import { colors } from '../../assets/colors';
import Keyboard from './Keyboard';
import useScore from './useScore';

import Animated, {
  SlideInLeft,
  FlipInEasyX,
  FlipInEasyY,
  SlideOutLeft,
  RollInRight,
  ZoomInUp,
  SlideOutRight,
  BounceIn,
  BounceInLeft,
  BounceInRight,
  BounceInUp,
} from 'react-native-reanimated';
import ModalComponent from './ModalComponent';
import { AntDesign } from '@expo/vector-icons';
import Prompter from './Prompter';
import UserAvatar from './UserAvatar';
import { CheckKeyColor, checkWord, handleScore } from './Helper';
const TOTAL_SCORE = 150;
const MAX_ROUND = 3;

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
  const roundCount = useRef(0);
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState('');

  const playerScore = useRef(player.score);

  const keyBoardColors = {
    [colors.yellow]: [],
    [colors.green]: [],
    [colors.gray]: [],
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    !gameOver && handleScore();
  }, [allGuesses]);

  const handleScore = () => {
    if (!player || player.score == null) {
      console.error('Player or score is null or undefined');
      return;
    }

    if (typeof foundTheWord !== 'boolean') {
      console.error('foundTheWord is not a boolean value');
      return;
    }

    if (attempt < 0 || attempt > 5) {
      console.error('Attempt value is out of range');
      return;
    }

    if (foundTheWord) {
      playerScore.current += 1;
      setAttempt(0);

      roundCount.current += 1;

      setGameOver(true);
    } else if (attempt === 5) {
      roundCount.current += 1;

      if (!foundTheWord) {
        ToastAndroid.show('You lost', ToastAndroid.SHORT);
        setShowInfo(true);
        setInfo('lost');
      }

      setGameOver(true);
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
    setAllGuesses([]);
    setGuess(['', '', '', '', '']);
    setCol(0);
    setRow(0);
    setGameOver(false);
    newWord();
    setFoundTheWord(false);
    setAttempt(0);
    setShowInfo(false);
  };

  const renderGuesses = () => {
    return (
      <View style={styles.guessedWordsContainer}>
        {foundTheWord && gameOver ? (
          <ModalComponent
            secretWord={secretWord}
            gameOver={gameOver}
            playerScore={playerScore}
            roundCount={roundCount}
            resetGame={resetGame}
          />
        ) : (
          allGuesses.map((row, rowIndex) => {
            correctpos.current = 0; // set correctpos to zero for each row

            return (
              <Animated.View
                entering={SlideInLeft}
                exiting={SlideOutLeft}
                key={rowIndex}
                style={[styles.guessRow, { backgroundColor: colors.light }]}>
                {row.map((letter, cellIndex) => {
                  const { key, color } = CheckKeyColor({
                    letter,
                    cellIndex,
                    secretWord,
                    correctpos,
                  });

                  keyBoardColors[color].push(key);

                  const cellStyle = {
                    ...styles.guessCell,
                    backgroundColor: letter === '?' ? 'red' : color,
                    bordercolor: colors.lightDark,
                    borderwidth: 2,
                  };
                  if (correctpos.current === 5) {
                    setFoundTheWord(true);
                    setGuess(allGuesses[allGuesses.length - 1]);
                    handleScore();
                  }

                  return (
                    <Animated.View
                      entering={
                        letter === '?'
                          ? ZoomInUp.delay(300 * cellIndex)
                          : FlipInEasyX.delay(300 * cellIndex)
                      }
                      exiting={FlipInEasyY.delay(300 * cellIndex)}
                      key={cellIndex}
                      style={cellStyle}>
                      <Text style={styles.letter}>{letter}</Text>
                    </Animated.View>
                  );
                })}
              </Animated.View>
            );
          })
        )}
      </View>
    );
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
    player.score = 0;
    player.name = '';
    setPlayer(player);
    navigation.navigate('Home');
    roundCount.current = 0;
  };
  const handleScoreDisplay = () => {
    const newScore = useScore({ secretWord, attempt, allGuesses });
    console.log(newScore);
    return TOTAL_SCORE - newScore;
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
        <Text style={styles.headerText}>
          {handleScoreDisplay()}/{TOTAL_SCORE}
        </Text>
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
            name='infocirlce'
            color={colors.light}
            style={{ fontWeight: 'bold' }}
            onPress={() => {
              setInfo('info');
              setShowInfo(!showInfo);
            }}
          />
        </View>
        <UserAvatar player={player} />
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

      {renderGuesses()}

      {/* keyboard */}
      <View style={styles.keyboardContainer}>
        <Keyboard
          onPress={onPress}
          foundTheWord={foundTheWord}
          gameOver={gameOver}
          keyboardColors={keyBoardColors}
        />
      </View>
      {showInfo && proptUser()}
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
  },

  guessedWordsContainer: {
    flex: 1,
    backgroundColor: colors.light,
    margin: 20,
  },
  keyboardContainer: {
    flex: 3 / 4,

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
