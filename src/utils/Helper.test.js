import {
  CheckKeyColor,
  calculateScore,
  POINTS_PER_GRAY_LETTER,
  POINTS_PER_YELLOW_LETTER,
} from './Helper';
import { colors } from './constants';
describe('CheckKeyColor function', () => {
  let correctpos;

  beforeEach(() => {
    correctpos = { current: 0 };
  });

  it('should return green color when the letter is at the correct position', () => {
    const letter = 'A';
    const cellIndex = 0;
    const secretWord = 'APPLE';

    const result = CheckKeyColor({ letter, cellIndex, secretWord, correctpos });

    expect(result).toEqual({ key: letter, color: colors.green });
    expect(correctpos.current).toEqual(1);
  });

  it('should return yellow color when the letter is in the word but not at the correct position', () => {
    const letter = 'P';
    const cellIndex = 0;
    const secretWord = 'APPLE';

    const result = CheckKeyColor({ letter, cellIndex, secretWord, correctpos });

    expect(result).toEqual({ key: letter, color: colors.yellow });
    expect(correctpos.current).toEqual(0);
  });

  it('should return gray color when the letter is not in the word', () => {
    const letter = 'Z';
    const cellIndex = 0;
    const secretWord = 'APPLE';

    const result = CheckKeyColor({ letter, cellIndex, secretWord, correctpos });

    expect(result).toEqual({ key: letter, color: colors.gray });
    expect(correctpos.current).toEqual(0);
  });
});

describe('calculateScore function', () => {
  it('should calculate the score correctly', () => {
    const secretWord = ['w', 'o', 'r', 's', 't'];
    const allGuesses = [['W', 'A', 'T', 'E', 'R']];
    const expectedScore = 5;

    const result = calculateScore({ secretWord, allGuesses });

    expect(result).toEqual(expectedScore);
  });
});
