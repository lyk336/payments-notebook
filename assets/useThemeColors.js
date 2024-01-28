import { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';

const useThemeColors = () => {
  const [appTheme, setAppTheme] = useState('light');
  const [mainColor, setMainColor] = useState('#fff');
  const [fontColor, setFontColor] = useState('#333');

  const changeTheme = (theme) => {
    switch (theme) {
      case 'dark':
        setMainColor('#525252');
        setFontColor('#fff');
        break;
      default:
        setMainColor('#fff');
        setFontColor('#000');
    }

    setAppTheme(theme);
  };
  useEffect(() => {
    EventRegister.removeEventListener(themeEvent);
    const themeEvent = EventRegister.addEventListener('themeChange', (theme) => {
      changeTheme(theme);
    });
  }, [changeTheme]);

  return {
    appTheme,
    mainColor,
    fontColor,
  };
};

export default useThemeColors;
