import { colors } from '../../assets/colors';

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

export const getDate = (): number => {
  const now: Date = new Date();
  const start: Date = new Date(now.getFullYear(), 0, 0);
  const diff: number = now.getTime() - start.getTime();
  const oneDay: number = 1000 * 60 * 60 * 24;
  const day: number = Math.floor(diff / oneDay);
  return day;
};

export const handleScore = (score: number, roundCount: number): number => {
  return score;
};
