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
