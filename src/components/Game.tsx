import React, { useState, useRef, useEffect, RefObject } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../assets/colors';
import { words } from './data';
import Animated, {
  SlideInDown,
  SlideInLeft,
  SlideInUp,
  SlideOutRight,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import RenderGuesses from './RenderGuesses';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import Keyboard from './Keyboard';
import { CustomTextInput } from 'react-native-custom-keyboard';

const Wordle = (props: any) => {
  const validWords = words;
  const [word, setWord] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [secretWord, setSecretWord]: any = useState([]);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [inputTiles, setInputTiles] = useState(['', '', '', '', '']);
  const [inputTilesArray, setInputTilesArray] = useState<Array<Array<string>>>(
    [],
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const inputRefs = useRef([]);

  //creates a random word from the words array when mounted
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    ToastAndroid.showWithGravity(
      feedback,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
    ToastAndroid.show(feedback, ToastAndroid.SHORT);
  }, [feedback]);

  //handles the ref changes
  useEffect(() => {
    if (gameOver) return;
    inputRefs.current = inputRefs?.current?.slice(0, inputTiles.length);
    if (inputRefs.current.length > 0) {
      inputRefs.current[0]?.focus();
    }
  }, [inputTiles]);

  const checkGuess = () => {
    // Check if the guessed word is valid and has five letters
    if (!guess.trim()) {
      setFeedback('Please enter a valid guess.');
      return;
    }
    // Check if the guessed word is valid and has five letters
    if (validWords.includes(guess) && guess.length === 5) {
      // Count the number of correct letters and correct positions
      let correctLetters = 0;
      let correctPositions = 0;
      for (let i = 0; i < 5; i++) {
        if (guess[i] === secretWord[i]) {
          correctPositions++;
        } else if (secretWord.includes(guess[i])) {
          correctLetters++;
        }
      }
      // Update the feedback message
      if (correctPositions === 5) {
        setFeedback('You win!');
        setGameOver(true);
      } else {
        setFeedback(
          `Correct letters: ${correctLetters}, correct positions: ${correctPositions}`,
        );
      }
    } else {
      setFeedback('Invalid guess, try again.');
    }
    // Add the guess to the array of guesses
    setGuesses([...guesses, guess]);
    // Add the input tiles for this guess to the array of input tiles
    setInputTilesArray([...inputTilesArray, inputTiles]);
    // Clear the guess input field
    setGuess('');
    // Clear the input tiles for the next guess
    setInputTiles(['', '', '', '', '']);
    setAttempts(attempts + 1);
  };

  function renderGuesses({ row }) {
    const boxes = [];
    let greenCount = 0;
    for (let i = 0; i < 5; i++) {
      console.log('row', row);
      let color = '';
      if (row.length > i) {
        console.log('row in length', row, secretWord);
        const letter = row[i].toLowerCase();
        if (letter === secretWord[i]) {
          console.log('colors.green', colors.green);
          color = colors.green;
          greenCount++;
        } else if (secretWord.includes(letter)) {
          console.log('colors.yellow', colors.yellow);
          color = colors.yellow;
        } else {
          color = colors.gray;
        }
      }

      boxes.push(
        <Animated.View
          entering={SlideInLeft}
          exiting={SlideOutRight}
          key={i}
          style={[styles.secretWordBox, { backgroundColor: color }]}>
          <Text style={styles.secretWordLetter}>{row[i].toUpperCase()}</Text>
        </Animated.View>,
      );
    }
    return <View style={styles.guessRow}>{boxes}</View>;
  }

  const resetGame = () => {
    // Select a new secret word and reset the state variables
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
    setGuess('');
    setGuesses([]);
    setFeedback('');
    setInputTiles(['', '', '', '', '']);
    setInputTilesArray([]);
    setAttempts(0);
    setGameOver(false);
  };

  const handleTextChange = (text: string, index: number) => {
    const newInputTiles = [...inputTiles];
    if (text) {
      newInputTiles[index] = text[text.length - 1];
    }
    setInputTiles(newInputTiles);
    setGuess(newInputTiles.join(''));

    if (text.length === 1) {
      if (index < inputTiles.length - 1) {
        setTimeout(() => {
          inputRefs.current.length <= 5 &&
            inputRefs.current[index + 1]?.focus();
        }, 0.1);
      } else if (newInputTiles.length >= 4) {
        inputRefs.current[index]?.blur();
      }
    }
  };

  // Render the row of boxes representing the player's guesses

  console.log('game over', gameOver);
  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
        backgroundColor: colors.light,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}>
      <View style={{ position: 'absolute', top: 10, right: 10 }}>
        <Ionicons name='md-help-circle' size={32} color='black' />
      </View>

      <View
        style={{
          display: 'flex',
          position: 'absolute',
          top: 10,
          left: 10,
          borderColor: colors.lightDark,
          borderWidth: 1,
          borderRadius: 5,
          padding: 5,
        }}>
        <Text
          style={{
            color: colors.lightDark,
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          {props?.player?.name.toUpperCase()}
        </Text>
      </View>
      {gameOver ? (
        <View
          style={{
            display: 'flex',
            backgroundColor: 'gray',
            margin: 20,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1 / 3,
          }}>
          <Text
            style={{
              display: 'flex',
              color: colors.lightDark,
            }}>
            YOU WIN on the {`${attempts}`} attempt
          </Text>
          <TouchableOpacity
            style={{
              display: 'flex',
              backgroundColor: colors.green,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 10,
              marginTop: 20,
            }}
            onPress={() => setGameOver(false)}>
            <Text>NEXT ROUND</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ display: 'flex' }}>
          <Text style={styles.headers}>
            {attempts < 5
              ? 'Guess the secret word (5 letters):'
              : 'secret word is:'}
          </Text>

          <View style={styles.secretWordRow}>
            {secretWord.map((letter: string, index: number) => (
              <View key={index} style={styles.secretWordBox}>
                <Text style={styles.secretWordLetter}>
                  {letter?.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.inputRow}>
            {inputTiles.map((value: string, index: number) => (
              <TextInput
                ref={(ref: any) => (inputRefs.current[index] = ref)}
                key={index}
                style={styles.inputBox}
                maxLength={1}
                editable={attempts < 5 || gameOver}
                autoCapitalize={'characters'}
                onChangeText={(text: any) => handleTextChange(text, index)}
                value={value?.toUpperCase()}
                keyboardAppearance='dark'
                keyboardType='default'
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Button
              color={colors.green}
              title={'Guess'}
              onPress={() => checkGuess()}
            />
            <Button color='red' title={'Reset'} onPress={() => resetGame()} />
          </View>
        </View>
      )}
      <View
        style={{
          borderColor: colors.lightDark,
          borderWidth: 1,
          paddingVertical: 2,
        }}>
        {inputTilesArray.length > 0 ? (
          inputTilesArray.map((row, rowIndex) => {
            return (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
                key={rowIndex}>
                {renderGuesses({ row })}
              </View>
            );
          })
        ) : (
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.lightDark,
            }}>
            NO GUESSES YET
          </Text>
        )}
      </View>

      <View style={styles.attemptsRow}>
        <Text style={styles.attemptsText}>{`Attempts: ${attempts}`}</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Keyboard onPress={handleTextChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headers: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  secretWordRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
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
  secretWordLetter: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.light,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.dark,
    marginHorizontal: 5,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    gap: 20,
    marginTop: 20,
  },
  feedbackRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.light,
  },
  guessRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  box: {
    width: 20,
    height: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  attemptsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  attemptsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.lightDark,
  },
});

export default Wordle;
