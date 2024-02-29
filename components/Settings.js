import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Keyboard } from 'react-native';
import CustomButton from './CustomButton';
import ChangePriceInput from './ChangePriceInput';
import SelectTheme from './SelectTheme';
import ImportOrExportSettings from './ImportOrExportSettings';
import useThemeColors from '../hooks/useThemeColors';
import { storePrice, getPrice } from '../utils/operatePrice';
import NewGroup from './AddNewPriceGroupInputs';
import lodash from 'lodash';
import { storePriceGroupsList, getPriceGroupsList } from '../utils/operatePriceGroupsList';
import { storePriceMode, getPriceMode } from '../utils/operatePriceMode';

const Settings = () => {
  const [priceChanging, setPriceChanging] = useState(false);
  const [price, setPrice] = useState(18);
  const [priceMode, setPriceMode] = useState('Single price');
  const [isAddingNewGroup, setIsAddingNewGroup] = useState(false);
  const [priceGroupsList, setPriceGroupsList] = useState([]);
  const { themeStyles, appTheme } = useThemeColors();

  useEffect(() => {
    getPrice(setPrice);
    getPriceGroupsList(setPriceGroupsList);
    getPriceMode(setPriceMode);
  }, []);

  useEffect(() => {
    storePriceGroupsList(lodash.cloneDeep(priceGroupsList));
  }, [priceGroupsList]);
  useEffect(() => {
    storePriceMode(priceMode);
  }, [priceMode]);

  const handleChangeDefaultPrice = (newPrice) => {
    storePrice(newPrice.toString());
    setPrice(newPrice);
    setPriceChanging(false);
  };
  const handleChangeCertainPrice = (newPrice) => {
    const groupIndex = priceGroupsList.findIndex((group) => group.groupName === priceChanging);
    priceGroupsList[groupIndex].price = newPrice;
    storePriceGroupsList(lodash.cloneDeep(priceGroupsList));
    setPriceChanging(false);
  };

  const handleAddNewGroup = (values) => {
    const { price } = values;
    let { groupName } = values;
    if (groupName === 'default') {
      groupName = 'default1';
    }
    const existingGroupIndex = priceGroupsList.findIndex((group) => group.groupName === groupName);
    if (existingGroupIndex === -1) {
      const newGroup = {
        groupName,
        price,
      };
      const newList = [...priceGroupsList, newGroup];
      setPriceGroupsList(newList);
    } else {
      priceGroupsList[existingGroupIndex].price = price;
      storePriceGroupsList(lodash.cloneDeep(priceGroupsList));
    }

    setIsAddingNewGroup(false);
  };

  const switchPriceMode = () => {
    priceMode === 'Single price' ? setPriceMode('Price groups') : setPriceMode('Single price');
  };

  return (
    <ScrollView style={[styles.options, themeStyles.background, { flex: 1, marginTop: 2 }]}>
      <Pressable onPress={Keyboard.dismiss}>
        <View>
          <View style={[styles.options__section, { borderBottomColor: appTheme === 'light' ? '#e5e5e5' : '#a3a3a3' }]}>
            <Text style={[styles.options__title, themeStyles.fontColor]}>Prices</Text>
            {priceMode === 'Price groups' ? (
              <>
                <Text style={[styles.options__subtitle1, themeStyles.fontColor]}>Add new group</Text>
                <View style={styles.options__addGroup}>
                  {isAddingNewGroup ? (
                    <NewGroup
                      handleSubmit={handleAddNewGroup}
                      handleCancel={() => setIsAddingNewGroup(false)}
                      fontColor={appTheme === 'light' ? '#000' : '#fff'}
                    />
                  ) : (
                    <CustomButton
                      style={[styles.options__button, { backgroundColor: appTheme === 'light' ? '#eee' : '#626262' }]}
                      textStyle={themeStyles.fontColor}
                      handler={() => setIsAddingNewGroup(true)}
                    >
                      Add new group
                    </CustomButton>
                  )}
                </View>
                <Text style={[styles.options__subtitle1, themeStyles.fontColor, { marginBottom: 4 }]}>
                  Price groups
                </Text>
                <View style={styles.groupsList}>
                  {priceGroupsList.map((group) => (
                    <View
                      style={[styles.group, { borderBottomColor: appTheme === 'light' ? '#e5e5e5' : '#a3a3a3' }]}
                      key={group.groupName}
                    >
                      <Text style={[styles.group__text, themeStyles.fontColor]}>{group.groupName}</Text>
                      <Text style={[styles.group__text, themeStyles.fontColor]}>
                        Current price per payment: {group.price}
                      </Text>
                      {priceChanging === group.groupName ? (
                        <>
                          <ChangePriceInput
                            handleChangePrice={handleChangeCertainPrice}
                            handleCancel={() => {
                              setPriceChanging(false);
                            }}
                            fontColor={appTheme === 'light' ? '#000' : '#fff'}
                          />
                        </>
                      ) : (
                        <CustomButton
                          handler={() => {
                            setPriceChanging(group.groupName);
                          }}
                          style={[
                            styles.options__button,
                            styles.group__changePrice,
                            { backgroundColor: appTheme === 'light' ? '#eee' : '#626262' },
                          ]}
                          textStyle={themeStyles.fontColor}
                        >
                          Change price
                        </CustomButton>
                      )}
                      <CustomButton
                        handler={() => {
                          const newGroupList = priceGroupsList.filter((item) => item.groupName !== group.groupName);
                          setPriceGroupsList(newGroupList);
                        }}
                        style={styles.group__delete}
                        textStyle={{ color: '#fff' }}
                      >
                        Delete group
                      </CustomButton>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.options__subtitle1, themeStyles.fontColor]}>Change price for 1 payment</Text>
                <Text style={[styles.options__text, styles.options__price, themeStyles.fontColor]}>
                  Current price: {price}
                </Text>
                {priceChanging === 'default' ? (
                  <ChangePriceInput
                    handleChangePrice={handleChangeDefaultPrice}
                    handleCancel={() => {
                      setPriceChanging(false);
                    }}
                    fontColor={appTheme === 'light' ? '#000' : '#fff'}
                  />
                ) : (
                  <CustomButton
                    handler={() => {
                      setPriceChanging('default');
                    }}
                    style={[
                      styles.options__button,
                      styles.options__changePrice,
                      { backgroundColor: appTheme === 'light' ? '#eee' : '#626262' },
                    ]}
                    textStyle={themeStyles.fontColor}
                  >
                    Change price
                  </CustomButton>
                )}
              </>
            )}
            <Text style={[styles.options__subtitle1, themeStyles.fontColor]}>
              {priceMode === 'Single price' ? 'Switch to multiple price mode' : 'Switch to single price mode'}
            </Text>
            <CustomButton
              handler={() => {
                setPriceChanging(false);
                setIsAddingNewGroup(false);
                switchPriceMode();
              }}
              style={[styles.options__button, { backgroundColor: appTheme === 'light' ? '#eee' : '#626262' }]}
              textStyle={themeStyles.fontColor}
            >
              Switch mode
            </CustomButton>
          </View>
          <View style={[styles.options__section, { borderBottomColor: appTheme === 'light' ? '#e5e5e5' : '#a3a3a3' }]}>
            <Text style={[styles.options__title, themeStyles.fontColor]}>App theme</Text>
            <SelectTheme />
          </View>
          <View style={[styles.options__section, { borderBottomColor: appTheme === 'light' ? '#e5e5e5' : '#a3a3a3' }]}>
            <Text style={[styles.options__title, themeStyles.fontColor]}>Export/Import settings</Text>
            <ImportOrExportSettings />
          </View>
        </View>
      </Pressable>
    </ScrollView>
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
    borderBStyle: 'solid',
    paddingBottom: 12,
    marginBottom: 12,
  },
  options__title: {
    marginBottom: 8,

    fontSize: 24,
    fontWeight: '500',
  },
  options__subtitle1: {
    marginBottom: 6,

    fontSize: 18,
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
  options__changePrice: {
    marginBottom: 12,
  },
  options__addGroup: {
    marginBottom: 16,
  },
  group__delete: {
    maxWidth: 150,
    paddingVertical: 4,
    marginTop: 16,
    backgroundColor: '#DE3163',

    borderRadius: 4,
  },
  groupsList: {
    marginBottom: 8,
    rowGap: 8,
  },
  group: {
    marginHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBStyle: 'solid',
  },
  group__text: {
    fontWeight: '500',
    marginBottom: 8,
  },
});

export default Settings;
