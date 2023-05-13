import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { words } from '../../utils/data';
import { colors } from '../../utils/colors';
import Keyboard from '../keyboard/Keyboard';
import Animated, { BounceIn } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import Prompter from '../prompters/Prompter';
import UserAvatar from '../prompters/UserAvatar';
import {
  getDate,
  getScoreSum,
  handleScoreDisplay,
  keyBoardColors,
  retrieveData,
  storeData,
} from '../../utils/Helper';

import renderGuesses from './RenderGuesses';
import PlayerData from '../prompters/PlayerData';
import KeyPressRender from './KeyPressRender';
import { MAX_ATTEMPTS, MAX_ROUND, TOTAL_SCORE } from '../../utils/constants';

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
  const [info, setInfo] = useState('info');
  const playerScore = useRef({ 1: 0, 2: 0, 3: 0 });
  const [showProfile, setShowProfile] = useState(false);
  const [roundIsOver, setRoundIsOver] = useState(false);
  const [giveup, setGiveup] = useState(false);
  const giveUpPoints = useRef(0);
  console.log('player', player);

  const score = useRef(0);
  const data = {
    allGuesses,
    secretWord,
    gameOver,
    correctpos: correctpos.current,
    guess,
    row,
    col,
    foundTheWord,
    attempt,
    roundCount: roundCount.current,
    showInfo,
    info,
    playerScore: playerScore.current,
    showProfile,
    roundIsOver,
  };
  const newWord = () => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  };
  useEffect(() => {
    async function fetchData() {
      const userData = await retrieveData({ userName: player.name });

      if (userData !== null) {
        const { gameState } = userData;

        console.log('usetate retrieve data', gameState, userData);

        if (gameState !== null && userData.userData !== undefined) {
          setAllGuesses(gameState.allGuesses);
          setSecretWord(gameState.secretWord);
          setGameOver(gameState.gameOver);
          setRow(gameState.row);
          setCol(gameState.col);
          setFoundTheWord(gameState.foundTheWord);
          setAttempt(gameState.attempt);
          playerScore.current = gameState.playerScore;
          setShowInfo(gameState.showInfo);
          if (userData.userData.name === player.name) {
            setPlayer(userData.userData);
          }
        } else {
          // Handle the case when gameState is null or userData.userData is undefined
          // Perform any necessary actions or set default values
        }
      } else {
        // Handle the case when userData is null
        // Perform any necessary actions or set default values
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    handleScore();
    if (giveup) {
      if (attempt < MAX_ATTEMPTS && !foundTheWord) {
        giveUpPoints.current += (MAX_ATTEMPTS - attempt) * 10;
      }
      setGiveup(false);
      handleScore();
    }
  }, [allGuesses, foundTheWord, score.current, attempt, roundIsOver, giveup]);

  const handleScore = () => {
    if (roundCount.current === MAX_ROUND) {
      setGameOver(true);
      setInfo('gameover');
      setShowInfo(true);
    }
    if (foundTheWord) {
      setRoundIsOver(true);
      ToastAndroid.show('You found the word', ToastAndroid.SHORT);
    } else if (attempt === MAX_ATTEMPTS && foundTheWord) {
      setRoundIsOver(true);
    } else if (attempt === MAX_ATTEMPTS && !foundTheWord) {
      setInfo('lost');
      setRoundIsOver(true);
      setShowInfo(true);
    }
  };

  const proptUser = () => {
    return (
      <Prompter
        attempt={attempt}
        roundCount={roundCount}
        score={score}
        type={info}
        resetRound={resetRound}
        secretWord={secretWord}
        setShowInfo={setShowInfo}
        handleNewGame={handleNewGame}
        gameOver={gameOver}
        setAllGuesses={setAllGuesses}
        foundTheWord={foundTheWord}
        setGiveup={setGiveup}
        setGameOver={setGameOver}
      />
    );
  };

  const resetRound = () => {
    for (let key in keyBoardColors) {
      keyBoardColors[key] = [];
    }

    setCol(0);
    setRow(0);
    setGuess(['', '', '', '', '']);
    setFoundTheWord(false);
    setAttempt(0);
    setRoundIsOver(false);
    setShowInfo(false);
    newWord();
    setInfo('info');
    roundCount.current += 1;

    if (roundCount.current === MAX_ROUND) {
      setGameOver(true);
    }
  };

  const handleNewGame = () => {
    const userData = { score: score.current, date: getDate() };
    player.info.push(userData);

    console.log('handle new game', userData, 'player', player);

    storeData({ userData: player, type: 'userData' });
    storeData({ gameState: data, type: 'gameState' });

    resetRound();
    setGameOver(false);
    giveUpPoints.current = 0;
    roundCount.current = 1;
    playerScore.current = { 1: 0, 2: 0, 3: 0 };
    for (let key in keyBoardColors) {
      keyBoardColors[key] = [];
    }
    setAllGuesses([]);
    score.current = TOTAL_SCORE;
  };

  const onPress = KeyPressRender(
    guess,
    setAttempt,
    attempt,
    secretWord,
    setAllGuesses,
    allGuesses,
    setGuess,
    setRow,
    row,
    col,
  );

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
              {handleScoreDisplay(
                allGuesses,
                roundCount,
                playerScore,
                secretWord,
                attempt,
                score,
                foundTheWord,
                giveup,
                giveUpPoints,
              )()}
            </Text>
            /{TOTAL_SCORE} {secretWord}
          </Text>
        </Animated.View>

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
        {guess?.map((letter, index) => {
          const isCurrentRow = row === index;
          const scale = isCurrentRow && !foundTheWord ? 1.1 : 0.9;
          const borderColor =
            isCurrentRow && !foundTheWord ? colors.red : colors.lightDark;
          const textColor = foundTheWord ? colors.light : colors.lightDark;
          return (
            <View
              key={index}
              style={[
                styles.guessCell,
                {
                  backgroundColor: foundTheWord ? colors.green : colors.light,
                  borderColor: borderColor,
                  transform: [{ scale: scale }],
                },
              ]}>
              <Animated.View>
                <Text style={[styles.letter, { color: textColor }]}>
                  {' '}
                  {letter.toUpperCase()}
                </Text>
              </Animated.View>
            </View>
          );
        })}
      </View>
      {renderGuesses({
        playerScore,
        secretWord,
        foundTheWord,
        roundIsOver,
        roundCount,
        resetRound,
        allGuesses,
        correctpos,
        setFoundTheWord,
        setGuess,
        handleScore,
        keyBoardColors,
        setAllGuesses,
        score,
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
        {showProfile && PlayerData({ player, setShowProfile, setPlayer })}
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
    elevation: 5,
    borderRadius: 8,
    margin: 5,
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
