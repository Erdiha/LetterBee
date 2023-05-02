import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { words } from './data';
import { colors } from '../../assets/colors';
import Keyboard from './Keyboard';
import { IPlayer } from '../screens/types';
import Animated, {
  SlideInLeft,
  FlipInEasyX,
  FlipInEasyY,
} from 'react-native-reanimated';
import ModalComponent from './ModalComponent';

const Game = ({ player, setPlayer }) => {
  const validWords = words;
  const [allGuesses, setAllGuesses] = useState<Array<Array<string>>>([]);
  const [secretWord, setSecretWord]: any = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const correctpos = useRef(0);
  const [guess, setGuess] = useState(['', '', '', '', '']);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [foundTheWord, setFoundTheWord] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    if (correctpos.current === 5) {
      console.log('win');
      setGameOver(true);
      correctpos.current = 0;
    }
  }, [correctpos.current, correctpos]);

  const newWord = () => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  };

  const renderGuesses = () => {
    return (
      <View style={styles.guessedWordsContainer}>
        {gameOver ? (
          <View>
            <Text>
              {player.score} {secretWord}
            </Text>
          </View>
        ) : (
          allGuesses.map((row, rowIndex) => {
            correctpos.current = 0; // set correctpos to zero for each row
            return (
              <Animated.View
                entering={SlideInLeft}
                key={rowIndex}
                style={[styles.guessRow, { backgroundColor: colors.light }]}>
                {row.map((letter, cellIndex) => {
                  const color = checkWin({ letter, cellIndex });

                  const cellStyle = {
                    ...styles.guessCell,
                    backgroundColor: color,
                  };

                  if (correctpos.current === 5) {
                    handleScore();
                  }
                  console.log('correct pos', correctpos.current);
                  return (
                    <Animated.View
                      entering={FlipInEasyX.delay(300 * cellIndex)}
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
    console.log('letter', letter, guess);
    if (letter === 'ENTER') {
      if (guess.includes('')) {
        return;
      }
      setAllGuesses([...allGuesses, guess]);
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

  const resetGame = () => {
    setAllGuesses([]);
    setGuess(['', '', '', '', '']);
    setCol(0);
    setRow(0);
    setGameOver(false);
    newWord();
    setFoundTheWord(false);
  };

  const checkWin = ({ letter, cellIndex }) => {
    const matchingIndexes = [];
    for (let i = 0; i < secretWord.length; i++) {
      if (secretWord[i].toLowerCase() === letter.toLowerCase()) {
        matchingIndexes.push(i);
      }
    }
    if (matchingIndexes.includes(cellIndex)) {
      correctpos.current += 1;
      return colors.green;
    } else if (matchingIndexes.length > 0) {
      return colors.yellow;
    } else {
      return colors.gray;
    }
  };
  const handleScore = () => {
    setGameOver(true);
    setFoundTheWord(true);
    setGuess(allGuesses[allGuesses.length - 1]);
  };

  return (
    <View style={styles.gameWrapper}>
      <Text style={styles.headerText}>
        {player.name} {player.score} {secretWord}
      </Text>

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
                  backgroundColor: foundTheWord
                    ? colors.green
                    : colors.lightDark,
                },
              ]}>
              <Text style={styles.letter}>{letter.toUpperCase()}</Text>
            </Animated.View>
          ) : (
            <View
              key={index}
              style={[
                styles.guessCell,
                {
                  backgroundColor: foundTheWord
                    ? colors.green
                    : colors.lightDark,
                },
              ]}>
              <Text style={styles.letter}>{letter.toUpperCase()}</Text>
            </View>
          ),
        )}
      </View>

      <TouchableOpacity
        onPress={() => resetGame()}
        style={styles.controlContainer}>
        <Text
          style={{
            fontSize: 20,
            alignSelf: 'center',
            borderWidth: 2,
            borderColor: colors.yellow,
            padding: 10,
          }}>
          START OVER
        </Text>
      </TouchableOpacity>

      {/*  tiles rows with guessed words */}

      {gameOver ? (
        <ModalComponent gameOver={gameOver} setGameOver={setGameOver} />
      ) : (
        renderGuesses()
      )}

      {/* keyboard */}
      <View style={styles.keyboardContainer}>
        <Keyboard onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  secretWordLetter: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.light,
  },
  secretWordBox: {
    width: 30,
    height: 30,
    backgroundColor: colors.lightDark,
    marginHorizontal: 3,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.light,
  },
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
    backgroundColor: colors.yellow,
    margin: 10,
  },
  controlContainer: {
    flex: 1 / 5,

    justifyContent: 'center',
    alignItems: 'center',
  },
  guessedWordsContainer: {
    flex: 1,
    backgroundColor: colors.light,
    margin: 10,
  },
  keyboardContainer: {
    flex: 3 / 4,

    alignSelf: 'stretch',
    width: '100%',
  },
  guessRow: {
    flex: 1 / 5,
    backgroundColor: colors.lightDark,
    flexDirection: 'row',
    display: 'flex',
  },

  guessCell: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: colors.light,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    color: colors.light,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});

export default Game;
