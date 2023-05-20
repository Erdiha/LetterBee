import { View, Text, Animated, StyleSheet } from 'react-native';
import React from 'react';

import InsetShadow from 'react-native-inset-shadow';
import { colors } from '../../utils/constants';

const GuessContainer = ({ guess, row, roundIsOver, foundTheWord }) => {
  return (
    <View style={styles.guessRow}>
      {guess?.map((letter: string, index: number) => {
        const isCurrentRow = row === index;
        const scale = isCurrentRow && !foundTheWord ? 1 : 0.85;

        return (
          <Animated.View key={index} style={styles.guessCell}>
            <InsetShadow
              containerStyle={{
                ...styles.shadow,
                transform: [{ scale: roundIsOver ? 1 : scale }],
                borderColor: isCurrentRow ? colors.red : colors.lightDark,
                backgroundColor: foundTheWord
                  ? colors.green
                  : roundIsOver
                  ? !foundTheWord
                    ? colors.light
                    : colors.lightBlue
                  : isCurrentRow
                  ? colors.light
                  : colors.light,
              }}
              shadowColor={isCurrentRow ? 'green' : 'black'}
              elevation={6}
              shadowOpacity={1}>
              <Text style={[styles.letter, { color: colors.lightDark2 }]}>
                {letter.toUpperCase()}
              </Text>
            </InsetShadow>
          </Animated.View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  shadow: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '98%',
    height: '98%',
    borderRadius: 100,
  },

  guessRow: {
    flex: 1 / 5,
    backgroundColor: colors.lightDark,
    flexDirection: 'row',
    display: 'flex',
    width: '98%',
    alignSelf: 'center',
    justifyContent: 'space-around',
    marginTop: 5,
    borderRadius: 100,
  },

  guessCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 3,
    width: '100%',
    height: '100%',
  },

  letter: {
    color: colors.lightDark,
    fontSize: 30,
    fontFamily: 'Ultra-Regular',
  },
});

export default GuessContainer;
