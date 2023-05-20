import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Vibration,
} from 'react-native';
import { colors } from '../../utils/constants';
import { keyRows, backspace, enter } from '../../utils/constants';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';
import InsetShadow from 'react-native-inset-shadow';

const Keyboard = ({
  onPress,
  foundTheWord,
  keyboardColors,
  gameOver,
  roundIsOver,
}: any) => {
  const [activeLetter, setActiveLetter] = useState('');

  const enterJSX = <Text style={styles.enter}>ENTER</Text>;

  const restJSX = (letter: string | any) => (
    <Text style={styles.text}>{letter}</Text>
  );

  const keyColors = (key: any) => {
    if (keyboardColors[colors.green]?.includes(key)) {
      return colors.green;
    }
    if (keyboardColors[colors.yellow]?.includes(key)) {
      return colors.yellow;
    }
    if (keyboardColors[colors.gray]?.includes(key)) {
      return colors.gray;
    }
    return colors.light;
  };

  const handlePress = (letter: any) => {
    Vibration.vibrate(10);
    if (letter === backspace) {
      onPress('backspace');
    } else {
      onPress(letter);
    }
  };

  const handleLetterPressIn = (letter: any) => {
    if (letter !== 'ENTER' && letter !== backspace) {
      setActiveLetter(letter);
    } else {
      setActiveLetter('');
    }
  };

  const handleLetterPressOut = () => {
    setActiveLetter('');
  };

  return (
    <InsetShadow
      shadowOffset={30}
      shadowRadius={30}
      elevation={6}
      shadowOpacity={1}
      containerStyle={{
        ...styles.container,
      }}>
      {keyRows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((letter, letterIndex) => (
            <Animated.View
              key={letterIndex}
              entering={BounceIn.delay(letterIndex * 200)}>
              <TouchableOpacity
                delayPressIn={0}
                activeOpacity={0.1}
                disabled={foundTheWord || gameOver || roundIsOver}
                style={[
                  styles.button,
                  letter === backspace && styles.backspace,
                  letter === enter && styles.enterButton,
                  { backgroundColor: keyColors(letter) },
                ]}
                onPress={() => handlePress(letter)}
                onPressIn={() => handleLetterPressIn(letter)}
                onPressOut={handleLetterPressOut}>
                {letter === 'ENTER' ? enterJSX : restJSX(letter)}
              </TouchableOpacity>
              {activeLetter === letter && (
                <Animated.View entering={BounceOut} style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{letter}</Text>
                </Animated.View>
              )}
            </Animated.View>
          ))}
        </View>
      ))}
    </InsetShadow>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F6F4',
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    width: 36,
    height: 60,
    elevation: 7,
    borderRadius: 6,
  },
  text: {
    fontSize: 30,
    fontWeight: '500',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.lightDark2,
  },
  backspace: {
    width: 45,
  },
  enterButton: {
    backgroundColor: colors.lightDark,
    width: 78,
    height: 60,

    elevation: 6,
  },
  enter: {
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: colors.red,
    letterSpacing: 1,
    fontWeight: '900',
    fontFamily: 'sans-serif-condensed',
  },
  tooltip: {
    position: 'absolute',
    top: -20,
    left: 5,
    backgroundColor: colors.lightDark,
    padding: 5,
    borderRadius: 5,
    elevation: 10,
    width: 35,
    transition: 'all 2.5s ease',
  },

  tooltipText: {
    fontSize: 16,
    color: colors.light,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Keyboard;
