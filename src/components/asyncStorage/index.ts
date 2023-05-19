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

    const sortedData = mergedData.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Sort by score in descending order
      } else {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Sort by date in descending order for same score
      }
    });

    const updatedData: IPlayer = { name: user.name, info: sortedData };

    await AsyncStorage.setItem(user.name, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};
//retrieve the data
export const getUserData = async (name: string): Promise<IPlayer | null> => {
  try {
    const data = await AsyncStorage.getItem(name);

    if (data) {
      const userData: IPlayer = JSON.parse(data);

      const sortedData = userData.info.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score; // Sort by score in descending order
        } else {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime(); // Sort by date in descending order for same score
        }
      });

      userData.info = sortedData;

      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
};
export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully.');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};
