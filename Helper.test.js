import { colors } from './assets/colors';
import { CheckKeyColor, checkWord, renderTitle } from './src/components/Helper';

describe('CheckKeyColor', () => {
  test('should return correct object with green color if letter matches at correct position', () => {
    const result = CheckKeyColor({
      letter: 'a',
      cellIndex: 0,
      secretWord: 'apple',
      correctpos: { current: 0 },
    });
    expect(result).toEqual({ key: 'a', color: colors.green });
  });

  test('should return correct object with yellow color if letter matches but not at correct position', () => {
    const result = CheckKeyColor({
      letter: 'p',
      cellIndex: 0,
      secretWord: 'apple',
      correctpos: { current: 0 },
    });
    expect(result).toEqual({ key: 'p', color: colors.yellow });
  });

  test('should return correct object with gray color if letter does not match', () => {
    const result = CheckKeyColor({
      letter: 'z',
      cellIndex: 0,
      secretWord: 'apple',
      correctpos: { current: 0 },
    });
    expect(result).toEqual({ key: 'z', color: colors.gray });
  });
});

describe('checkWord', () => {
  test('should return true if word is found in dictionary', async () => {
    const result = await checkWord({ row: ['c', 'a', 't'] });
    expect(result).toEqual(true);
  });

  test('should return false if word is not found in dictionary', async () => {
    const result = await checkWord({ row: ['a', 'b', 'c'] });
    expect(result).toEqual(false);
  });
});
