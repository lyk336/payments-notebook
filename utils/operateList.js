import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lodash from 'lodash';

export const storeList = async (list, sortList) => {
  const listClone = lodash.cloneDeep(list);

  sortList.sortByAlphabet(listClone);
  const listJSON = JSON.stringify(listClone);

  try {
    await AsyncStorage.setItem('list', listJSON);
    EventRegister.emit('listChange', listJSON);
  } catch (e) {
    console.log(e);
  }
};
export const getList = async (setter) => {
  try {
    const listJSON = await AsyncStorage.getItem('list');
    if (listJSON) {
      const list = JSON.parse(listJSON);
      setter(list);
    }
  } catch (e) {
    console.log(e);
  }
};
