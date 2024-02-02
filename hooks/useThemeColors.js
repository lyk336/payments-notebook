import { useEffect, useState } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { storeTheme, getTheme } from '../utils/operateTheme';

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

const useThemeColors = () => {
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
