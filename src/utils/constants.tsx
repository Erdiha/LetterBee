import { Ionicons } from '@expo/vector-icons';
import { colors } from './colors';

export const backspace = (
  <Ionicons name='md-backspace' size={30} color={colors.lightDark} />
);
export const enter = 'ENTER';
export const keyRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  [backspace, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', enter],
];

export const title = ['L', 'E', 'T', 'T', 'E', 'R', '🐝'];
export const bgColor = [
  '#617A55',
  '#F08A5D',
  '#B83B5E',
  '#6A2C70',
  '#F38181',
  '#537188',
  colors.light,
];

const text =
  'This word guessing game has five attempts for each round. Each game has 4 rounds. Each round is worth 50pts, and you start off with 50pts. For each wrong letter, 1pt is deducted, for each right letter but wrong position, 0.5pts are deducted from the 50pts. For each correct letter with the correct position, no points will be taken. If you guess the word on your first attempt, you get the full 50pts. Good Luck';

export const rules = text.split(/\.\s/).map((line) => line.trim() + '.');

export const TOTAL_SCORE = 150;
export const MAX_ROUND = 3;
export const MAX_ATTEMPTS = 5;
