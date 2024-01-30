import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storePrice = async (price) => {
  try {
    await AsyncStorage.setItem('price', price);
    EventRegister.emit('priceChange', price);
  } catch (e) {
    console.log(e);
  }
};
export const getPrice = async (setter) => {
  try {
    const price = await AsyncStorage.getItem('price');
    if (price) {
      setter(+price);
    } else {
      storePrice('18');
      setter(price);
      EventRegister.emit('priceChange', price);
    }
  } catch (e) {
    console.log(e);
  }
};
