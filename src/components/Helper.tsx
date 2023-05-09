import { colors } from '../../assets/colors';
import { words } from './data';
import { PlayerScore } from '../screens/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

export const CheckKeyColor = ({
  letter,
  cellIndex,
  secretWord,
  correctpos,
}) => {
  const matchingIndexes = [];
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i].toLowerCase() === letter.toLowerCase()) {
      matchingIndexes.push(i);
    }
  }
  if (matchingIndexes.includes(cellIndex)) {
    correctpos.current += 1;
    return { key: letter, color: colors.green };
  } else if (matchingIndexes.length > 0) {
    return { key: letter, color: colors.yellow };
  } else {
    return { key: letter, color: colors.gray };
  }
};

const validateGuess = async ({ row }) => {
  const w = row.join('').toLowerCase();
  let data = null;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${w}`,
    );
    data = await response.json();
    console.log(data);
  } catch (err) {
    console.warn(err);
  }
  return data;
};

export const checkWord = async ({ row }) => {
  const data = await validateGuess({ row });

  if (data?.title === 'No Definitions Found') {
    return false;
  } else {
    return true;
  }
};

export const getDate = (): string => {
  const now: Date = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const date: string = now.toLocaleDateString(undefined, dateOptions);
  const time: string = now.toLocaleTimeString(undefined, timeOptions);
  return `${date} ${time}`;
};

export const keyBoardColors = {
  [colors.yellow]: [],
  [colors.green]: [],
  [colors.gray]: [],
};

export const getSecretWord = () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex] ? words[randomIndex].split('') : [];
};

export const getScoreSum = (playerScore: { current: PlayerScore }) => {
  return Object.values(playerScore.current).reduce(
    (acc, score) => acc + score,
    0,
  );
};

export const sortInfoByScore = ({ setPlayer }): void => {
  setPlayer((prevPlayer: any) => ({
    ...prevPlayer,
    info: prevPlayer.info.sort((a, b) => b.score - a.score),
  }));
};

// To store a value
export const storeData = async (data: any) => {
  try {
    if (data.type === 'game') {
      const dataString = JSON.stringify(data.gameState);

      await AsyncStorage.setItem('gameStat', dataString);
    } else if (data.type === 'user') {
      const dataString = JSON.stringify(data.userData);
      await AsyncStorage.setItem('userData', dataString);
    }
  } catch (error) {
    ToastAndroid.show('Error storing data', ToastAndroid.SHORT);
  }
  console.log('async data', data);
};

// To retrieve a value
export const retrieveData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    const gameState = await AsyncStorage.getItem('gameState');
    const parsedUserData = JSON.parse(userData);
    const parsedGameState = JSON.parse(gameState);
    console.log(parsedUserData, parsedGameState);
    return { userData: parsedUserData, gameState: parsedGameState };
  } catch (error) {
    // Handle error
    ToastAndroid.show('Error retrieving data', ToastAndroid.SHORT);
  }
};
