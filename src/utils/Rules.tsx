import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../utils/colors';
import Animated, {
  BounceInDown,
  BounceInLeft,
  BounceInRight,
  BounceInUp,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
import { title, bgColor, rules } from './constants';
import BounceIn from 'react-native-reanimated';
const Rules = ({ setStart }) => {
  const handleLetterBee = () => {
    return title.map((char, index) => (
      <Animated.View
        key={index}
        entering={
          index === title.length - 1
            ? BounceInUp.delay(300).duration(4000)
            : BounceInDown.delay(index * 300).duration(1000)
        }>
        <Text
          key={index}
          style={[
            styles.letterBeeText,
            {
              color: bgColor[index],
              marginRight: index === title.length - 1 ? 0 : 5,
            },
          ]}>
          {char}
        </Text>
      </Animated.View>
    ));
  };

  return (
    <Animated.View
      entering={SlideInUp}
      exiting={SlideOutDown}
      style={styles.rulesContainer}>
      <Text style={{ fontSize: 25, fontWeight: '800', marginTop: 10 }}>
        WELCOME TO
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
        {handleLetterBee()}
      </View>

      <View style={styles.rulesTextWrapper}>
        {rules.map((char, index) => (
          <Animated.View
            key={index}
            entering={BounceInDown.delay(index * 500).duration(3000)}>
            <Text
              style={[
                styles.rulesText,
                index === rules.length - 1
                  ? {
                      color: colors.yellow,
                      fontSize: 25,
                      marginTop: 15,
                      textTransform: 'uppercase',
                    }
                  : null,
              ]}>
              {char}
            </Text>
          </Animated.View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => setStart(0)}>
        <Text style={styles.buttonText}>CLOSE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Rules;

const styles = StyleSheet.create({
  rulesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderRadius: 10,
    width: '80%',
    height: '80%',
  },
  letterBeeText: {
    fontSize: 25,
    fontWeight: 'bold',
    backgroundColor: colors.light,
    fontStyle: 'italic',
    padding: 8,
    display: 'flex',
    borderRadius: 5,
    elevation: 5,
    borderColor: colors.lightDark,
    borderWidth: 1,
  },
  rulesText: {
    fontSize: 18,
    lineHeight: 24,
    marginVertical: 1,
    color: colors.light,
    fontWeight: '700',
    textAlign: 'center',
  },
  rulesTextWrapper: {
    padding: 20,
    backgroundColor: colors.lightDark,
    borderRadius: 10,
    elevation: 5,
  },
  buttonWrapper: {
    backgroundColor: colors.lightDark,
    borderRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  buttonText: {
    color: colors.light,
    padding: 10,
    fontWeight: '700',
    fontSize: 30,
    width: 150,
    textAlign: 'center',
  },
});
