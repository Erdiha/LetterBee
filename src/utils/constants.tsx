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
  lightBlue: '#C4DFDF',
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
  '#C4DFDF',
  '#537188',

  colors.teal,
  colors.light,
];
const text =
  'In this word guessing game, you have five attempts per round. The game consists of a total of three rounds. At the start of each round, you begin with 50 points. During each round, you can earn up to 50 points. However, points will be deducted based on your guesses. Incorrectly guessing a letter will result in a deduction of 1 point from your total score. If you guess a letter correctly but it is in the wrong position, 0.5 points will be deducted from the initial 50 points. However, if you correctly guess a letter and its position, no points will be deducted. If you manage to guess the word correctly on your first attempt, you will earn the full 50 points for that round. Good Luck!';

export const rules = text.split(/\.\s/).map((line) => line.trim() + '.');

export const TOTAL_SCORE = 150;
export const MAX_ROUND = 3;
export const MAX_ATTEMPTS = 5;
export const ROUND_SCORE = 50;

export const keyBoardColors = {
  [colors.yellow]: [],
  [colors.green]: [],
  [colors.gray]: [],
};
