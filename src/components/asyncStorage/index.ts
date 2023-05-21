import { ToastAndroid } from 'react-native';
import { Iinfo } from '../../screens/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (scores: Iinfo[]): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem('scores');
    let existingData: any[] = [];

    if (data) {
      existingData = JSON.parse(data);
    }

    const existingIds = new Set(existingData.map((item) => item.id));

    const mergedData = scores.filter((item) => !existingIds.has(item.id));

    const updatedData: Iinfo[] = [...existingData, ...mergedData];

    await AsyncStorage.setItem('scores', JSON.stringify(updatedData));
  } catch (error) {
    ToastAndroid.show('Error saving user data', ToastAndroid.SHORT);
  }
};

// Retrieve the data
export const getUserData = async (): Promise<Iinfo | null> => {
  try {
    const data = await AsyncStorage.getItem('scores');
    if (data) {
      const userData: Iinfo = JSON.parse(data);
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
