import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { RootStackParamList, IPlayer, Iinfo } from './types';
import Animated, {
  BounceOutDown,
  FadeInUp,
  FlipInEasyX,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  SlideOutDown,
} from 'react-native-reanimated';
import { colors } from '../utils/constants';
import Game from '../components/game/Game';
import Rules from '../utils/Rules';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
  updatePlayer: (updatedPlayer: IPlayer) => void;
}

function GameScreen({ navigation }: GameScreenProps) {
  const [isValidInput, setIsValidInput] = useState(false);

  const [player, setPlayer] = React.useState<IPlayer>({
    name: '',
    info: [],
  });
  const [start, setStart] = React.useState<number>(0);

  const handlePlayerName = (text: string) => {
    const regex = /^[a-zA-Z]+$/;

    if (text.trim() !== '' && regex.test(text)) {
      setPlayer((prevPlayer) => ({ ...prevPlayer, name: text }));
      setIsValidInput(true);
    } else {
      setPlayer((prevPlayer) => ({ ...prevPlayer, name: text }));
      setIsValidInput(false);
      ToastAndroid.show('Invalid input', ToastAndroid.SHORT);
    }
  };

  const handleSubmit = () => {
    if (isValidInput) {
      // Perform the submit action
      setStart(2);
    } else {
      ToastAndroid.show('Invalid input', ToastAndroid.SHORT);
    }
  };

  const chooseGameType = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.light,
        }}>
        <Animated.View
          entering={SlideInLeft.duration(500).delay(500)}
          exiting={SlideOutDown}>
          <TouchableOpacity onPress={() => setStart(1)} style={styles.buttons}>
            <Text style={styles.buttonText}>Single Player</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={SlideInRight.duration(500).delay(400)}
          exiting={SlideOutDown}>
          <TouchableOpacity onPress={() => setStart(3)} style={styles.buttons}>
            <Text style={styles.buttonText}>Multi Player</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={SlideInUp} exiting={SlideOutDown.delay(200)}>
          <TouchableOpacity
            onPress={() => setStart(4)}
            style={[
              styles.buttons,
              {
                marginTop: 100,
                backgroundColor: colors.light,
                borderColor: colors.lightDark,
                borderWidth: 3,
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: colors.red,
                  fontFamily: 'Ultra-Regular',
                  letterSpacing: 2,
                  fontSize: 25,
                },
              ]}>
              RULES
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderInputName = () => {
    return (
      <Animated.View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder='Name'
          value={player.name}
          onChangeText={(text) => handlePlayerName(text)}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.buttons}
          disabled={!isValidInput}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleComingSoon = () => {
    setTimeout(() => {
      setStart(0);
    }, 1500);
    return (
      <Animated.View
        entering={FlipInEasyX.duration(900)}
        exiting={BounceOutDown}
        style={styles.comingSoon}>
        <Text style={styles.comingSoonText}>Coming Soon!</Text>
      </Animated.View>
    );
  };

  const handleChoice = (choice: number) => {
    switch (choice) {
      case 0:
        return chooseGameType();
      case 1:
        return renderInputName();
      case 2:
        return <Game player={player} setPlayer={setPlayer} />;
      case 3:
        return handleComingSoon();
      case 4:
        return <Rules setStart={setStart} />;
      default:
        break;
    }
  };

  return (
    <Animated.View
      entering={FadeInUp}
      style={{
        flex: 1,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {handleChoice(start)}
    </Animated.View>
  );
}

//////////////////styles and export //////////////////////

export default GameScreen;

const styles = StyleSheet.create({
  inputWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  comingSoon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightDark,

    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  comingSoonText: {
    color: colors.light,
    fontSize: 30,
    fontFamily: 'Ultra-Regular',
  },
  buttons: {
    backgroundColor: colors.lightDark,
    width: 200,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    elevation: 10,
  },
  buttonText: {
    color: colors.light,
    fontSize: 20,
    fontFamily: 'Ultra-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginVertical: 10,
    width: 200,
    fontSize: 18,
    height: 50,
  },
});
