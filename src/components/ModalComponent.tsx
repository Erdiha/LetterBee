import React, { useState } from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import Animated, {
  BounceInUp,
  BounceOutDown,
  SlideInDown,
} from 'react-native-reanimated';

import ConfettiCannon from 'react-native-confetti-cannon';
import { colors } from '../../assets/colors';

function ModalComponent({
  gameOver,
  setGameOver,
  secretWord,
  player,
  roundCount,
  resetGame,
}) {
  const [isModalVisible, setModalVisible] = useState(gameOver);
  const word = secretWord.join('').toUpperCase();
  console.log('player', player);
  return (
    <View style={styles.centeredView}>
      <Modal transparent={true} animationType='slide' visible={isModalVisible}>
        <View style={styles.modalView}>
          <ConfettiCannon
            fadeOut={true}
            count={200}
            origin={{ x: -10, y: 0 }}
          />
          <View
            style={{ flex: 1, padding: 10, justifyContent: 'space-around' }}>
            <Animated.View entering={BounceInUp}>
              <Text
                style={{
                  width: '100%',
                  height: 60,
                  fontSize: 50,
                }}>
                CONRATS!!!
              </Text>
            </Animated.View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: 30,
                  color: colors.gray,
                  fontWeight: '600',
                }}>
                Word is:{'  '}
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 35,
                  color: colors.lightDark,
                }}>
                {word}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: 30,
                  color: colors.gray,
                  fontWeight: '600',
                }}>
                Score:
              </Text>
              <Text style={styles.scoreText}>
                {player.score}/{roundCount.current}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(!isModalVisible);
              resetGame();
            }}>
            <Text
              style={{ fontSize: 20, fontWeight: '700', color: colors.light }}>
              CLOSE
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default ModalComponent;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    flex: 2 / 3,
    margin: 10,
    marginTop: 200,
    backgroundColor: colors.light,
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: colors.lightDark,
    borderWidth: 2,
  },
  closeButton: {
    backgroundColor: colors.lightDark,
    height: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '50%',
    flex: 1 / 5,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    color: colors.light,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: colors.lightDark,
    width: 100,
    marginHorizontal: 5,
    borderRadius: 5,
    height: 40,
    textAlignVertical: 'center',
  },
  modalWrapper: {
    backgroundColor: colors.gray,
    height: '50%',
    borderRadius: 10,
  },
});
