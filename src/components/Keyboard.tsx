import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';
import { colors } from '../../assets/colors';
import { keyRows, backspace, enter } from './constants';
import Animated, { BounceIn } from 'react-native-reanimated';

const Keyboard = ({ onPress, foundTheWord, keyboardColors, gameOver }: any) => {
  const enterJSX = <Text style={styles.enter}>ENTER</Text>;

  const restJSX = (letter: string | any) => (
    <Text style={styles.text}>{letter}</Text>
  );

  const keyColors = (key: any) => {
    if (keyboardColors['#7AA874']?.includes(key)) {
      return colors.green;
    }
    if (keyboardColors['#F7DB6A']?.includes(key)) {
      return colors.yellow;
    }
    if (keyboardColors['#B7B7B7']?.includes(key)) {
      return colors.gray;
    }
    return colors.light;
  };

  const handlePress = (letter: any) => {
    Vibration.vibrate(40);
    if (letter === backspace) {
      onPress('backspace');
    } else {
      onPress(letter);
    }
  };

  return (
    <View style={styles.container}>
      {keyRows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((letter, letterIndex) => (
            <Animated.View
              entering={BounceIn.delay(letterIndex * 200)}
              key={letterIndex}>
              <TouchableOpacity
                activeOpacity={0.3}
                disabled={foundTheWord || gameOver}
                style={[
                  styles.button,
                  letter === backspace && styles.backspace,
                  letter === enter && styles.enterButton,
                  { backgroundColor: keyColors(letter) },
                ]}
                key={letterIndex}
                onPress={() => handlePress(letter)}>
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
    margin: 2,
    width: 33,
    height: 60,
    borderRadius: 3,
    borderColor: colors.lightDark,
    borderWidth: 0.2,
    elevation: 5,
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
