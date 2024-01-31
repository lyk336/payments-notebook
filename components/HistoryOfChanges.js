import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { storeSavedLists, getSavedLists } from '../utils/operateHistoryOfChanges';
import { Shadow } from 'react-native-shadow-2';
import CustomButton from './CustomButton';
import { EventRegister } from 'react-native-event-listeners';
import lodash from 'lodash';
import useThemeColors from '../hooks/useThemeColors';

const dateOfSave = () => {
  const date = new Date();

  const day = date.getDate() < 9 ? `0${date.getDate()}` : date.getDate();
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day}.${month} ${hours}:${minutes}`;
};

const HistoryOfChanges = () => {
  const [savedLists, setSavedLists] = useState([]);
  const [timeoutId, setTimeoutId] = useState('');
  const { themeStyles } = useThemeColors();

  useEffect(() => {
    getSavedLists(setSavedLists);
  }, []);

  const saveChanges = (newList) => {
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(() => {
        const listClone = lodash.cloneDeep(savedLists);
        listClone.push(JSON.parse(newList));
        if (listClone.length > 5) {
          listClone.shift();
        }

        setSavedLists(listClone);
        storeSavedLists(listClone);
      }, 10000)
    );
  };
  useEffect(() => {
    EventRegister.removeEventListener(listChangeEvent);
    const listChangeEvent = EventRegister.addEventListener('savedLists', (newList) => {
      saveChanges(newList);
    });
  }, [saveChanges]);

  return (
    <View>
      <ScrollView>
        {savedLists.map((list) => (
          <TouchableOpacity></TouchableOpacity>
          // <View key={item.id}>
          //   <View
          //     style={[styles.person, themeStyles.background]}
          //     // containerStyle={{ marginHorizontal: 8 }}
          //   >
          //     <View>
          //       <Text style={themeStyles.fontColor}>{item.name}</Text>
          //     </View>
          //     <View>
          //       <Text style={themeStyles.fontColor}>Updated: {item.lastUpdate.substring(0, 5)}</Text>
          //     </View>
          //     <View style={styles.person__balanceContainer}>
          //       <Text style={[styles.person__balance, themeStyles.fontColor]}>{item.currentCash} / X</Text>
          //     </View>
          //   </View>
          // </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  person: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,

    position: 'relative',
    zIndex: 100,

    marginVertical: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',

    borderRadius: 8,
  },
  person__balance: {
    fontWeight: '500',
  },
  person__balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HistoryOfChanges;
