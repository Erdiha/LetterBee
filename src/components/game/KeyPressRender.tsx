import { ToastAndroid } from 'react-native';
import { checkWord } from '../../utils/Helper';

export default function KeyPressRender(
  guess: string[],
  setAttempt: React.Dispatch<React.SetStateAction<number>>,
  attempt: number,
  secretWord: any,
  setAllGuesses: React.Dispatch<React.SetStateAction<string[][]>>,
  allGuesses: string[][],
  setGuess: React.Dispatch<React.SetStateAction<string[]>>,
  setRow: React.Dispatch<React.SetStateAction<number>>,
  row: number,
  col: number,
  hint: any,
  hintLetters: string[],
  setHintLetters: any,
) {
  return (letter: string) => {
    if (letter === 'ENTER') {
      console.log('only guess', guess);
      if (guess.includes('')) {
        return;
      }

      checkWord({ row: guess }).then((result) => {
        if (result || guess.join('') === secretWord.join('').toUpperCase()) {
          setAllGuesses([...allGuesses, guess]);
        } else {
          ToastAndroid.show('INVALID WORD!!!', ToastAndroid.SHORT);
          setAllGuesses([...allGuesses, ['?', '?', '?', '?', '?']]);
        }
      });
      console.log('hint letters in keypress', hintLetters);
      setGuess(['', '', '', '', '']);
      setGuess([...hintLetters]);
      console.log('all guess', allGuesses);
      setRow(0);
      setAttempt(attempt + 1);
    } else if (letter === 'backspace') {
      if (row === 0) {
        return;
      }
      if (row > 0) {
        guess[row - 1] = '';
        setGuess(guess);
        setRow(row - 1);
      } else {
        // If we're at the beginning of the row, delete the last letter
        const lastRow = allGuesses[col].slice(0, -1);
        setAllGuesses([...allGuesses.slice(0, -1), lastRow]);
        setRow(4);
      }
    } else {
      if (row === 5) {
        return;
      } else {
        if (guess[row] === '') {
          guess[row] = letter;
          setGuess([...guess]);
        }
        setRow(row + 1);
      }
    }
  };
}
