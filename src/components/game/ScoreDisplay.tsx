import { useEffect, useMemo, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { handleScoreDisplay } from '../../utils/Helper';
import { TOTAL_SCORE } from '../../utils/constants';

const ScoreDisplay = (data: any) => {
  //   const prevScore = useRef(data.score);
  //   const headerTextStyle = useAnimatedStyle(() => {
  //     return {
  //       transform: [{ translateY: withSpring(data.isScoreChanged ? 0 : -30) }],
  //       opacity: withSpring(data.isScoreChanged ? 1 : 0),
  //     };
  //   });

  //   useEffect(() => {
  //     if (data.score !== prevScore.current) {
  //       data.setIsScoreChanged(true);
  //       prevScore.current = data.score;
  //     }
  //   }, [data.score]);

  //   const formattedTotalScore = useMemo(() => {
  //     return `${TOTAL_SCORE}`;
  //   }, [TOTAL_SCORE]);

  return (
    <Animated.View>
      <View style={styles.headerText}>
        <Animated.View>
          <Text
            style={{
              fontWeight: '700',
              color: colors.red,
              fontSize: 25,
            }}>
            {handleScoreDisplay(data)} /{' '}
          </Text>
        </Animated.View>
        <Text>{TOTAL_SCORE}</Text>
      </View>
    </Animated.View>
  );
};
export default ScoreDisplay;

const styles = StyleSheet.create({
  gameWrapper: {
    alignSelf: 'stretch',
    backgroundColor: colors.light,
    flex: 1,
    gap: 5,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Roboto',
    color: colors.lightDark,
    textAlign: 'center',
    padding: 10,
    backgroundColor: colors.light,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.lightDark,
    fontWeight: 'bold',
  },

  guessedWordsContainer: {
    flex: 1,
    backgroundColor: colors.light,
    margin: 20,
  },
  keyboardContainer: {
    flex: 2 / 3,

    alignSelf: 'stretch',
    width: '100%',
  },
  guessRow: {
    flex: 1 / 5,
    backgroundColor: colors.light,
    flexDirection: 'row',
    display: 'flex',
    width: '98%',
    alignSelf: 'center',
  },

  guessCell: {
    alignSelf: 'stretch',
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 8,

    transition: 'transform 0.2s ease-out',
    cursor: 'pointer',
  },

  letter: {
    color: colors.lightDark,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
});
