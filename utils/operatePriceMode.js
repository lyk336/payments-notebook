import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storePriceMode = async (priceMode) => {
  try {
    await AsyncStorage.setItem('priceMode', priceMode);
    EventRegister.emit('priceModeChange', priceMode);
  } catch (e) {
    console.log(e);
  }
};
export const getPriceMode = async (setter) => {
  try {
    const priceMode = await AsyncStorage.getItem('priceMode');
    if (priceMode) {
      setter(priceMode);
    }
  } catch (e) {
    console.log(e);
  }
};
