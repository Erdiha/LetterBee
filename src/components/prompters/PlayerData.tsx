import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useRef } from 'react';

import { colors } from '../../utils/constants';
import Animated, {
  BounceInLeft,
  BounceOutRight,
} from 'react-native-reanimated';
import { clearAsyncStorage } from '../asyncStorage';

interface PlayerInfo {
  score: number;
  date: string;
  // Other properties
}
interface Player {
  info?: PlayerInfo[];
  // Other properties
}
const PlayerData = ({ player, setShowProfile, setPlayer }) => {
  const handleAsyncStorageClear = () => {
    Alert.alert('Confirmation', 'Are you sure you want to delete all data?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await clearAsyncStorage();
          setPlayer((prevPlayer: object) => ({
            ...prevPlayer,
            info: [],
          }));
        },
      },
    ]);
  };

  return (
    <Animated.View
      entering={BounceInLeft}
      exiting={BounceOutRight}
      style={styles.container}>
      <View style={styles.blurBackground} />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Player Data</Text>

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

        <ScrollView style={styles.scoresContainer}>
          <Text style={styles.scoresTitle}>Scores:</Text>
          {player?.info
            ?.sort((a: PlayerInfo, b: PlayerInfo) => b.score - a.score) // Sort scores in descending order
            ?.map((item: PlayerInfo, index: number) =>
              item ? (
                <Text
                  key={index}
                  style={[
                    index === 0
                      ? styles.firstScoreText
                      : index === 1
                      ? [styles.firstScoreText, { fontSize: 18 }]
                      : index === 2
                      ? [styles.firstScoreText, { fontSize: 17 }]
                      : styles.scoreText,
                  ]}>
                  {`#${index + 1} - Score: ${item.score}, ${item.date} `}
                </Text>
              ) : null,
            )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleAsyncStorageClear()}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>CLEAR DATA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowProfile((prev: boolean) => !prev)}
            style={styles.button}>
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  innerContainer: {
    alignSelf: 'center',
    flex: 1,
    borderRadius: 10,
    borderColor: colors.lightDark,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.light,
    marginVertical: 20,
    width: '95%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    gap: 10,
  },

  button: {
    backgroundColor: colors.lightDark,
    flex: 1 / 2,
    borderRadius: 10,
    elevation: 5,
  },

  buttonText: {
    color: colors.light,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    fontWeight: '800',
  },

  firstScoreText: {
    color: colors.dark,
    fontSize: 19,
    fontWeight: '800',
    borderColor: colors.red,
    borderWidth: 2,
    margin: 2,
    paddingHorizontal: 1,
  },

  clearButton: {
    backgroundColor: colors.light,
    borderWidth: 2,
    borderColor: colors.lightDark,
    flex: 1 / 2,
    borderRadius: 10,
    elevation: 5,
  },
  clearButtonText: {
    backgroundColor: colors.light,
    color: colors.red,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
    fontWeight: '800',
    borderRadius: 10,
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
    borderRadius: 10,
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
    borderRadius: 10,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    marginBottom: 5,
    color: '#000',
    fontSize: 16,
    margin: 2,
  },
});

export default PlayerData;
