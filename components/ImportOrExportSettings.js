import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './CustomButton';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useState } from 'react';

const ImportOrExportSettings = () => {
  const [resultMessage, setResultMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeoutId, setTimeoutId] = useState('');

  // reset messages after a while
  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    if (resultMessage) {
      setResultMessage('');
    }
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(() => {
        setErrorMessage('');
      }, 5000)
    );
  }, [errorMessage]);
  useEffect(() => {
    if (!resultMessage) {
      return;
    }

    if (errorMessage) {
      setErrorMessage('');
    }

    clearTimeout(timeoutId);
    if (resultMessage === 'Settings copied!') {
      setTimeoutId(
        setTimeout(() => {
          setResultMessage('');
        }, 3000)
      );
    }
  }, [resultMessage]);

  const handleExport = async () => {
    try {
      const list = await AsyncStorage.getItem('list');
      const theme = await AsyncStorage.getItem('theme');
      const price = await AsyncStorage.getItem('price');
      const priceMode = await AsyncStorage.getItem('priceMode');
      const groupsList = await AsyncStorage.getItem('priceGroupsList');

      const data = {
        isExported: true,
        list,
        theme,
        price,
        priceMode,
        groupsList,
      };
      await Clipboard.setStringAsync(JSON.stringify(data));
      setResultMessage('Settings copied!');
    } catch (e) {
      setErrorMessage(`${e}`);
    }
  };

  const handleImport = async () => {
    const copiedText = await Clipboard.getStringAsync();
    if (!copiedText) {
      return;
    }

    const data = JSON.parse(copiedText);

    try {
      if (!data.isExported) {
        throw new Error('You did not copy the settings');
      }
      data.list && (await AsyncStorage.setItem('list', data.list));
      data.theme && (await AsyncStorage.setItem('theme', data.theme));
      data.price && (await AsyncStorage.setItem('price', data.price));
      data.priceMode && (await AsyncStorage.setItem('priceMode', data.priceMode));
      data.groupsList && (await AsyncStorage.setItem('priceGroupsList', data.groupsList));
      setResultMessage('Settings imported! Restart the app before changing anything');
    } catch (e) {
      setErrorMessage(`${e}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <CustomButton handler={handleExport} style={styles.button} textStyle={{ color: '#fff', fontWeight: '500' }}>
          Export settings
        </CustomButton>
        <CustomButton handler={handleImport} style={styles.button} textStyle={{ color: '#fff', fontWeight: '500' }}>
          Import settings
        </CustomButton>
      </View>
      {resultMessage && <Text style={styles.resultMessage}>{resultMessage}</Text>}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6082B6',

    borderRadius: 2,
  },
  resultMessage: {
    marginTop: 16,

    fontSize: 16,
    color: '#2AAA8A',
  },
  errorMessage: {
    marginTop: 16,

    fontSize: 16,
    color: '#DE3163',
  },
});

export default ImportOrExportSettings;
