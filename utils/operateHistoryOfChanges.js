import AsyncStorage from '@react-native-async-storage/async-storage';
import lodash from 'lodash';

export const storeSavedLists = async (list) => {
  const listClone = lodash.cloneDeep(list);

  const listJSON = JSON.stringify(listClone);

  try {
    await AsyncStorage.setItem('savedLists', listJSON);
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
