import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getSavedLists } from '../utils/operateHistoryOfChanges';
import { EventRegister } from 'react-native-event-listeners';
import CustomButton from './CustomButton';
import useThemeColors from '../hooks/useThemeColors';

const HistoryOfChanges = () => {
  const [savedLists, setSavedLists] = useState([]);
  const [activeListId, setActiveListId] = useState('');
  const { themeStyles } = useThemeColors();

  useEffect(() => {
    getSavedLists(setSavedLists);
  }, []);

  const updateChangesList = () => {
    getSavedLists(setSavedLists);
  };
  useEffect(() => {
    EventRegister.removeEventListener(listChangeEvent);
    const listChangeEvent = EventRegister.addEventListener('listSaved', updateChangesList);
  }, [updateChangesList]);

  handleCheckDetails = (id) => {
    id === activeListId ? setActiveListId('') : setActiveListId(id);
  };
  const createAlert = (exporedtList) => {
    const alertText = `Are you sure you want to export this list?`;

    Alert.alert(
      'Confirm export',
      alertText,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'confirm',
          onPress: () => {
            EventRegister.emit('importList', exporedtList);
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.listContainer, themeStyles.background]}>
        {savedLists.map((list) => (
          <View style={styles.list} key={list.id}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                handleCheckDetails(list.id);
              }}
              style={styles.listHeader}
            >
              <View>
                <Text style={themeStyles.fontColor}>{list.date}</Text>
              </View>
              <CustomButton
                style={styles.exportList}
                textStyle={{ color: '#fff', fontWeight: '500' }}
                handler={() => {
                  createAlert(list.list);
                }}
              >
                Export list
              </CustomButton>
            </TouchableOpacity>
            {list.id === activeListId &&
              list.list.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  <View style={[styles.person, themeStyles.background]}>
                    <View>
                      <Text style={themeStyles.fontColor}>{item.name}</Text>
                    </View>
                    <View>
                      <Text style={themeStyles.fontColor}>Updated: {item.lastUpdate.substring(0, 5)}</Text>
                    </View>
                    <View style={styles.person__balanceContainer}>
                      <Text style={[styles.person__balance, themeStyles.fontColor]}>{item.currentCash} / X</Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 24,
  },
  list: {
    gap: 12,

    paddingVertical: 12,
    marginHorizontal: 32,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',

    borderRadius: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 16,
  },
  listItem: {
    marginHorizontal: 15,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e5e5e5',

    borderRadius: 4,
  },
  exportList: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#6082B6',

    borderRadius: 2,
  },
  person: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,

    position: 'relative',
    zIndex: 100,

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
