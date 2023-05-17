import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../utils/constants';
import Animated, {
  BounceInDown,
  BounceInUp,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
import { title, bgColor, rules } from './constants';
const Rules = ({ setStart }) => {
  const handleLetterBee = () => {
    return title.map((char, index) => (
      <Animated.View
        key={index}
        entering={
          index === title.length - 1
            ? BounceInUp.delay(3000).duration(4000)
            : BounceInDown.delay(index * 300).duration(1000)
        }>
        <Text
          key={index}
          style={[
            styles.letterBeeText,
            {
              color: bgColor[index],
              marginRight: index === title.length - 1 ? 0 : 2,
              fontFamily: 'Ultra-Regular',
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
      <Text style={{ fontSize: 25, fontWeight: '800', marginBottom: 20 }}>
        WELCOME TO
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
        {handleLetterBee()}
      </View>

      <View style={styles.rulesTextWrapper}>
        {rules.map((char, index) => (
          <Animated.View
            key={index}
            entering={BounceInDown.delay(
              index === rules.length - 1 ? 8000 : index * 500,
            ).duration(3000)}>
            <Text
              style={[
                styles.rulesText,
                index === rules.length - 1
                  ? {
                      color: colors.yellow,
                      fontSize: 20,
                      marginTop: 10,
                      textTransform: 'uppercase',
                      fontFamily: 'Ultra-Regular',
                      textAlign: 'center',
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
    fontFamily: 'Ultra-Regular',
  },
  rulesText: {
    fontSize: 18,
    lineHeight: 24,
    marginVertical: 3,
    color: colors.light,
    textAlign: 'center',
    marginTop: 10,
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
    letterSpacing: 2,
    fontSize: 25,
    width: 150,
    textAlign: 'center',
    fontFamily: 'Ultra-Regular',
  },
});
