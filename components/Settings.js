import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable, Keyboard, TextInput } from 'react-native';
import CustomButton from './CustomButton';
import ChangePriceInput from './ChangePriceInput';
import SelectTheme from './SelectTheme';

// const windowHeight = Dimensions.get('window').height;

const Settings = () => {
  const [priceChanging, setPriceChanging] = useState(false);
  const [price, setPrice] = useState(18);

  // const scrollToElement = () => {
  //   first method is element I want scroll to
  //   test2Ref.current.measure((x, y, width, height, pageX, pageY) => {
  // method that scrolls
  //     scrollViewRef.current.scrollTo({ y: pageY - 80, animated: true });
  //   });
  // };

  const handleChangePrice = (newPrice) => {
    setPrice(newPrice);
    setPriceChanging(false);
  };
  const handleCancel = () => {
    setPriceChanging(false);
  };

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1, marginTop: 2 }}>
      <ScrollView style={styles.options}>
        <View style={styles.options__section}>
          <Text style={styles.options__title}>Change price for 1 lesson</Text>
          <View>
            <Text style={[styles.options__text, styles.options__price]}>Current price: {price}</Text>
          </View>
          {priceChanging ? (
            <ChangePriceInput handleChangePrice={handleChangePrice} handleCancel={handleCancel} />
          ) : (
            <CustomButton
              handler={() => {
                setPriceChanging(true);
              }}
              style={[styles.options__button, styles.changeButton]}
            >
              Change Value
            </CustomButton>
          )}
        </View>
        <View style={styles.options__section}>
          <Text style={styles.options__title}>App theme</Text>
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
