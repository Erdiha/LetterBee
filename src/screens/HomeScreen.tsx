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
import { colors } from '../utils/colors';
import Animation, {
  BounceInLeft,
  BounceInRight,
  SlideInUp,
} from 'react-native-reanimated';
import { RootStackParamList } from './types';
import { title, bgColor, enter } from '../utils/constants';
import Animated from 'react-native-reanimated';
import { useFonts } from 'expo-font';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  let [fontsLoaded] = useFonts({
    'PermanentMarker-Regular': require('../../assets/fonts/PermanentMarker-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  function renderTitle() {
    const red = title.map((letter: string, index: number) => {
      return (
        <Animation.View
          entering={
            index % 2 === 0
              ? BounceInRight.delay(index * 300).duration(3000)
              : BounceInLeft.delay(index * 300).duration(3000)
          }
          style={{
            position: 'absolute',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: bgColor[index],
            margin: 2,
            borderRadius: index === title.length - 1 ? 50 : 0,
            width: 100,
            elevation: 5,
            paddingBottom: index === title.length - 1 ? 20 : 0,
            top: 90,
            zIndex: title.length - index,
            bottom:
              index === title.length - 1
                ? (title.length - index) * 30
                : (title.length - index) * 60,
          }}
          key={index}>
          <Text
            style={{
              color: colors.light,
              fontSize: 45,
              fontWeight: 'bold',
              fontFamily: 'PermanentMarker-Regular',
            }}>
            {letter}
          </Text>
        </Animation.View>
      );
    });

    return red;
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.lightDark} />
      <View style={styles.container}>{renderTitle()}</View>
      <Animated.View
        entering={SlideInUp.delay(1000).duration(1500)}
        exiting={BounceInLeft}
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
    marginTop: 50,
    width: '80%',
    height: '70%',
    borderRadius: 20,
  },
});
