import { ToastAndroid } from 'react-native';
import { IPlayer } from '../../screens/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (user: IPlayer): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(user.name);
    let existingData: IPlayer | null = null;

    if (data) {
      existingData = JSON.parse(data);
    }

    const mergedData = existingData
      ? [...existingData.info, ...user.info]
      : user.info;

    const updatedData: IPlayer = { name: user.name, info: mergedData };

    await AsyncStorage.setItem(user.name, JSON.stringify(updatedData));
  } catch (error) {
    ToastAndroid.show('Error saving user data', ToastAndroid.SHORT);
  }
};
//retrieve the data
export const getUserData = async (name: string): Promise<IPlayer | null> => {
  try {
    const data = await AsyncStorage.getItem(name);
    if (data) {
      const userData: IPlayer = JSON.parse(data);
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    ToastAndroid.show('Error retrieving user data', ToastAndroid.SHORT);
    throw error;
  }
};
export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    ToastAndroid.show('Storage cleared', ToastAndroid.SHORT);
  } catch (error) {
    ToastAndroid.show('Error clearing storage', ToastAndroid.SHORT);
  }
};
