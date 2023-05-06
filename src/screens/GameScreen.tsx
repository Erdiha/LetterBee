import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { RootStackParamList } from './types';
import Animated, {
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { colors } from '../../assets/colors';
import Game from '../components/Game';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface IPlayer {
  name: string;
  score: number;
}

interface GameScreenProps {
  navigation: GameScreenNavigationProp;
  updatePlayer: (updatedPlayer: IPlayer) => void;
}

function GameScreen({ navigation }: GameScreenProps) {
  const [singlePlayer, setSinglePlayer] = React.useState(false);
  const [player, setPlayer] = React.useState<IPlayer>({ name: '', score: 0 });
  const [start, setStart] = React.useState(0);

  const handlePlayerName = (text: string) => {
    // Regular expression to match only letters or a letter followed by numbers
    const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;

    if (text === '' || regex.test(text)) {
      // If the text matches the regular expression, it's a valid input
      setPlayer({ ...player, name: text });
      console.log('Valid input:', text);
    } else {
      // If the text doesn't match the regular expression, it's an invalid input
      ToastAndroid.show('Invalid input', ToastAndroid.SHORT);
      console.log('Invalid input:', text);
    }
  };

  const chooseGameType = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View entering={SlideInLeft} exiting={SlideOutRight}>
          <TouchableOpacity onPress={() => setStart(1)} style={styles.buttons}>
            <Text style={styles.buttonText}>Single Player</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
          <TouchableOpacity style={styles.buttons}>
            <Text style={styles.buttonText}>Multi Player</Text>
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
        <TouchableOpacity onPress={() => setStart(2)} style={styles.buttons}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
      </Animated.View>
    );
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
      {start === 0 ? (
        chooseGameType()
      ) : start === 1 ? (
        renderInputName()
      ) : (
        <Game player={player} setPlayer={setPlayer} navigation={navigation} />
      )}
    </Animated.View>
  );
}

//////////////////styles and export //////////////////////

export default GameScreen;

const styles = StyleSheet.create({
  inputWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  buttons: {
    backgroundColor: colors.lightDark,
    width: 150,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: colors.light,
    fontSize: 20,
    fontFamily: 'Roboto',
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
