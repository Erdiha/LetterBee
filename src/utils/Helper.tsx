import { colors, TOTAL_SCORE } from './constants';
import { words } from './data';
import { PlayerScore } from '../screens/types';
//score calculation
export const POINTS_PER_GRAY_LETTER = 2;
export const POINTS_PER_YELLOW_LETTER = 0.5;

import { ToastAndroid } from 'react-native';

export function getRandomLetter({
  secretWord,
  allGuesses,
  guess,
  hintLetters,
}) {
  console.log('scrt', secretWord);

  let randomLetter = '';
  let letterPosition = 0;

  do {
    console.log('a');
    letterPosition = Math.floor(Math.random() * secretWord.length);
    randomLetter = secretWord[letterPosition].toUpperCase(); // Convert to uppercase
    console.log('length', secretWord.length, randomLetter);
    console.log('allguess flat', allGuesses.flat());
  } while (
    allGuesses.flat().includes(randomLetter) ||
    guess.includes(randomLetter) ||
    hintLetters.filter((letter) => letter === '').length < 1
  );

  return { randomLetter, letterPosition };
}

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

export const validateGuess = async ({ row }) => {
  const w = row.join('').toLowerCase();
  let data = null;
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${w}`,
    );
    data = await response.json();
  } catch (err) {
    ToastAndroid.show('Invalid Word!', ToastAndroid.SHORT);
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

export function handleScoreDisplay(
  allGuesses: string[][],
  roundCount: React.MutableRefObject<number>,
  playerScore: React.MutableRefObject<{ 1: number; 2: number; 3: number }>,
  secretWord: any,
  score: React.MutableRefObject<number>,
  giveUpPoints: React.MutableRefObject<number>,
  hint: boolean,
  hintPoints: React.MutableRefObject<number>,
) {
  return () => {
    playerScore.current[roundCount.current] = calculateScore({
      secretWord,
      allGuesses,
    });
    let totalScore = getScoreSum(playerScore);

    score.current =
      TOTAL_SCORE - totalScore - giveUpPoints.current - hintPoints.current;

    return score.current;
  };
}

export const calculateScore = ({ secretWord, allGuesses }) => {
  console.log('secretword', secretWord);
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
