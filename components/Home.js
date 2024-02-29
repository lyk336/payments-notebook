import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import CustomButton from './CustomButton';
import { EventRegister } from 'react-native-event-listeners';
import AddPersonModal from './AddPersonModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChangeBalanceInput from './ChangeBalanceInput';
import lodash from 'lodash';
import SortMethodPicker from './SortMethodPicker';
import useThemeColors from '../hooks/useThemeColors';
import { getPrice } from '../utils/operatePrice';
import { storeList, getList } from '../utils/operateList';
import { storeSavedLists } from '../utils/operateHistoryOfChanges';
import PriceGroupPicker from './PriceGroupPicker';
import { getPriceMode } from '../utils/operatePriceMode';
import { getPriceGroupsList } from '../utils/operatePriceGroupsList';

const getCurrrentTime = () => {
  const date = new Date();
  // make all date values to display with 0 at the beginning
  const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 9 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 9 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds = date.getSeconds() < 9 ? `0${date.getSeconds()}` : date.getSeconds();

  return `${day}.${month}.${hours}.${minutes}.${seconds}`;
};

export default function Home({ navigation }) {
  const [list, setList] = useState([]);
  const [defaultPaymentAmount, setDefaultPaymentAmount] = useState(18);
  const [editing, setEditing] = useState(false);
  const [addingPerson, setAddingPerson] = useState(false);
  const [activePerson, setActivePerson] = useState('');
  const [sortMethod, setSortMethod] = useState('byAlphabet');
  const [timeoutId, setTimeoutId] = useState('');
  const { themeStyles, appTheme } = useThemeColors();
  const [priceMode, setPriceMode] = useState('Single price');
  const [priceGroupsList, setPriceGroupsList] = useState([]);

  const saveListToStorage = (list) => {
    clearTimeout(timeoutId);
    setTimeoutId(
      setTimeout(() => {
        storeSavedLists(list, sortList);
      }, 10000)
    );
  };
  const changeListEverywhere = (list) => {
    setList(list);
    storeList(list, sortList);
    saveListToStorage(list);
  };

  const createAlert = (peopleList, listToUpdate) => {
    const alertText = `Some people don't have enough money : ${peopleList}`;

    Alert.alert(
      'Not enough money!',
      alertText,
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Withdraw where possible',
          onPress: () => {
            changeListEverywhere(listToUpdate);
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  // get data from async storage when app loads
  useEffect(() => {
    getPrice(setDefaultPaymentAmount);
    getList(setList);
    getPriceMode(setPriceMode);
    getPriceGroupsList(setPriceGroupsList);
  }, []);

  // add event listeners
  const toggleEdit = () => {
    setEditing(!editing);
    setAddingPerson(false);
    navigation.closeDrawer();
  };
  const changeDefaultPricePerPayment = () => {
    getPrice(setDefaultPaymentAmount);
  };
  const importList = (importedList) => {
    setList(importedList);
    storeList(importedList, sortList);
  };
  useEffect(() => {
    // clean previous events to avoid double function calls
    EventRegister.removeEventListener(toggleEditEvent);
    // handle drawer menu's button
    const toggleEditEvent = EventRegister.addEventListener('toggleEdit', toggleEdit);
  }, [toggleEdit]);
  useEffect(() => {
    EventRegister.removeEventListener(priceChangeEvent);
    const priceChangeEvent = EventRegister.addEventListener('priceChange', changeDefaultPricePerPayment);
  }, [changeDefaultPricePerPayment]);
  useEffect(() => {
    EventRegister.removeEventListener(importListEvent);
    const importListEvent = EventRegister.addEventListener('importList', (importedList) => {
      importList(importedList);
    });
  }, [importList]);
  useEffect(() => {
    EventRegister.removeEventListener(priceGroupsListChangeEvent);
    const priceGroupsListChangeEvent = EventRegister.addEventListener('groupsListChange', (list) => {
      setPriceGroupsList(list);
    });
  }, []);
  useEffect(() => {
    EventRegister.removeEventListener(priceModeChangeEvent);
    const priceModeChangeEvent = EventRegister.addEventListener('priceModeChange', (mode) => {
      setPriceMode(mode);
    });
  }, []);

  const sortList = {
    compare(firstItem, secondItem) {
      if (firstItem < secondItem) {
        return -1;
      } else if (firstItem > secondItem) {
        return 1;
      } else {
        return 0;
      }
    },
    sortByAlphabet(listClone) {
      listClone.sort((a, b) => {
        const firstName = a.name.toLowerCase();
        const secondName = b.name.toLowerCase();

        return this.compare(firstName, secondName);
      });
    },
    sortByPair(listClone) {
      if (sortMethod !== 'byAlphabet') {
        this.sortByAlphabet(listClone);
      }
      let groupedPairs = [];
      for (let i = 0; i < listClone.length; i++) {
        let didFind;
        for (let j = 0; j < listClone.length; j++) {
          if (listClone[i].pairId === listClone[j].pairId && i !== j) {
            groupedPairs.push(listClone[i]);
            groupedPairs.push(listClone[j]);
            listClone.splice(j, 1);
            // continue looping in case of user for some reason added more than 2 people with the same pairIds
            --j;
            didFind = true;
          }
        }
        if (didFind) {
          listClone.splice(i, 1);
          --i;
        }
      }

      listClone = groupedPairs.concat(listClone);
      return listClone;
    },
    sortByMoney(listClone) {
      listClone.sort((a, b) => {
        const firstNumber = b.currentCash;
        const secondNumber = a.currentCash;

        return this.compare(firstNumber, secondNumber);
      });
    },
    sortByUpdate(listClone) {
      listClone.sort((a, b) => {
        const firstDate = parseInt(b.lastUpdate.replaceAll('.', ''));
        const secondDate = parseInt(a.lastUpdate.replaceAll('.', ''));

        return this.compare(firstDate, secondDate);
      });
    },
    sortByPriceGroups(listClone) {
      if (sortMethod !== 'byAlphabet') {
        this.sortByAlphabet(listClone);
      }
      let groupsInRow = [];
      for (let i = 0; i < priceGroupsList.length; i++) {
        for (let j = 0; j < listClone.length; j++) {
          if (listClone[j].priceGroup === priceGroupsList[i].groupName) {
            groupsInRow.push(listClone[j]);
            listClone.splice(j, 1);
            --j;
          }
        }
      }

      listClone = groupsInRow.concat(listClone);
      return listClone;
    },
    sort() {
      let listClone = lodash.cloneDeep(list);

      switch (sortMethod) {
        case 'byAlphabet':
          this.sortByAlphabet(listClone);
          break;
        case 'byPair':
          // for some reason listClone doen't update outside of this method, so I decided to do this:
          listClone = this.sortByPair(listClone);
          break;
        case 'byPriceGroups':
          listClone = this.sortByPriceGroups(listClone);
          break;
        case 'byMoney':
          this.sortByMoney(listClone);
          break;
        case 'byUpdate':
          this.sortByUpdate(listClone);
          break;
      }

      setList(listClone);
    },
  };

  useEffect(() => {
    sortList.sort();
  }, [sortMethod]);

  // when any price changes => reinspect all list items for insufficient money
  useEffect(() => {
    if (!list || list.length === 0) return;
    const listClone = lodash.cloneDeep(list);
    listClone.forEach((person) => {
      person.currentCash < getPaymentAmmount(person.priceGroup)
        ? (person.insufficientMoney = true)
        : (person.insufficientMoney = false);
    });
    setList(listClone);
  }, [defaultPaymentAmount, priceMode, priceGroupsList]);

  const handleAddPerson = (person) => {
    const date = new Date();

    person.currentCash = 0;
    person.insufficientMoney = true;
    person.id = `${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}${Math.round(
      Math.random() * 1000
    )}`;
    person.lastUpdate = getCurrrentTime();
    person.priceGroup = 'default';

    changeListEverywhere([person, ...list]);

    setAddingPerson(false);
  };

  const getPaymentAmmount = (groupName, useDefaultPrice) => {
    if (priceMode === 'Single price' || useDefaultPrice) {
      return defaultPaymentAmount;
    } else {
      const groupIndex = priceGroupsList.findIndex((group) => group.groupName === groupName);
      if (groupIndex === -1) {
        if (groupName !== 'default') groupName = 'default';
        return getPaymentAmmount(null, true);
      }
      return +priceGroupsList[groupIndex].price;
    }
  };

  const handleSubmitBalanceChange = (balance, id) => {
    if (balance < 0) {
      return;
    }

    const listClone = lodash.cloneDeep(list);
    listClone.forEach((person) => {
      if (person.id === id) {
        person.currentCash = +balance;
        person.currentCash < getPaymentAmmount(person.priceGroup)
          ? (person.insufficientMoney = true)
          : (person.insufficientMoney = false);
        person.lastUpdate = getCurrrentTime();
      }
    });

    changeListEverywhere(listClone);
  };

  const handleChangeBalance = (operation, id) => {
    const listClone = lodash.cloneDeep(list);
    const lessMoneyPeople = [];

    switch (operation) {
      case '+':
        if (!id) {
          // case when button changes all balances
          listClone.forEach((person) => {
            person.currentCash += getPaymentAmmount(person.priceGroup);
            person.lastUpdate = getCurrrentTime();
          });
          if (activePerson) {
            setActivePerson('');
          }
        } else {
          // case when button changes single balance
          listClone.forEach((person) => {
            if (person.id === id) {
              person.currentCash += getPaymentAmmount(person.priceGroup);
              person.lastUpdate = getCurrrentTime();
            }
          });
        }
        break;

      case '-':
        if (!id) {
          listClone.forEach((person) => {
            const paymentAmmount = getPaymentAmmount(person.priceGroup);
            if (person.currentCash >= paymentAmmount) {
              person.currentCash -= paymentAmmount;
              person.lastUpdate = getCurrrentTime();
            } else {
              lessMoneyPeople.push(person.name);
            }
          });
          if (activePerson) {
            setActivePerson('');
          }
        } else {
          listClone.forEach((person) => {
            const paymentAmmount = getPaymentAmmount(person.priceGroup);
            if (person.id === id && person.currentCash >= paymentAmmount) {
              person.currentCash -= paymentAmmount;
              person.lastUpdate = getCurrrentTime();
            }
          });
        }
        break;
    }

    listClone.forEach((person) => {
      person.currentCash < getPaymentAmmount(person.priceGroup)
        ? (person.insufficientMoney = true)
        : (person.insufficientMoney = false);
    });

    if (lessMoneyPeople.length) {
      let peopleListForMessage = '';
      lessMoneyPeople.forEach((person) => {
        peopleListForMessage += `${person} \n`;
      });

      createAlert(peopleListForMessage, listClone);
    } else {
      changeListEverywhere(listClone);
    }
  };

  const handleSortChange = (value) => {
    setSortMethod(value);
  };

  const handleGroupChange = (value, personId) => {
    const listClone = lodash.cloneDeep(list);

    const personIndex = listClone.findIndex((person) => person.id === personId);
    listClone[personIndex].priceGroup = value;
    setList(listClone);
  };

  // sort list after new item added or already existing item was updated
  useEffect(() => {
    if (!addingPerson) {
      sortList.sort();
    }
  }, [addingPerson]);
  useEffect(() => {
    if (!activePerson) {
      sortList.sort();
    }
  }, [activePerson]);

  return (
    <Pressable
      style={[styles.content, themeStyles.background]}
      onPress={() => {
        activePerson && setActivePerson('');
      }}
    >
      <View style={[styles.tools, themeStyles.background]}>
        {editing ? (
          <Text style={[styles.tools__title, themeStyles.fontColor]}>Editing</Text>
        ) : (
          <Text style={[styles.tools__title, themeStyles.fontColor]}>
            Change all balances in one click{' '}
            <Text style={{ color: appTheme === 'light' ? '#0006' : '#fff6' }}>(current mode: {priceMode})</Text>
          </Text>
        )}
        <View style={[styles.tools__buttons, { flexDirection: editing ? 'column' : 'row' }]}>
          {editing ? (
            <>
              <CustomButton
                style={[styles.button, styles.tools__addPerson]}
                textStyle={styles.buttonText}
                handler={() => {
                  setAddingPerson(true);
                }}
              >
                Add person to the list
              </CustomButton>
              <CustomButton
                style={[styles.button, styles.tools__finishEditing]}
                textStyle={styles.buttonText}
                handler={() => {
                  EventRegister.emit('toggleEdit');
                  EventRegister.emit('toggleEditTitle');
                }}
              >
                Finish editing
              </CustomButton>

              <AddPersonModal
                modalVisible={addingPerson}
                closeModal={() => {
                  setAddingPerson(false);
                }}
                handleAddPerson={handleAddPerson}
                inputStyle={themeStyles.fontColor}
              />
            </>
          ) : (
            <>
              <CustomButton
                style={[styles.button, styles.tools__addPaymentForEach]}
                textStyle={styles.buttonText}
                handler={() => {
                  handleChangeBalance('+');
                }}
              >
                Add {priceMode === 'Single price' && <Text>{defaultPaymentAmount}</Text>}
              </CustomButton>
              <CustomButton
                style={[styles.button, styles.tools__withdrawPaymentFromEach]}
                textStyle={styles.buttonText}
                handler={() => {
                  handleChangeBalance('-');
                }}
              >
                Withdraw {priceMode === 'Single price' && <Text>{defaultPaymentAmount}</Text>}
              </CustomButton>
            </>
          )}
        </View>
        <SortMethodPicker value={sortMethod} handleSortChange={handleSortChange} />
      </View>
      {/* List */}
      <ScrollView style={[styles.peopleList, themeStyles.background]}>
        {list.map((item) => {
          const paymentAmmount = getPaymentAmmount(item.priceGroup);
          return (
            <View key={item.id}>
              <Pressable
                onPress={() => {
                  if (activePerson === item.id) {
                    setActivePerson('');
                    return;
                  }
                  setActivePerson(item.id);
                }}
              >
                <Shadow
                  style={[styles.person, themeStyles.background]}
                  stretch={true}
                  containerStyle={{ marginHorizontal: 8 }}
                  distance={5}
                  offset={[0, 10]}
                >
                  <View>
                    <Text style={themeStyles.fontColor}>{item.name}</Text>
                  </View>
                  <View>
                    <Text style={themeStyles.fontColor}>Updated: {item.lastUpdate.substring(0, 5)}</Text>
                  </View>
                  <View style={styles.person__balanceContainer}>
                    {activePerson === item.id ? (
                      <>
                        <ChangeBalanceInput
                          balance={item.currentCash}
                          handleSubmit={handleSubmitBalanceChange}
                          id={item.id}
                          insufficientMoney={item.insufficientMoney}
                        />
                        <Text style={styles.person__balance}>
                          <Text style={themeStyles.fontColor}>/ {paymentAmmount}</Text>
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text
                          style={[styles.person__balance, { color: item.insufficientMoney ? '#DE3163' : '#2AAA8A' }]}
                        >
                          {item.currentCash}
                          <Text style={themeStyles.fontColor}>/ {paymentAmmount}</Text>
                        </Text>
                      </>
                    )}
                  </View>
                  {editing && (
                    <Pressable
                      style={styles.person__delete}
                      onPress={() => {
                        const updatedList = list.filter((person) => item.id !== person.id);
                        changeListEverywhere(updatedList);
                      }}
                    >
                      <MaterialCommunityIcons name='delete-forever' size={24} color='#DE3163' />
                    </Pressable>
                  )}
                </Shadow>
              </Pressable>
              {activePerson === item.id && (
                <View style={styles.redactPerson}>
                  <View style={[styles.redactPerson__container, themeStyles.background]}>
                    <View style={styles.redactPerson__buttons}>
                      <CustomButton
                        style={[styles.button, styles.redactPerson__addPayment]}
                        textStyle={styles.buttonText}
                        handler={() => {
                          handleChangeBalance('+', item.id);
                        }}
                      >
                        Add <Text>{paymentAmmount}</Text>
                      </CustomButton>
                      <CustomButton
                        style={[styles.button, styles.redactPerson__withdrawPayment]}
                        textStyle={styles.buttonText}
                        handler={() => {
                          handleChangeBalance('-', item.id);
                        }}
                      >
                        Withdraw <Text>{paymentAmmount}</Text>
                      </CustomButton>
                    </View>
                    <View>
                      <View style={styles.redactPerson__priceGroup}>
                        <Text style={themeStyles.fontColor}>Price group:</Text>
                        <PriceGroupPicker
                          value={item.priceGroup}
                          personId={item.id}
                          handleGroupChange={handleGroupChange}
                          priceGroupesList={priceGroupsList}
                        />
                      </View>
                      <Text style={[styles.redactPerson__pairId, themeStyles.fontColor]}>Pair id: {item.pairId}</Text>
                      <Text style={styles.redactPerson__tip}>
                        To change balance by custom value, click on the balance.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,

    paddingTop: 12,
    backgroundColor: '#f6f7f8',
  },

  // list styling
  peopleList: {
    flex: 1,

    paddingHorizontal: 8,
    backgroundColor: '#f6f7f8',
  },
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
  // popout for list items
  redactPerson: {
    minHeight: 244,
    marginHorizontal: 8,
  },
  redactPerson__container: {
    position: 'absolute',
    zIndex: -1,
    top: -20,

    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    minHeight: 100,
    width: '100%',
    borderColor: '#e5e5e5',
    borderStyle: 'solid',
    borderWidth: 1,

    borderRadius: 8,
  },
  redactPerson__buttons: {
    flexDirection: 'row',
    gap: 16,

    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
  },
  redactPerson__addPayment: {
    paddingVertical: 6,
    backgroundColor: '#2AAA8A',
  },
  redactPerson__withdrawPayment: {
    paddingVertical: 6,
    backgroundColor: '#DE3163',
  },
  redactPerson__priceGroup: {
    marginBottom: 8,
  },
  redactPerson__tip: {
    color: '#a3a3a3',
  },
  redactPerson__pairId: {
    marginBottom: 4,
  },
  person__balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // tool bar styling
  tools: {
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#f6f7f8',
  },
  tools__title: {
    marginBottom: 16,

    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
  tools__buttons: {
    gap: 16,
  },
  button: {
    flex: 1,
    alignSelf: 'center',

    paddingVertical: 8,
    paddingHorizontal: 4,

    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  tools__addPaymentForEach: {
    backgroundColor: '#2AAA8A',
  },
  tools__withdrawPaymentFromEach: {
    backgroundColor: '#DE3163',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  // edit buttons
  tolls__editButtons: {
    flexDirection: 'column',
    alignContent: 'center',
  },
  tools__addPerson: {
    flex: 0,

    minWidth: '80%',
    backgroundColor: '#2AAA8A',
  },
  tools__finishEditing: {
    flex: 0,

    minWidth: '80%',
    backgroundColor: '#DE3163',
  },
  person__delete: {
    marginLeft: '-10%',
    marginRight: -8,
  },
});
