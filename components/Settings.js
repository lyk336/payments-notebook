import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Keyboard } from 'react-native';
import CustomButton from './CustomButton';
import ChangePriceInput from './ChangePriceInput';
import SelectTheme from './SelectTheme';
import useThemeColors from '../hooks/useThemeColors';
import { storePrice, getPrice } from '../utils/operatePrice';

const Settings = () => {
  const [priceChanging, setPriceChanging] = useState(false);
  const [price, setPrice] = useState(18);
  const { themeStyles, appTheme } = useThemeColors();

  useEffect(() => {
    getPrice(setPrice);
  }, []);

  const handleChangePrice = (newPrice) => {
    storePrice(JSON.stringify(newPrice));
    setPrice(newPrice);
    setPriceChanging(false);
  };
  const handleCancel = () => {
    setPriceChanging(false);
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1, marginTop: 2 }}>
      <ScrollView style={[styles.options, themeStyles.background]}>
        <View style={[styles.options__section, { borderBottomColor: appTheme === 'light' ? '#e5e5e5' : '#a3a3a3' }]}>
          <Text style={[styles.options__title, themeStyles.fontColor]}>Change price for 1 lesson</Text>
          <View>
            <Text style={[styles.options__text, styles.options__price, themeStyles.fontColor]}>Current price: {price}</Text>
          </View>
          {priceChanging ? (
            <ChangePriceInput
              handleChangePrice={handleChangePrice}
              handleCancel={handleCancel}
              fontColor={appTheme === 'light' ? '#000' : '#fff'}
            />
          ) : (
            <CustomButton
              handler={() => {
                setPriceChanging(true);
              }}
              style={[styles.options__button, styles.changeButton, { backgroundColor: appTheme === 'light' ? '#eee' : '#626262' }]}
              textStyle={themeStyles.fontColor}
            >
              Change Value
            </CustomButton>
          )}
        </View>
        <View style={[styles.options__section, { borderBottomColor: appTheme === 'light' ? '#e5e5e5' : '#a3a3a3' }]}>
          <Text style={[styles.options__title, themeStyles.fontColor]}>App theme</Text>
          <SelectTheme />
        </View>
      </ScrollView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  options: {
    paddingTop: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  options__section: {
    borderBottomWidth: 2,
    borderBottomColor: '#e5e5e5',
    borderBStyle: 'solid',
    paddingBottom: 12,
    marginBottom: 12,
  },
  options__title: {
    marginBottom: 8,

    fontSize: 20,
    fontWeight: '500',
  },
  options__text: {
    fontSize: 16,
  },
  options__price: {
    marginBottom: 4,
  },
  options__button: {
    maxWidth: 150,
    paddingVertical: 4,
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderColor: '#a3a3a3',
    borderStyle: 'solid',

    borderRadius: 4,
  },
});

export default Settings;
