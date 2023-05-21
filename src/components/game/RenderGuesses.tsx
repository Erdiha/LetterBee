import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../utils/constants';
import InsetShadow from 'react-native-inset-shadow';

import Animated, {
  SlideInLeft,
  FlipInEasyX,
  FlipInEasyY,
  ZoomInUp,
  SlideOutRight,
  ZoomInDown,
  BounceOut,
  SlideOutDown,
  FadeOut,
  SlideOutLeft,
} from 'react-native-reanimated';
import { CheckKeyColor } from '../../utils/Helper';

const renderGuesses = ({
  secretWord,
  allGuesses,
  correctpos,
  setFoundTheWord,
  setGuess,
  keyBoardColors,
  setRoundIsOver,
}) => {
  return (
    <View style={styles.guessedWordsContainer}>
      {allGuesses.map((row: string[], rowIndex: number) => {
        correctpos.current = 0; // set correctpos to zero for each row

        return (
          <Animated.View
            entering={SlideInLeft}
            exiting={
              rowIndex % 2 === 0
                ? SlideOutRight.delay(200 * rowIndex)
                : SlideOutLeft.delay(200 * rowIndex)
            }
            key={rowIndex}
            style={[styles.guessRow]}>
            {row.map((letter: string, cellIndex: number) => {
              const { key, color } = CheckKeyColor({
                letter,
                cellIndex,
                secretWord,
                correctpos,
              });

              keyBoardColors[color].push(key);

              if (correctpos.current === 5) {
                setFoundTheWord(true);
                setRoundIsOver(true);
              }
              return (
                <Animated.View
                  entering={
                    letter === '?'
                      ? ZoomInDown.delay(250 * cellIndex)
                      : FlipInEasyX.delay(250 * cellIndex)
                  }
                  key={cellIndex}
                  style={[
                    styles.guessCell,
                    { backgroundColor: letter === '?' ? colors.red : color },
                  ]}>
                  <InsetShadow
                    containerStyle={{
                      ...styles.shadow,
                      borderColor: letter === '?' ? colors.red : color,
                    }}
                    elevation={5}
                    shadowOpacity={1}
                    color={colors.lightDark}>
                    <Text style={styles.letter}>{letter}</Text>
                  </InsetShadow>
                </Animated.View>
              );
            })}
          </Animated.View>
        );
      })}
    </View>
  );
};
export default renderGuesses;

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 10,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 13,
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
    backgroundColor: '#F8F6F4',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  guessRow: {
    flex: 1 / 5,
    flexDirection: 'row',
    display: 'flex',
    width: '98%',
    alignSelf: 'center',
    elevation: 15,
    backgroundColor: colors.light,
    margin: 2,
    borderRadius: 10,
  },

  guessCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    elevation: 5,
    borderRadius: 10,
  },

  letter: {
    color: colors.lightDark,
    fontSize: 28,
    fontFamily: 'Ultra-Regular',
    elevation: 10,
  },
});
