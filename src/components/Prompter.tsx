import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { colors } from '../../assets/colors';
import React from 'react';
import Animated, { SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

const Prompter = ({
  attempt,
  roundCount,
  player,
  type,
  resetGame,
  handleNewGame,
  secretWord,
  setShowInfo,
}) => {
  React.useEffect(() => {
    const backAction = () => {
      // Perform any necessary cleanup or saving of data here
      BackHandler.exitApp(); // Exit the app
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove(); // Remove the event listener on unmount
  }, []);

  const info = [];
  if (type === 'lost') {
    info.push(
      <View style={{ padding: 10 }}>
        <Text
          style={{
            color: colors.light,
            fontWeight: '500',
            fontSize: 20,
            textAlign: 'center',
          }}>
          LOST 😢😢😢 {'\n\n'}
          {`Used All Attemps, score :0`}
          {'\n\n'}
          secret word was{' '}
          <Text
            style={{
              color: colors.yellow,
              textTransform: 'uppercase',
            }}>
            {secretWord}
          </Text>
        </Text>
      </View>,
    );
  } else {
    info.push(
      <Text style={{ color: colors.light, fontWeight: '500', fontSize: 20 }}>
        {`Round: ${roundCount.current}`}
        {'\n'}
        {'\n'}
        {`Attempt: ${attempt}`}
        {'\n'}
        {'\n'}
        {`Score: ${player?.info[player?.info?.length - 1] + '/' + 150}`}
      </Text>,
    );
  }
  return (
    <Animated.View
      style={styles.infoButton}
      entering={SlideInUp}
      exiting={SlideOutDown}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: colors.lightDark,
          top: -10,
          right: -10,
          borderColor: colors.red,
          borderWidth: 3,
          borderRadius: 50,
          zIndex: 1000,
          elevation: 10,
        }}>
        <TouchableOpacity onPress={() => setShowInfo((prev: boolean) => !prev)}>
          <AntDesign color={colors.light} size={35} name='closecircleo' />
        </TouchableOpacity>
      </View>
      <View style={styles.scoreWrapper}>
        <Text>{info[0]}</Text>
      </View>
      <View style={styles.controlContainer}>
        <TouchableOpacity onPress={() => BackHandler.exitApp()}>
          <Text
            style={[
              styles.buttonText,
              { backgroundColor: colors.red, color: colors.light },
            ]}>
            EXIT GAME
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNewGame()} style={{}}>
          <Text style={styles.buttonText}>NEW GAME</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default Prompter;

const styles = StyleSheet.create({
  scoreWrapper: {
    borderWidth: 1,
    borderColor: colors.light,
    width: '90%',
    padding: 10,
    borderRadius: 10,
    height: '60%',
  },
  infoButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '35%',
    backgroundColor: colors.lightDark,
    bottom: '35%',
    borderRadius: 10,
    borderColor: colors.lightDark,
    borderWidth: 2,
    gap: 10,
  },
  controlContainer: {
    flex: 1 / 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.gray,
    padding: 10,
    fontWeight: '500',
    backgroundColor: colors.light,
    borderRadius: 10,
  },
});
