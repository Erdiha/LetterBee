import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  BounceInDown,
  BounceInLeft,
  BounceOutRight,
  RollInLeft,
} from 'react-native-reanimated';

import { bgColor, colors } from '../../utils/constants';
import { clearAsyncStorage } from '../asyncStorage';
import { LeaderBoardProps, Iinfo } from '../../screens/types';

const LeaderBoard = ({
  player,
  setShowProfile,
  setPlayer,
}: LeaderBoardProps) => {
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

  const handleEntering = (index: number) => {
    if (index < 3) {
      return RollInLeft.delay(index * 500).duration(
        (700 - index * 200) * index,
      );
    }
    return BounceInDown.delay(index * 100 + 1300);
  };

  const renderRankIcon = (index: number) => {
    if (index === 0)
      return <FontAwesome name='trophy' size={40} color='gold' />;
    if (index === 1)
      return <FontAwesome name='trophy' size={35} color='silver' />;
    if (index === 2)
      return <FontAwesome name='trophy' size={30} color='#CD7F32' />;
    if (index === -1)
      return <FontAwesome name='trophy' size={37} color='gold' />;
    return <FontAwesome name='smile-o' size={25} color={colors.lightBlue} />;
  };

  return (
    <Animated.View
      entering={BounceInLeft}
      exiting={BounceOutRight}
      style={styles.container}>
      <View style={styles.blurBackground} />
      <View style={styles.innerContainer}>
        <Text style={styles.title}>LEADER {renderRankIcon(-1)} BOARD</Text>

        <ScrollView style={styles.scoresContainer}>
          {player?.info
            ?.sort((a: Iinfo, b: Iinfo) => b.score - a.score)
            ?.map((item: Iinfo, index: number) => (
              <Animated.View
                entering={handleEntering(index)}
                key={index}
                style={[
                  styles.scoreItem,
                  index < 3 && styles.topScoreItem,
                  index === 0
                    ? {
                        backgroundColor: '#C4DFDF',
                        borderColor: 'gold',
                        borderWidth: 7,
                        borderRadius: 10,
                        elevation: 5,
                      }
                    : index === 1
                    ? {
                        backgroundColor: '#D2E9E9',
                        borderColor: 'silver',
                        borderWidth: 4,
                      }
                    : index === 2
                    ? {
                        backgroundColor: '#E3F4F4',
                        borderColor: '#CD7F32',
                        borderWidth: 2,
                      }
                    : styles.scoreItem,
                ]}>
                <View style={styles.scoreRankContainer}>
                  <Text style={styles.scoreRankText}>{index + 1}</Text>
                </View>
                <View style={styles.scoreInfoContainer}>
                  <Text style={styles.scoreText}>
                    <Text
                      style={[
                        styles.scoreLabel,
                        index === 0
                          ? { fontSize: 24 }
                          : index === 1
                          ? { fontSize: 20 }
                          : index === 2
                          ? { fontSize: 16 }
                          : {},
                      ]}>
                      {item?.playerName?.toUpperCase().substring(0, 10)}{' '}
                    </Text>
                    <Text style={styles.scoreValue}>{item.score}</Text>
                  </Text>
                  <Text style={styles.scoreDate}>{item.date}</Text>
                  <View style={styles.rankingIcon}>
                    {renderRankIcon(index)}
                  </View>
                </View>
              </Animated.View>
            ))}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAsyncStorageClear}
            style={styles.clearButton}>
            <Text style={styles.clearButtonText}>CLEAR DATA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowProfile((prevState: boolean) => !prevState)}
            style={styles.button}>
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rankingIcon: {
    position: 'absolute',
    right: 5,
    verticalAlign: 'center',
    elevation: 5,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -1,
  },
  innerContainer: {
    borderRadius: 10,
    borderColor: colors.lightDark,
    borderWidth: 4,
    padding: 10,
    backgroundColor: colors.light,
    marginVertical: 20,
    width: '95%',
    flex: 1,
    height: '100%',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Ultra-Regular',
    padding: 10,
    borderBottomColor: colors.lightDark,
    borderBottomWidth: 2,
    backgroundColor: colors.lightDark,
    color: colors.light,
    borderRadius: 10,
    letterSpacing: 1,
    textAlign: 'center',
  },
  scoresContainer: {
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 10,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6F4',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 3,
    borderWidth: 1,
  },
  topScoreItem: {
    width: '100%',
    borderColor: colors.red,

    paddingVertical: 20,
  },
  scoreRankContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    elevation: 5,
  },
  scoreRankText: {
    fontSize: 17,
    fontFamily: 'Ultra-Regular',
    color: colors.lightDark,
  },
  scoreInfoContainer: {
    flex: 1,
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.dark,
  },
  scoreLabel: {
    fontFamily: 'Ultra-Regular',
    letterSpacing: 1,
    fontSize: 14,
  },
  scoreValue: {
    color: colors.red,
    fontFamily: 'Ultra-Regular',
    fontSize: 18,
  },
  scoreDate: {
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.lightDark2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    gap: 10,
  },
  button: {
    backgroundColor: colors.lightDark,
    flex: 1,
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
  clearButton: {
    backgroundColor: colors.light,
    borderWidth: 2,
    borderColor: colors.lightDark,
    flex: 1,
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
});

export default LeaderBoard;
