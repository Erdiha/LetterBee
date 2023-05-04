import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Avatar, Icon } from 'react-native-elements';
import { colors } from '../../assets/colors';

const UserAvatar = ({ player }) => {
  return (
    <View style={styles.avatar}>
      <Avatar
        size='medium'
        rounded
        title={
          player?.name[0]
            ? player?.name[0] + player?.name[1]?.toUpperCase()
            : 'P'
        }
        activeOpacity={0.7}
        overlayContainerStyle={{ backgroundColor: colors.lightDark }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    position: 'absolute',
    left: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.gray,
  },
});

export default UserAvatar;
