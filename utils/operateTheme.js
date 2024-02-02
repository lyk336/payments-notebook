import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTheme = async (theme) => {
  try {
    await AsyncStorage.setItem('theme', theme);
  } catch (e) {
    console.log(e);
  }
};

export const getTheme = async (setter, preferredTheme) => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    if (theme) {
      setter(theme);
    } else {
      const newTheme = preferredTheme || 'light';
      storeTheme(newTheme);
      setter(newTheme);
    }
  } catch (e) {
    console.log(e);
  }
};
