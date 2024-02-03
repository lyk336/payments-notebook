import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import useThemeColors from '../hooks/useThemeColors';

const SelectTheme = () => {
  const { themeStyles, appTheme } = useThemeColors();
  const borderColor = appTheme === 'light' ? '#000' : '#fff';

  return (
    <View style={styles.theme}>
      <View style={styles.theme__option}>
        <Text style={[styles.theme__label, themeStyles.fontColor]}>Light</Text>
        <TouchableOpacity
          style={[styles.theme__button, { borderColor }]}
          onPress={() => {
            EventRegister.emit('themeChange', 'light');
          }}
        >
          <View style={appTheme === 'light' && styles.theme__mark}></View>
        </TouchableOpacity>
      </View>
      <View style={styles.theme__option}>
        <Text style={[styles.theme__label, themeStyles.fontColor]}>Dark</Text>
        <TouchableOpacity
          style={[styles.theme__button, { borderColor }]}
          onPress={() => {
            EventRegister.emit('themeChange', 'dark');
          }}
        >
          <View style={appTheme === 'dark' && styles.theme__mark}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  theme: {
    flexDirection: 'row',
    gap: 40,
  },
  theme__option: {
    alignItems: 'center',
    gap: 4,
  },
  theme__label: {
    fontSize: 16,
  },
  theme__button: {
    justifyContent: 'center',
    alignItems: 'center',

    width: 28,
    height: 28,
    borderWidth: 1,

    borderRadius: 100,
  },
  theme__mark: {
    backgroundColor: '#6082B6',
    width: 14,
    height: 14,
    borderRadius: 100,
  },
});

export default SelectTheme;
