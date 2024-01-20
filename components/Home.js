import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import CustomButton from './CustomButton';

export default function Home({ navigation }) {
  const [list, setList] = useState([
    // 1 - add insufficientMoney prop in case if money < payment after removing money
    // 2 - add permanent prop for all with date of last changing balance. If insufficient Money => add this prop after  payment attempt and remove it
    // only in case of changing person's balance or after confirming the alert message (inside card or alert component)
    {
      name: 'Вова',
      currentCash: 20,
      insufficientMoney: false,
      id: 'jdsa',
    },
    {
      name: 'Роман',
      currentCash: 15,
      insufficientMoney: false,
      id: 'asdasdsa',
    },
    {
      name: 'Андрій',
      currentCash: 18,
      insufficientMoney: false,
      id: 'd123dasasdsa',
    },
  ]);
  const [editing, setEditing] = useState(false);
  // should be replaced by settings obj or something in future
  const [paymentAmount, setPaymentAmount] = useState(18);

  return (
    <View style={styles.content}>
      <View style={styles.tools}>
        <Text style={styles.tools__title}>Change all balances in one click</Text>
        <View style={styles.tools__buttons}>
          <CustomButton
            style={[styles.tools__button, styles.tools__addPaymentForEach]}
            textStyle={styles.tools__buttonText}
            handler={() => {
              //
            }}
          >
            Add <Text>{paymentAmount}</Text>
          </CustomButton>
          <CustomButton
            style={[styles.tools__button, styles.tools__removePaymentFromEach]}
            textStyle={styles.tools__buttonText}
            handler={() => {}}
          >
            Withdraw <Text>{paymentAmount}</Text>
          </CustomButton>
          {/* <CustomButton
          style={styles.tools__edit}
          
        >
          {editing ? 'finish edit' : 'edit'}
        </CustomButton> */}
        </View>
      </View>
      <View style={styles.peopleList}>
        <FlatList
          data={list}
          renderItem={({ item }) => {
            return (
              <Shadow stretch={true} style={styles.person} containerStyle={{ marginHorizontal: 8 }} distance={5} offset={[2, 10]}>
                <View style={styles.person__name}>
                  <Text>{item.name}</Text>
                </View>
                <View>
                  <Text style={styles.person__balance}>
                    {item.currentCash}/{paymentAmount}
                  </Text>
                </View>
              </Shadow>
            );
          }}
          keyExtractor={(person) => person.id}
        />
      </View>
    </View>
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

    marginVertical: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',

    borderRadius: 8,
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
    flexDirection: 'row',
    gap: 16,
  },
  tools__button: {
    flex: 1,

    paddingVertical: 8,
    paddingHorizontal: 4,

    borderRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  tools__addPaymentForEach: {
    backgroundColor: '#2AAA8A',
  },
  tools__removePaymentFromEach: {
    backgroundColor: '#DE3163',
  },
  tools__buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
