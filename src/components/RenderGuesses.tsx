import React, { useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../../assets/colors';
import Animated, { SlideInLeft, FlipInEasyX } from 'react-native-reanimated';

const RenderGuesses = ({
  gameOver,
  secretWord,
  player,
  allGuesses,
  correctpos,
  setPlayer,
  setGameOver,
}) => {
  const checkWin = ({ letter, cellIndex }) => {
    const matchingIndexes = [];
    for (let i = 0; i < secretWord.length; i++) {
      if (secretWord[i].toLowerCase() === letter.toLowerCase()) {
        matchingIndexes.push(i);
      }
    }
    if (matchingIndexes.includes(cellIndex)) {
      correctpos.current += 1;
      return colors.green;
    } else if (matchingIndexes.length > 0) {
      return colors.yellow;
    } else {
      return colors.gray;
    }
  };
  const handleScore = () => {
    if (correctpos.current === 5) {
      setPlayer({
        ...player,
        score: player.score + 1,
      });
      setGameOver(true);
    }
  };
  return (
    <View style={styles.guessedWordsContainer}>
      {gameOver ? (
        <View>
          <Text>
            {player.score} {secretWord}
          </Text>
        </View>
      ) : (
        allGuesses.map((row, rowIndex) => {
          correctpos.current = 0; // set correctpos to zero for each row
          return (
            <Animated.View
              entering={SlideInLeft}
              key={rowIndex}
              style={[styles.guessRow, { backgroundColor: colors.light }]}>
              {row.map((letter, cellIndex) => {
                const color = checkWin({ letter, cellIndex });

                const cellStyle = {
                  ...styles.guessCell,
                  backgroundColor: color,
                };

                if (correctpos.current === 5) {
                  handleScore();
                }
                console.log('correct pos', correctpos.current);
                return (
                  <Animated.View
                    entering={FlipInEasyX.delay(300 * cellIndex)}
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
export default RenderGuesses;

const styles = StyleSheet.create({
  secretWordLetter: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.light,
  },
  secretWordBox: {
    width: 30,
    height: 30,
    backgroundColor: colors.lightDark,
    marginHorizontal: 3,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.light,
  },
  gameWrapper: {
    alignSelf: 'stretch',
    backgroundColor: colors.light,
    flex: 1,
    gap: 5,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Roboto',
    color: colors.lightDark,
    textAlign: 'center',
    padding: 10,
    backgroundColor: colors.yellow,
    margin: 10,
  },
  controlContainer: {
    flex: 1 / 5,

    justifyContent: 'center',
    alignItems: 'center',
  },
  guessedWordsContainer: {
    flex: 1,
    backgroundColor: colors.light,
    margin: 10,
  },
  keyboardContainer: {
    flex: 3 / 4,

    alignSelf: 'stretch',
    width: '100%',
  },
  guessRow: {
    flex: 1 / 5,
    backgroundColor: colors.lightDark,
    flexDirection: 'row',
    display: 'flex',
  },

  guessCell: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: colors.light,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    color: colors.light,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});
