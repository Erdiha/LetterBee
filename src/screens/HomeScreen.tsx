import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../assets/colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  BounceInUp,
  PinwheelIn,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  color,
} from 'react-native-reanimated';
import { RootStackParamList } from './types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  const [animationTriggered, setAnimationTriggered] = useState(false);

  useEffect(() => {
    setAnimationTriggered(true);
  }, []);

  const renderTitle = () => {
    const title = ['K', 'O', 'O', 'R', 'D', 'L', 'E'];
    const bgColor = [
      'red',
      'blue',
      'green',
      'magenta',
      'orange',
      'purple',
      'teal',
    ];
    const red = title.map((letter, index) => {
      return (
        <Animated.View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: bgColor[index],
            margin: 2,
            borderRadius: 5,
            padding: 3,
            width: 100,
          }}
          key={index}
          exiting={
            index % 2 === 1
              ? SlideInLeft.delay(200 * index)
              : SlideInRight.delay(200 * index)
          }
          entering={
            index % 2 === 0
              ? SlideInLeft.delay(200 * index)
              : SlideInRight.delay(200 * index)
          }>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: '900' }}>
            {letter}
          </Text>
        </Animated.View>
      );
    });

    return red;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.lightDark} />
      <View style={styles.container}>{renderTitle()}</View>
      <Animated.View
        entering={SlideInDown.delay(1500).duration(1000)}
        style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Game');
          }}
          style={{
            backgroundColor: colors.lightDark,
            width: 150,
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 30,
              textAlign: 'center',
            }}>
            PLAY
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.light,

    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    width: '80%',
    height: '70%',
    borderRadius: 20,
  },
});
