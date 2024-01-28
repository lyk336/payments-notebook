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
  const [list, setList] = useState([
    {
      name: 'Вова',
      currentCash: 20,
      lastUpdate: '21.09',
      insufficientMoney: false,
      pairId: '123',
      id: 'jdsa',
    },
    {
      name: 'Роман',
      currentCash: 15,
      lastUpdate: '21.09',
      insufficientMoney: true,
      pairId: 'sdajkl',
      id: 'asdasdsa',
    },
    {
      name: 'Withpair 3',
      currentCash: 18,
      lastUpdate: '21.09',
      insufficientMoney: false,
      pairId: '3',
      id: 'd3dasa321sa',
    },
    {
      name: 'Андрій',
      currentCash: 18,
      lastUpdate: '21.09',
      insufficientMoney: false,
      pairId: '123',
      id: 'd123dasasdsa',
    },
    {
      name: 'pair 1',
      currentCash: 30,
      lastUpdate: '21.09',
      insufficientMoney: false,
      pairId: '1',
      id: 'jdsdsaa',
    },
    {
      name: 'pair 2',
      currentCash: 15,
      lastUpdate: '21.09',
      insufficientMoney: true,
      pairId: '2',
      id: '2',
    },
    {
      name: 'pair 3',
      currentCash: 18,
      lastUpdate: '21.09',
      insufficientMoney: false,
      pairId: '3',
      id: 'd3dasasa',
    },
    {
      name: 'Withpair 1',
      currentCash: 30,
      lastUpdate: '21.09',
      insufficientMoney: false,
      pairId: '1',
      id: 'jds123dsaa',
    },
    {
      name: 'Withpair 2',
      currentCash: 15,
      lastUpdate: '21.09',
      insufficientMoney: true,
      pairId: '2',
      id: '2123',
    },
  ]);
  // should be replaced by settings obj or something in future
  const [paymentAmount, setPaymentAmount] = useState(18);
  // ---------------------------------------------------------
  const [editing, setEditing] = useState(false);
  const [addingPerson, setAddingPerson] = useState(false);
  const [activePerson, setActivePerson] = useState('');
  const [sortMethod, setSortMethod] = useState('byAlphabet');

  const createAlert = (peopleList, listToUpdate) => {
    const alertText = `Some people don't have enough money : ${peopleList}`;
    const handleWithdraw = () => {
      setList(listToUpdate);
    };

    Alert.alert('Not enough money!', alertText, [
      {
        text: 'Cancel',
      },
      {
        text: 'Withdraw where possible',
        onPress: () => {
          handleWithdraw();
        },
      },
    ]);
  };

  const toggleEdit = () => {
    setEditing(!editing);
    setAddingPerson(false);
    navigation.closeDrawer();
  };

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

  useEffect(() => {
    // clean previous events to avoid double function calls
    EventRegister.removeEventListener(toggleEditEvent);
    // handle drawer menu's button
    const toggleEditEvent = EventRegister.addEventListener('toggleEdit', toggleEdit);
  }, [toggleEdit]);

  const handleAddPerson = (person) => {
    const date = new Date();

    person.currentCash = 0;
    person.insufficientMoney = true;
    person.id = `${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}${Math.round(Math.random() * 1000)}`;
    person.lastUpdate = getCurrrentTime();

    setList([person, ...list]);
    setAddingPerson(false);
  };

  const handleSubmitBalanceChange = (balance, id) => {
    if (balance < 0) {
      return;
    }

    const listClone = lodash.cloneDeep(list);
    listClone.forEach((person) => {
      if (person.id === id) {
        person.currentCash = +balance;
        person.currentCash < paymentAmount ? (person.insufficientMoney = true) : (person.insufficientMoney = false);
        person.lastUpdate = getCurrrentTime();
      }
    });

    setList(listClone);
  };

  const handleChangeBalance = (operation, id) => {
    const listClone = lodash.cloneDeep(list);
    const lessMoneyPeople = [];

    switch (operation) {
      case '+':
        if (!id) {
          // case when button changes all balances
          listClone.forEach((person) => {
            person.currentCash += paymentAmount;
            person.lastUpdate = getCurrrentTime();
          });
          if (activePerson) {
            setActivePerson('');
          }
        } else {
          // case when button changes single balance
          listClone.forEach((person) => {
            if (person.id === id) {
              person.currentCash += paymentAmount;
              person.lastUpdate = getCurrrentTime();
            }
          });
        }
        break;

      case '-':
        if (!id) {
          listClone.forEach((person) => {
            if (person.currentCash >= paymentAmount) {
              person.currentCash -= paymentAmount;
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
            if (person.id === id && person.currentCash >= paymentAmount) {
              person.currentCash -= paymentAmount;
              person.lastUpdate = getCurrrentTime();
            }
          });
        }
        break;
    }

    listClone.forEach((person) => {
      person.currentCash < paymentAmount ? (person.insufficientMoney = true) : (person.insufficientMoney = false);
    });

    if (lessMoneyPeople.length) {
      let peopleListForMessage = '';
      lessMoneyPeople.forEach((person) => {
        peopleListForMessage += `${person} \n`;
      });

      createAlert(peopleListForMessage, listClone);
    } else {
      setList(listClone);
    }
  };

  const handleSortChange = (value) => {
    setSortMethod(value);
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
      style={styles.content}
      onPress={() => {
        activePerson && setActivePerson('');
      }}
    >
      <View style={styles.tools}>
        <Text style={styles.tools__title}>{editing ? 'Editing' : 'Change all balances in one click'}</Text>
        <View style={[styles.tools__buttons, { flexDirection: editing ? 'column' : 'row' }]}>
          {!editing && (
            <>
              <CustomButton
                style={[styles.button, styles.tools__addPaymentForEach]}
                textStyle={styles.buttonText}
                handler={() => {
                  handleChangeBalance('+');
                }}
              >
                Add <Text>{paymentAmount}</Text>
              </CustomButton>
              <CustomButton
                style={[styles.button, styles.tools__withdrawPaymentFromEach]}
                textStyle={styles.buttonText}
                handler={() => {
                  handleChangeBalance('-');
                }}
              >
                Withdraw <Text>{paymentAmount}</Text>
              </CustomButton>
            </>
          )}
          {editing && (
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
              />
            </>
          )}
        </View>
        <SortMethodPicker value={sortMethod} handleSortChange={handleSortChange} />
      </View>
      {/* List */}
      <ScrollView style={styles.peopleList}>
        {list.map((item) => (
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
              <Shadow style={styles.person} stretch={true} containerStyle={{ marginHorizontal: 8 }} distance={5} offset={[0, 10]}>
                <View style={styles.person__name}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.person__lastUpdate}>
                  <Text>Updated: {item.lastUpdate.substring(0, 5)}</Text>
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
                      <Text style={styles.person__balance}>/ {paymentAmount}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.person__balance, { color: item.insufficientMoney ? '#DE3163' : '#2AAA8A' }]}>
                        {item.currentCash} <Text style={{ color: '#141823' }}>/ {paymentAmount}</Text>
                      </Text>
                    </>
                  )}
                </View>
                {editing && (
                  <Pressable
                    style={styles.person__delete}
                    onPress={() => {
                      setList(list.filter((person) => item.id !== person.id));
                    }}
                  >
                    <MaterialCommunityIcons name='delete-forever' size={24} color='#DE3163' />
                  </Pressable>
                )}
              </Shadow>
            </Pressable>
            {activePerson === item.id && (
              <View style={styles.redactPerson}>
                <View style={styles.redactPerson__container}>
                  <View style={styles.redactPerson__buttons}>
                    <CustomButton
                      style={[styles.button, styles.redactPerson__addPayment]}
                      textStyle={styles.buttonText}
                      handler={() => {
                        handleChangeBalance('+', item.id);
                      }}
                    >
                      Add <Text>{paymentAmount}</Text>
                    </CustomButton>
                    <CustomButton
                      style={[styles.button, styles.redactPerson__withdrawPayment]}
                      textStyle={styles.buttonText}
                      handler={() => {
                        handleChangeBalance('-', item.id);
                      }}
                    >
                      Withdraw <Text>{paymentAmount}</Text>
                    </CustomButton>
                  </View>
                  <View>
                    <Text style={styles.redactPerson__tip}>To change balance by custom value, click on the balance.</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
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
    minHeight: 116,
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
  redactPerson__tip: {
    color: '#a3a3a3',
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
