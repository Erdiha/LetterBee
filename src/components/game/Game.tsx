import {
  View,
  Text,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { words } from '../../utils/data';
import { colors, keyBoardColors } from '../../utils/constants';
import Keyboard from '../keyboard/Keyboard';
import Prompter from '../prompters/Prompter';
import { getDate } from '../../utils/Helper';
import { getUserData, saveUserData } from '../asyncStorage/index';
import renderGuesses from './RenderGuesses';
import PlayerData from '../prompters/LeaderBoard';
import KeyPressRender from './KeyPressRender';
import { MAX_ATTEMPTS, MAX_ROUND, TOTAL_SCORE } from '../../utils/constants';
import ModalComponent from '../prompters/ModalComponent';
import GameBanner from './GameBanner';
import GuessContainer from './GuessContainer';
import { round } from 'react-native-reanimated';
import uuid from 'react-native-uuid';

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
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [roundIsOver, setRoundIsOver] = useState(false);
  const [giveup, setGiveup] = useState(false);
  const giveUpPoints = useRef(0);
  const score = useRef(0);
  const saveData = useRef(true);

  const newWord = () => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * validWords.length);
    setSecretWord(validWords[randomIndex].split(''));
    const fetchData = async () => {
      try {
        const savedData = await getUserData();
        if (savedData) {
          setPlayer({ ...player, info: savedData });
        }
      } catch (error) {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    };
    fetchData();
  }, []);

  const handleSaveScores = () => {
    player.info.push({
      id: uuid.v4(),
      score: score.current,
      date: getDate(),
      playerName: player?.name,
    });
    saveUserData(player.info);
    saveData.current = false;
  };

  useEffect(() => {
    if (roundCount.current === MAX_ROUND + 1) {
      setGameOver(true);
      saveData.current && handleSaveScores();
      setInfo('gameover');
      setTimeout(() => {
        setShowInfo(true);
      }, 1000);
    } else if (giveup) {
      giveUpPoints.current += (MAX_ATTEMPTS - attempt) * 10;
      setInfo('');
      setRoundIsOver(true);
      handleRoundIsOver();
    } else if (attempt === MAX_ATTEMPTS || foundTheWord) {
      setGuess(secretWord);
      setRoundIsOver(true);
      if (!foundTheWord) {
        setInfo('info');
        setTimeout(() => {
          setShowInfo(true);
        }, 1000);
      }
    }
    setGiveup(false); // Reset giveup flag
  }, [attempt, giveup, foundTheWord, secretWord]);

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
    setGameOver(false);

    roundCount.current = 1;
    playerScore.current = { 1: 0, 2: 0, 3: 0 };
    for (let key in keyBoardColors) {
      keyBoardColors[key] = [];
    }
    score.current = TOTAL_SCORE;
    giveUpPoints.current = 0;
    resetRound();
    saveData.current = true;
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
        secretWord={secretWord}
        setShowInfo={setShowInfo}
        handleNewGame={handleNewGame}
        gameOver={gameOver}
        setGiveup={setGiveup}
        setGameOver={setGameOver}
        handleRoundIsOver={handleRoundIsOver}
      />
    );
  };
  const handleModalClose = () => {
    setRoundIsOver(false);
  };
  return (
    <View style={styles.gameWrapper}>
      <GameBanner
        allGuesses={allGuesses}
        roundCount={roundCount}
        playerScore={playerScore}
        score={score}
        setShowInfo={setShowInfo}
        attempt={attempt}
        setShowProfile={setShowProfile}
        giveUpPoints={giveUpPoints}
        secretWord={secretWord}
        showInfo={showInfo}
        player={player}
      />

      <GuessContainer
        guess={guess}
        row={row}
        roundIsOver={roundIsOver}
        foundTheWord={foundTheWord}
      />
      {foundTheWord && roundIsOver ? (
        <View style={styles.modalContainer}>
          <ModalComponent
            roundCount={roundCount}
            playerScore={playerScore}
            roundIsOver={roundIsOver}
            handleRoundIsOver={handleRoundIsOver}
            secretWord={secretWord}
            setAllGuesses={setAllGuesses}
            onClose={handleModalClose}
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

      {showInfo && proptUser()}
      {showProfile && PlayerData({ player, setShowProfile, setPlayer })}
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
    borderRadius: 50,
    elevation: 5,
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
    borderRadius: 100,
  },

  letter: {
    color: colors.lightDark,
    fontSize: 30,
    fontFamily: 'Ultra-Regular',
  },
});

export default Game;
