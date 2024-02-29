import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storePriceGroupsList = async (groupsList) => {
  try {
    const jsonGroupsList = JSON.stringify(groupsList);
    await AsyncStorage.setItem('priceGroupsList', jsonGroupsList);
    EventRegister.emit('groupsListChange', groupsList);
  } catch (e) {
    console.log(e);
  }
};
export const getPriceGroupsList = async (setter) => {
  try {
    const jsonGroupsList = await AsyncStorage.getItem('priceGroupsList');
    if (!jsonGroupsList) return;

    const groupsList = JSON.parse(jsonGroupsList);
    if (groupsList.length > 0) {
      setter(groupsList);
    }
  } catch (e) {
    console.log(e);
  }
};
