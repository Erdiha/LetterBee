import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';

import { colors } from '../../assets/colors';
import Animated, {
  BounceInLeft,
  BounceOutRight,
} from 'react-native-reanimated';
import { getDate, sortInfoByScore } from './Helper';
const PlayerData = ({ player, setShowProfile }) => {
  console.log('player', player);
  // if (player?.name === '' || !player?.name) {
  //   player.name = 'Player';
  // }

  return (
    <Animated.View
      entering={BounceInLeft}
      exiting={BounceOutRight}
      style={styles.container}>
      <Text style={styles.title}>Player Data</Text>
      <View>
        <Text style={styles.playerInfoName}>
          Name:{''}
          <Text
            style={{
              backgroundColor: colors.light,
              margin: 2,
              display: 'flex',
              color: colors.lightDark,
              padding: 2,
            }}>
            {' '}
            {player?.name}
          </Text>
        </Text>
      </View>
      <ScrollView style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>Scores:</Text>
        {player?.info?.map((item: any, index: number) => (
          <Text
            key={index}
            style={[
              styles.scoreText,
              index === 0 ? styles.firstScoreText : {},
            ]}>
            {`#${index + 1} - Score: ${item.score}, Date:${item.date} `}
          </Text>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowProfile((prev: boolean) => !prev)}
        style={styles.closeButton}>
        <Text style={styles.buttonText}>DONE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  firstScoreText: {
    fontSize: 24,
  },
  buttonText: {
    backgroundColor: colors.lightDark,
    color: colors.light,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
    borderRadius: 10,
    width: '50%',
  },
  closeButton: {
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1 / 8,
  },
  container: {
    position: 'absolute',
    height: '80%',
    left: 0,
    right: 0,
    top: 20,
    backgroundColor: colors.light,
    borderRadius: 10,
    borderColor: colors.lightDark,
    borderWidth: 2,
    margin: 30,
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
    width: '100%',
    borderBottomColor: colors.lightDark,
    borderBottomWidth: 2,
    backgroundColor: colors.lightDark,
    color: colors.light,
    flex: 1 / 15,
  },

  playerInfoName: {
    fontSize: 20,
    marginBottom: 5,
    padding: 10,
    justifyContent: 'space-evenly',
    color: '#B7B7B7',
    width: '100%',
    display: 'flex',
  },
  scoresContainer: {
    borderWidth: 1,

    padding: 10,
    flex: 5 / 6,
    width: '100%',
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    marginBottom: 5,
    color: '#000',
  },
});

export default PlayerData;
