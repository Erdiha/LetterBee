import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import Animated, {
  Easing,
  BounceInUp,
  ZoomInEasyDown,
  FlipInYLeft,
  BounceOutLeft,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ROUND_SCORE, bgColor, colors, enter } from '../../utils/constants';
import { MAX_ROUND, TOTAL_SCORE } from '../../utils/constants';

const randomColor = () => {
  const randomIndex = Math.floor(Math.random() * bgColor.length);
  return bgColor[randomIndex];
};

function ModalComponent({
  roundIsOver,
  handleRoundIsOver,
  secretWord,

  setAllGuesses,

  playerScore,
  roundCount,
}) {
  const [isModalVisible, setModalVisible] = useState(roundIsOver);

  const word = 'CONGRATS'.toUpperCase().split('');

  const scoreRemaining = ROUND_SCORE - playerScore.current[roundCount.current];

  const closeModal = () => {
    setAllGuesses([]);
    handleRoundIsOver();
    setTimeout(() => {
      setModalVisible(!roundIsOver);
    }, 1000);
  };
  return (
    <Modal transparent={true} animationType='none' visible={isModalVisible}>
      <Animated.View
        entering={FlipInYLeft}
        exiting={BounceOutLeft}
        style={styles.modalView}>
        <ConfettiCannon fadeOut={true} count={200} origin={{ x: -10, y: 0 }} />
        <View style={styles.modalContent}>
          <View style={styles.congratsContainer}>
            {word.map((letter: string, index: number) => (
              <Animated.Text
                entering={ZoomInEasyDown.delay(200 * index + 500)
                  .duration(1500)
                  .damping(0.5)
                  .easing(Easing.bounce)}
                exiting={BounceInUp.delay(200 * index)}
                key={index}
                style={[styles.congratsText, { color: bgColor[index] }]}>
                {letter}
              </Animated.Text>
            ))}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Word is: </Text>
            <Text style={styles.wordText}>{secretWord}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Score: </Text>
            <Text style={styles.scoreText}>
              {scoreRemaining}/{TOTAL_SCORE / MAX_ROUND}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Text style={styles.closeButtonText}>CLOSE</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalView: {
    bottom: '32%',
    margin: 10,
    backgroundColor: colors.light,
    borderRadius: 20,
    padding: 35,
    elevation: 5,
    borderColor: colors.lightDark,
    borderWidth: 2,
    position: 'absolute',
    height: '45%',
    alignSelf: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-around',
  },
  congratsContainer: {
    flexDirection: 'row',
  },
  congratsText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'Ultra-Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 30,
    color: colors.gray,
    fontWeight: '600',
    fontFamily: 'Ultra-Regular',
    textAlignVertical: 'center',
  },
  wordText: {
    fontWeight: '700',
    fontSize: 35,
    color: colors.lightDark,
    textTransform: 'uppercase',
    fontFamily: 'Ultra-Regular',
    textAlignVertical: 'center',
  },
  scoreText: {
    fontSize: 20,
    color: colors.lightDark,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: colors.gray,
    width: 100,
    marginHorizontal: 5,
    borderRadius: 5,
    height: 40,
    textAlignVertical: 'center',
    fontFamily: 'Ultra-Regular',
  },
  closeButton: {
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '50%',
    flex: 1 / 5,
    marginBottom: 5,
    elevation: 5,
    alignSelf: 'center',
    borderColor: colors.lightDark,
    borderWidth: 2,
  },
  closeButtonText: {
    fontSize: 20,

    color: colors.lightDark,
    letterSpacing: 2,
    fontFamily: 'Ultra-Regular',
  },
});

export default ModalComponent;
