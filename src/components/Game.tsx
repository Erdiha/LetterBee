import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { words } from './data';
import { colors } from '../../assets/colors';
import Keyboard from './Keyboard';
import { IPlayer } from '../screens/types';
import Animated, {
  SlideInLeft,
  FlipInEasyX,
  FlipInEasyY,
  SlideOutLeft,
  RollInRight,
  ZoomInUp,
} from 'react-native-reanimated';
import ModalComponent from './ModalComponent';
import { AntDesign } from '@expo/vector-icons';
import Prompter from './Prompter';
import UserAvatar from './UserAvatar';
import { CheckKeyColor, checkWord } from './Helper';
import { EvilIcons } from '@expo/vector-icons';
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

  const keyBoardColors = {
    '#F7DB6A': [],
    '#7AA874': [],
    '#B7B7B7': [],
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    if (foundTheWord) {
      handleScore();
    }
    if (attempt === 5) {
      handleScore();
      if (!foundTheWord) {
        ToastAndroid.show('You lost', ToastAndroid.SHORT);
        setShowInfo(true);
        setInfo('lost');
      } else {
        ToastAndroid.show('You WIN!!!', ToastAndroid.SHORT);
      }
    }
  }, [attempt, gameOver, foundTheWord]);

  const handleScore = () => {
    if (foundTheWord) {
      player.score += 1;
      setPlayer(player);
      setAttempt(0);
    }

    roundCount.current += 1;
    setGameOver(true);
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
            setGameOver={setGameOver}
            player={player}
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
                    backgroundColor: letter === '' ? 'red' : color,
                    bordercolor: colors.lightDark,
                    borderwidth: 2,
                  };

                  if (correctpos.current === 5) {
                    setGuess(allGuesses[allGuesses.length - 1]);
                    setFoundTheWord(true);
                    handleScore();
                  }
                  return (
                    <Animated.View
                      entering={
                        letter === ''
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
      console.log('guess in on press', guess);

      checkWord({ row: guess }).then((result) => {
        console.log('result', result);
        if (result) {
          setAllGuesses([...allGuesses, guess]);
        } else {
          ToastAndroid.show('INVALID WORD!!!', ToastAndroid.SHORT);
          setAllGuesses([...allGuesses, ['', '', '', '', '']]);
        }
      });
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
    setPlayer(player);
    navigation.navigate('Home');
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
        <Text style={styles.headerText}>{secretWord}</Text>
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

      {/*  buttons  */}

      {/*  tiles rows with guessed words */}

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
    backgroundColor: colors.yellow,
    margin: 10,
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
    backgroundColor: colors.light,
    flexDirection: 'row',
    display: 'flex',
  },

  guessCell: {
    alignSelf: 'stretch',
    borderWidth: 2,

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  letter: {
    color: colors.light,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});

export default Game;
