import { colors } from './colors';
import { words } from './data';
import { PlayerScore } from '../screens/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import useScore from '../components/hooks/useScore';
import { TOTAL_SCORE } from './constants';

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
    info: prevPlayer?.info?.sort((a: any, b: any) => b.score - a.score),
  }));
};

export const storeData = async (data: any) => {
  try {
    if (data.type === 'gameState') {
      await AsyncStorage.setItem('gameState', JSON.stringify(data.gameState));
    }

    if (data.type === 'userData') {
      const storedData = await AsyncStorage.getItem('userData');
      let newData = [];

      if (storedData) {
        const existingData = JSON.parse(storedData);
        const userIndex = existingData.findIndex(
          (item) => item.name === data.userData.name,
        );

        if (userIndex !== -1) {
          existingData[userIndex] = {
            ...existingData[userIndex],
            ...data.userData,
          };
          newData = existingData;
        } else {
          newData = [...existingData, data.userData];
        }
      } else {
        newData = [data.userData];
      }

      await AsyncStorage.setItem('userData', JSON.stringify(newData));
    }

    if (data.type === 'score') {
      await AsyncStorage.setItem('score', JSON.stringify(data.score));
    }
  } catch (error) {
    ToastAndroid.show('Error storing data', ToastAndroid.SHORT);
  }

  console.log('async data', data);
};

// To retrieve a value
export const retrieveData = async ({ userName }: any) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    const gameState = await AsyncStorage.getItem('gameState');

    if (
      !userData ||
      typeof userData !== 'string' ||
      !gameState ||
      typeof gameState !== 'string'
    ) {
      // Handle the case when data is missing or not a string
      return null;
    }

    const parsedUserData = JSON.parse(userData);
    const user = parsedUserData.find((item: any) => item.name === userName);

    if (user) {
      console.log('retrieve data user', user);
      return {
        userData: user.data,
        gameState: JSON.parse(gameState),
      };
    }

    return null; // User not found
  } catch (error) {
    // Handle error
    ToastAndroid.show('Error retrieving data', ToastAndroid.SHORT);
    return null; // Return default value or handle the error accordingly
  }
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully.');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

export function handleScoreDisplay(
  allGuesses: string[][],
  roundCount: React.MutableRefObject<number>,
  playerScore: React.MutableRefObject<{ 1: number; 2: number; 3: number }>,
  secretWord: any,
  attempt: number,
  score: React.MutableRefObject<number>,
  foundTheWord: boolean,
  giveup: boolean,
  giveupPoints: React.MutableRefObject<number>,
) {
  return () => {
    console.log('allGuesses', allGuesses, 'roundCount', roundCount.current);
    playerScore.current[roundCount.current] = calculateScore({
      secretWord,
      attempt,
      allGuesses,
    });
    const totalScore = getScoreSum(playerScore);

    score.current = TOTAL_SCORE - totalScore - giveupPoints.current;

    return score.current;
  };
}
//score calculation
const POINTS_PER_GRAY_LETTER = 2;
const POINTS_PER_YELLOW_LETTER = 0.5;

export const calculateScore = ({ secretWord, allGuesses, attempt }) => {
  const countColors = () => {
    const colors = {
      gray: 0,
      yellow: 0,
    };
    for (let i = 0; i < secretWord.length; i++) {
      let grayCount = 0;
      let yellowCount = 0;
      for (let j = 0; j < allGuesses.length; j++) {
        const guess = allGuesses[j];
        if (guess[i] === secretWord[i].toUpperCase()) {
          continue;
        } else if (guess.includes(secretWord[i].toUpperCase())) {
          yellowCount++;
        } else {
          grayCount++;
        }
      }
      colors.yellow += yellowCount;
      colors.gray += grayCount;
    }
    return colors;
  };

  const colors = countColors();
  const attemptPoints =
    colors.gray * POINTS_PER_GRAY_LETTER +
    colors.yellow * POINTS_PER_YELLOW_LETTER;

  return attemptPoints;
};
