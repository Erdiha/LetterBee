import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { handleScoreDisplay } from '../../utils/Helper';
import { TOTAL_SCORE, colors } from '../../utils/constants';
import { AntDesign } from '@expo/vector-icons';
import UserAvatar from '../prompters/UserAvatar';

const GameBanner = ({
  allGuesses,
  roundCount,
  playerScore,
  secretWord,
  attempt,
  score,
  giveUpPoints,
  showInfo,
  setShowInfo,
  player,
  setShowProfile,
  hint,
  hintPoints,
}) => {
  const handleInfoToggle = () => {
    setShowInfo(!showInfo);
  };

  const scoreDisplay = useMemo(
    () =>
      handleScoreDisplay(
        allGuesses,
        roundCount,
        playerScore,
        secretWord,
        score,
        giveUpPoints,
        hint,
        hintPoints,
      ),
    [
      allGuesses,
      roundCount,
      playerScore,
      secretWord,
      score.current,
      giveUpPoints,
      hint,
      hintPoints,
    ],
  );

  return useMemo(
    () => (
      <View style={styles.banner}>
        <View>
          <Text style={styles.headerText}>
            <Animated.Text style={styles.scoreWrapper}>
              {scoreDisplay()}
            </Animated.Text>
            /{TOTAL_SCORE}
          </Text>
        </View>
        <TouchableOpacity style={styles.infoWrapper} onPress={handleInfoToggle}>
          <AntDesign
            style={{ fontFamily: 'Ultra-Regular' }}
            size={40}
            name='infocirlce'
            color={colors.gray}
          />
        </TouchableOpacity>
        <UserAvatar player={player} setShowProfile={setShowProfile} />
      </View>
    ),
    [
      scoreDisplay,
      handleInfoToggle,
      showInfo,
      player,
      setShowProfile,
      hint,
      score.current,
    ],
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    display: 'flex',
    position: 'relative',
    backgroundColor: colors.lightDark,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Ultra-Regular',
    color: colors.lightDark,
    textAlign: 'center',
    padding: 10,
    backgroundColor: colors.light,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.lightDark,
    borderRadius: 50,
    elevation: 5,
  },
  infoWrapper: {
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
    borderRadius: 50,
    backgroundColor: colors.lightDark,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.light,
  },
  scoreWrapper: {
    fontFamily: 'Ultra-Regular',
    color: colors.red,
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default GameBanner;
