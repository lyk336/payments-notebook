import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

const SelectTheme = () => {
  const [activeTheme, setActiveTheme] = useState('light');

  return (
    <View style={styles.theme}>
      <View style={styles.theme__option}>
        <Text style={styles.theme__label}>Light</Text>
        <TouchableOpacity
          style={styles.theme__button}
          onPress={() => {
            EventRegister.emit('themeChange', 'light');
            setActiveTheme('light');
          }}
        >
          <View style={activeTheme === 'light' && styles.theme__mark}></View>
        </TouchableOpacity>
      </View>
      <View style={styles.theme__option}>
        <Text style={styles.theme__label}>Dark</Text>
        <TouchableOpacity
          style={styles.theme__button}
          onPress={() => {
            EventRegister.emit('themeChange', 'dark');
            setActiveTheme('dark');
          }}
        >
          <View style={activeTheme === 'dark' && styles.theme__mark}></View>
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
    backgroundColor: '#4169E1',
    width: 14,
    height: 14,
    borderRadius: 100,
  },
});

export default SelectTheme;
