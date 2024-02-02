import AsyncStorage from '@react-native-async-storage/async-storage';
import lodash from 'lodash';
import { EventRegister } from 'react-native-event-listeners';

const dateOfSave = () => {
  const date = new Date();

  const day = date.getDate() < 9 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day}.${month} ${hours}:${minutes}`;
};

export const storeSavedLists = async (list, sortList) => {
  const listClone = lodash.cloneDeep(list);
  sortList.sortByAlphabet(listClone);

  try {
    const listJSON = await AsyncStorage.getItem('savedLists');

    const id = Math.round(Math.random() * 10000);
    const data = {
      date: dateOfSave(),
      list: listClone,
      id,
    };

    if (listJSON) {
      const savedLists = JSON.parse(listJSON);

      savedLists.push(data);
      if (savedLists.length > 5) {
        savedLists.shift();
      }
      await AsyncStorage.setItem('savedLists', JSON.stringify(savedLists));
    } else {
      await AsyncStorage.setItem('savedLists', JSON.stringify([data]));
    }

    EventRegister.emit('listSaved');
  } catch (e) {
    console.log(e);
  }
};
export const getSavedLists = async (setter) => {
  try {
    const listJSON = await AsyncStorage.getItem('savedLists');
    if (listJSON) {
      const list = JSON.parse(listJSON);
      setter(list);
    }
  } catch (e) {
    console.log(e);
  }
};
