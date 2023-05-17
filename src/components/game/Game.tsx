import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { words } from '../../utils/data';
import { colors } from '../../utils/constants';
import Keyboard from '../keyboard/Keyboard';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';
import Prompter from '../prompters/Prompter';
import UserAvatar from '../prompters/UserAvatar';
import {
  getDate,
  handleScoreDisplay,
  keyBoardColors,
  storeData,
} from '../../utils/Helper';

import renderGuesses from './RenderGuesses';
import PlayerData from '../prompters/PlayerData';
import KeyPressRender from './KeyPressRender';
import { MAX_ATTEMPTS, MAX_ROUND, TOTAL_SCORE } from '../../utils/constants';
import ModalComponent from '../prompters/ModalComponent';
import InsetShadow from 'react-native-inset-shadow';

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
  const [attempt, setAttempt] = useState(0);
  const roundCount = useRef(1);
  const [showInfo, setShowInfo] = useState(false);
  const [info, setInfo] = useState('');
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
  // useEffect(() => {
  //   async function fetchData() {
  //     const userData = await retrieveData({ userName: player.name });

  //     if (userData !== null) {
  //       const { gameState } = userData;

  //       console.log('usetate retrieve data', gameState, userData);

  //       if (gameState !== null && userData.userData !== undefined) {
  //         setAllGuesses(gameState.allGuesses);
  //         setSecretWord(gameState.secretWord);
  //         setGameOver(gameState.gameOver);
  //         setRow(gameState.row);
  //         setCol(gameState.col);
  //         setFoundTheWord(gameState.foundTheWord);
  //         setAttempt(gameState.attempt);
  //         playerScore.current = gameState.playerScore;
  //         setShowInfo(gameState.showInfo);
  //         if (userData.userData.name === player.name) {
  //           setPlayer(userData.userData);
  //         }
  //       } else {
  //         // Handle the case when gameState is null or userData.userData is undefined
  //         // Perform any necessary actions or set default values
  //       }
  //     } else {
  //       // Handle the case when userData is null
  //       // Perform any necessary actions or set default values
  //     }
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  }, []);

  useEffect(() => {
    if (roundCount.current === MAX_ROUND + 1) {
      setGameOver(true);
      setInfo('gameover');
      setShowInfo(true);
    } else {
      if (giveup) {
        giveUpPoints.current += (MAX_ATTEMPTS - attempt) * 10;
        setInfo('');
        setRoundIsOver(true);
        handleRoundIsOver();
      } else if (foundTheWord) {
        setRoundIsOver(true);
      } else if (attempt === MAX_ATTEMPTS) {
        console.log('attempt', attempt);
        setGuess(secretWord);
        setInfo('info');
        setRoundIsOver(true);
        setShowInfo(true);
      }
    }
    setGiveup(false); // Reset giveup flag
  }, [attempt, giveup, foundTheWord]); // Include foundTheWord in the dependencies

  const handleRoundIsOver = () => {
    roundCount.current += 1;
    resetRound();
  };

  const resetRound = () => {
    setAllGuesses([]);
    setGiveup(false);
    setCol(0);
    setRow(0);
    setGuess(['', '', '', '', '']);
    setFoundTheWord(false);
    setAttempt(0);
    setRoundIsOver(false);
    setShowInfo(false);
    newWord();
    setInfo('');
    for (let key in keyBoardColors) {
      keyBoardColors[key] = [];
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
    roundCount.current = 1;
    playerScore.current = { 1: 0, 2: 0, 3: 0 };
    for (let key in keyBoardColors) {
      keyBoardColors[key] = [];
    }
    setAllGuesses([]);
    score.current = TOTAL_SCORE;
    giveUpPoints.current = 0;
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
        handleRoundIsOver={handleRoundIsOver}
      />
    );
  };
  console.log('game ovaaaa', gameOver);
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
        <Animated.View entering={SlideInUp.duration(1000)}>
          <Text style={styles.headerText}>
            <Animated.Text
              style={{
                fontFamily: 'Ultra-Regular',
                color: colors.red,
                fontSize: 23,
                textAlign: 'center',
                alignSelf: 'center',
              }}>
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
            </Animated.Text>
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
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign
            size={35}
            name='infocirlceo'
            color={colors.light}
            style={{ fontWeight: 'bold' }}
            onPress={() => {
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
          const scale = isCurrentRow && !foundTheWord ? 1.05 : 0.9;
          const borderColor =
            isCurrentRow && !foundTheWord ? colors.green : 'transparent';

          return (
            <Animated.View key={index} style={styles.guessCell}>
              <InsetShadow
                containerStyle={{
                  ...styles.shadow,
                  transform: [{ scale: roundIsOver ? 0.95 : scale }],
                  borderColor: isCurrentRow ? 'green' : 'transparent',
                  backgroundColor: foundTheWord ? colors.green : 'transparent',
                }}
                shadowColor={isCurrentRow ? 'green' : 'black'}
                elevation={6}
                shadowOpacity={1}>
                <Text style={[styles.letter, { color: colors.lightDark2 }]}>
                  {letter.toUpperCase()}
                </Text>
              </InsetShadow>
            </Animated.View>
          );
        })}
      </View>
      {foundTheWord && roundIsOver ? (
        <View style={styles.modalContainer}>
          <ModalComponent
            secretWord={secretWord}
            roundIsOver={roundIsOver}
            playerScore={playerScore}
            setAllGuesses={setAllGuesses}
            handleRoundIsOver={handleRoundIsOver}
          />
        </View>
      ) : (
        renderGuesses({
          secretWord,
          allGuesses,
          correctpos,
          setFoundTheWord,
          setGuess,
          keyBoardColors,
          setRoundIsOver,
        })
      )}

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
  shadow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameWrapper: {
    alignSelf: 'stretch',
    backgroundColor: colors.light,
    flex: 1,
    gap: 5,
  },
  headerText: {
    fontSize: 25,
    fontFamily: 'Ultra-Regular',
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
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },

  guessCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  letter: {
    color: colors.lightDark,
    fontSize: 30,
    fontFamily: 'Ultra-Regular',
  },
});

export default Game;
