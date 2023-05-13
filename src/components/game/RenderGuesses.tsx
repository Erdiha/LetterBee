import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../utils/colors';

import Animated, {
  SlideInLeft,
  FlipInEasyX,
  FlipInEasyY,
  ZoomInUp,
  SlideOutRight,
  ZoomInDown,
  BounceOut,
} from 'react-native-reanimated';
import ModalComponent from '../prompters/ModalComponent';

import { CheckKeyColor } from '../../utils/Helper';

const renderGuesses = ({
  playerScore,
  secretWord,
  foundTheWord,
  roundIsOver,
  roundCount,
  resetRound,
  allGuesses,
  correctpos,
  setAllGuesses,
  setFoundTheWord,
  setGuess,
  handleScore,
  keyBoardColors,
  score,
}) => {
  return (
    <View style={styles.guessedWordsContainer}>
      {foundTheWord && roundIsOver ? (
        <ModalComponent
          secretWord={secretWord}
          roundIsOver={roundIsOver}
          playerScore={playerScore}
          roundCount={roundCount}
          resetRound={resetRound}
          setAllGuesses={setAllGuesses}
          score={score}
        />
      ) : (
        allGuesses.map((row: string[], rowIndex: number) => {
          correctpos.current = 0; // set correctpos to zero for each row

          return (
            <Animated.View
              entering={SlideInLeft}
              exiting={SlideOutRight}
              key={rowIndex}
              style={[styles.guessRow, { backgroundColor: colors.light }]}>
              {row.map((letter: string, cellIndex: number) => {
                const { key, color } = CheckKeyColor({
                  letter,
                  cellIndex,
                  secretWord,
                  correctpos,
                });

                keyBoardColors[color].push(key);

                const cellStyle = {
                  ...styles.guessCell,
                  backgroundColor: letter === '?' ? 'red' : color,
                  bordercolor: colors.lightDark,
                  borderwidth: 2,
                };
                if (correctpos.current === 5) {
                  setGuess(allGuesses[allGuesses.length - 1]);
                  setFoundTheWord(true);
                  handleScore();
                }
                return (
                  <Animated.View
                    entering={
                      letter === '?'
                        ? ZoomInDown.delay(250 * cellIndex)
                        : FlipInEasyX.delay(250 * cellIndex)
                    }
                    exiting={BounceOut.delay(300 * cellIndex)}
                    key={cellIndex}
                    style={cellStyle}>
                    <Text style={styles.letter}>{letter}</Text>
                  </Animated.View>
                );
              })}
            </Animated.View>
          );
        })
      )}
    </View>
  );
};
export default renderGuesses;

const styles = StyleSheet.create({
  gameWrapper: {
    alignSelf: 'stretch',
    flex: 1,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Roboto',
    color: colors.lightDark,
    textAlign: 'center',
    padding: 10,
    backgroundColor: colors.light,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.lightDark,
    fontWeight: 'bold',
  },

  guessedWordsContainer: {
    flex: 1,

    margin: 10,
    padding: 1,

    borderRadius: 8,
  },
  keyboardContainer: {
    flex: 3 / 4,
    alignSelf: 'stretch',
    width: '100%',
  },
  guessRow: {
    flex: 1 / 5,
    backgroundColor: colors.light,
    flexDirection: 'row',
    display: 'flex',
    width: '98%',
    alignSelf: 'center',
  },

  guessCell: {
    alignSelf: 'stretch',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 6,
    transition: 'transform 0.2s ease-out',
    cursor: 'pointer',
  },

  letter: {
    color: colors.lightDark,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});
