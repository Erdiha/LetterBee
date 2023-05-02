import React, { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Animated, { BounceInUp, BounceOutDown } from 'react-native-reanimated';

import ConfettiCannon from 'react-native-confetti-cannon';

function ModalComponent({ gameOver, setGameOver }) {
  const [isModalVisible, setModalVisible] = useState(gameOver);

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
      }}>
      <Modal isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: 'red',
            height: '50%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ConfettiCannon fadeOut={true} count={200} origin={{ x: 0, y: 0 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, color: 'white' }}>
              I am the modal content!
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              height: '8%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              width: '50%',
              flex: 1 / 7,
            }}
            onPress={() => {
              setModalVisible(false);
              setGameOver(false);
            }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default ModalComponent;
