import { useState, useEffect } from 'react';

const POINTS_PER_GRAY_LETTER = 2;
const POINTS_PER_YELLOW_LETTER = 0.5;

const useScore = ({ secretWord, allGuesses, attempt }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
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

    const calculateScore = () => {
      const colors = countColors();
      const attemptPoints =
        colors.gray * POINTS_PER_GRAY_LETTER +
        colors.yellow * POINTS_PER_YELLOW_LETTER;
      setScore(attemptPoints);
    };

    attempt >= 1 && calculateScore();
  }, [allGuesses, secretWord]);

  return score;
};

export default useScore;
