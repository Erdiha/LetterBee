import { Ionicons } from '@expo/vector-icons';
export const colors = {
  dark: '#222831',
  lightDark: '#393E46',
  lightDark2: '#2B3A55',
  teal: '#00ADB5',
  light: '#EEEEEE',
  yellow: '#F7DB6A',
  green: '#BEF0CB',
  gray: '#BDCDD6',
  red: '#FA9494',
};
export const backspace = (
  <Ionicons name='md-backspace' size={30} color={colors.red} />
);
export const enter = 'ENTER';
export const keyRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  [backspace, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', enter],
];

export const title = ['L', 'E', 'T', 'T', 'E', 'R', '🐝'];
export const bgColor = [
  '#98D8AA',
  '#E57C23',
  '#B83B5E',
  '#6A2C70',
  '#F38181',
  '#2B3A55',
  '#537188',

  colors.teal,
  colors.light,
];

const text =
  'This word guessing game has five attempts for each round. Each game has 4 rounds. Each round is worth 50pts, and you start off with 50pts. For each wrong letter, 1pt is deducted, for each right letter but wrong position, 0.5pts are deducted from the 50pts. For each correct letter with the correct position, no points will be taken. If you guess the word on your first attempt, you get the full 50pts. Good Luck';

export const rules = text.split(/\.\s/).map((line) => line.trim() + '.');

export const TOTAL_SCORE = 150;
export const MAX_ROUND = 3;
export const MAX_ATTEMPTS = 5;
