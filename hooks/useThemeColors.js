import { useEffect, useState } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colorSchemes = StyleSheet.create({
  light: {
    background: { backgroundColor: '#f5f5f5' },
    fontColor: { color: '#000' },
  },
  dark: {
    background: { backgroundColor: '#525252' },
    fontColor: { color: '#fff' },
  },
});

const storeTheme = async (theme) => {
  try {
    await AsyncStorage.setItem('theme', theme);
  } catch (e) {
    console.log(e);
  }
};

const getTheme = async (setter, preferredTheme) => {
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

const useThemeColors = () => {
  // in future check start value inside local storage
  const theme = useColorScheme();
  const [appTheme, setAppTheme] = useState(theme);

  useEffect(() => {
    getTheme(setAppTheme, theme);
  }, []);

  const changeTheme = (theme) => {
    setAppTheme(theme);
  };

  useEffect(() => {
    EventRegister.removeEventListener(themeEvent);
    const themeEvent = EventRegister.addEventListener('themeChange', (theme) => {
      storeTheme(theme);
      changeTheme(theme);
    });
  }, [changeTheme]);

  return { themeStyles: colorSchemes[appTheme], appTheme };
};

export default useThemeColors;
