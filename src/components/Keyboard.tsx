import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../../assets/colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FlipInEasyX } from 'react-native-reanimated';
import { keyRows, backspace, enter } from './constants';

const Keyboard = ({ onPress, green, yellow, gray }: any) => {
  const enterJSX = <Text style={styles.enter}>ENTER</Text>;
  const restJSX = (letter: string | any) => (
    <Text style={styles.text}>{letter}</Text>
  );

  const keyColors = (key: any) => {
    if (green?.includes(key)) {
      return colors.green;
    }
    if (yellow?.includes(key)) {
      return colors.yellow;
    }
    if (gray?.includes(key)) {
      return colors.lightDark;
    }
    return colors.light;
  };

  return (
    <View style={styles.container}>
      {keyRows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((letter, letterIndex) => (
            <Animated.View key={letterIndex}>
              <TouchableOpacity
                style={[
                  styles.button,
                  letter === backspace && styles.backspace,
                  letter === enter && styles.enterButton,
                  { backgroundColor: keyColors(letter) },
                ]}
                key={letterIndex}
                onPress={() => onPress(letter)}>
                {letter === 'ENTER' ? enterJSX : restJSX(letter)}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    width: 33,
    height: 60,
    borderRadius: 4,
    borderColor: colors.lightDark,
    borderWidth: 1,
  },
  text: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.lightDark,
  },
  backspace: {
    width: 45,
    paddingHorizontal: 8,
  },
  enterButton: {
    backgroundColor: colors.lightDark,
    width: 78,
    height: 60,
  },
  enter: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.lightDark,
  },
});

export default Keyboard;
