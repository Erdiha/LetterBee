import React from 'react';
import { colors } from '../../assets/colors';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { SlideInLeft, SlideOutRight } from 'react-native-reanimated';

export default function RenderGuesses({ row, secretWord }) {
  console.log('row and secretWord is', row, secretWord, colors);
  const boxes = [];
  let greenCount = 0;
  for (let i = 0; i < 5; i++) {
    let color = '';
    if (row.length > i) {
      const letter = row[i];
      if (letter === secretWord[i]) {
        color = colors.green;
        greenCount++;
      } else if (secretWord.includes(letter)) {
        color = colors.yellow;
      } else {
        color = colors.gray;
      }
    }

    boxes.push(
      <Animated.View
        entering={SlideInLeft}
        exiting={SlideOutRight}
        key={i}
        style={[styles.secretWordBox, { backgroundColor: color }]}>
        <Text style={styles.secretWordLetter}>{row[i].toUpperCase()}</Text>
      </Animated.View>,
    );
  }
  return <View style={styles.guessRow}>{boxes}</View>;
}

const styles = StyleSheet.create({
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
  secretWordLetter: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.light,
  },
  guessRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
});
