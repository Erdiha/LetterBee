import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Avatar, Icon } from 'react-native-elements';
import { colors } from '../../utils/constants';

const UserAvatar = ({ player, setShowProfile }) => {
  const handleProfileOpen = () => {
    setShowProfile(true);
  };

  return (
    <View style={styles.avatar}>
      <TouchableOpacity onPress={handleProfileOpen}>
        <Avatar
          size='small'
          rounded
          title={
            player?.name && player?.name[0]
              ? player?.name[0] + (player?.name[1]?.toUpperCase() || '')
              : 'P'
          }
          activeOpacity={0.7}
          overlayContainerStyle={{
            backgroundColor: colors.lightDark,
            color: colors.red,
            fontFamily: 'Ultra-Regular',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    position: 'absolute',
    left: 10,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: colors.light,
    width: 51,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserAvatar;
