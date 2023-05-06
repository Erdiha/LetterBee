import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../assets/colors';

export const backspace = (
  <Ionicons name='md-backspace' size={30} color={colors.lightDark} />
);
export const enter = 'ENTER';
export const keyRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  [backspace, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', enter],
];

export const title = ['K', 'O', 'O', 'R', 'D', 'L', 'E'];
export const bgColor = [
  '#617A55',
  '#F08A5D',
  '#B83B5E',
  '#6A2C70',
  '#F38181',
  '#A4D0A4',
  '#95E1D3',
];
