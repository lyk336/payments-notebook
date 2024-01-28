import 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Home from './components/Home';
import Settings from './components/Settings';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

const statusBarHeight = StatusBar.currentHeight;

const Drawer = createDrawerNavigator();

const DrawerSection = ({ title }) => {
  return (
    <View style={styles.drawerSection}>
      <Text style={styles.drawerSection__title}>{title}</Text>
      <View style={styles.drawerSection__separateLine}></View>
    </View>
  );
};
DrawerSection.propTypes = {
  title: PropTypes.string.isRequired,
};

const DrawerComponents = ({ currentScreen, navigation }) => {
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!editing);
    navigation.closeDrawer();
  };
  useEffect(() => {
    // clean previous events to avoid double function calls
    EventRegister.removeEventListener(titleChangeEvent);
    // handle drawer menu's button
    const titleChangeEvent = EventRegister.addEventListener('toggleEditTitle', toggleEdit);
  }, [toggleEdit]);

  switch (currentScreen) {
    case 'Home':
      return (
        <>
          <DrawerSection title='Tools' />
          <DrawerItem
            label={editing ? 'Finish editing' : 'Edit list'}
            onPress={() => {
              EventRegister.emit('toggleEdit');
              EventRegister.emit('toggleEditTitle');
            }}
          />
        </>
      );

    default:
      return <></>;
  }
};
DrawerComponents.propTypes = {
  currentScreen: PropTypes.string.isRequired,
  navigation: PropTypes.object,
};

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const [currentScreen, setCurrentScreen] = useState('Home');

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        setCurrentScreen(navigationRef.getCurrentRoute().name);
      }}
    >
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'right',
          drawerStyle: {
            width: 250,
            minWidth: '25%',
          },
          header: ({ navigation, route }) => {
            return (
              <View style={styles.header}>
                {route.name !== 'Home' && (
                  <Pressable style={styles.header__back} onPress={() => navigation.goBack()}>
                    <View>
                      <MaterialIcons name='arrow-back' size={28} color='black' />
                    </View>
                    <Text style={styles.header__backText}>Back</Text>
                  </Pressable>
                )}
                <Text style={styles.header__title}>{currentScreen}</Text>
                <Pressable style={styles.header__menu} onPress={() => navigation.openDrawer()}>
                  <View style={styles.header__icon}>
                    <Feather name='menu' size={28} color='black' />
                  </View>
                </Pressable>
              </View>
            );
          },
        }}
        initialRouteName='Home'
        drawerContent={(props) => (
          <DrawerContentScrollView>
            <DrawerSection title='Screens' />
            <DrawerItemList {...props} />
            <DrawerComponents currentScreen={currentScreen} navigation={props.navigation} />
          </DrawerContentScrollView>
        )}
      >
        <Drawer.Screen name='Home' component={Home} initialParams={{ editing: false }} />
        <Drawer.Screen name='Settings' component={Settings} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  drawerSection__title: {
    marginBottom: 4,

    fontSize: 16,
    color: '#a9a9a9',
  },
  drawerSection__separateLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#eee',
  },

  // header
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',

    height: 48 + statusBarHeight,
    width: '100%',
    paddingTop: statusBarHeight,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header__title: {
    marginRight: 16,

    fontSize: 20,
    fontWeight: '500',
  },
  header__menu: {
    padding: 12,
    paddingLeft: 16,
    marginTop: -12,
    marginRight: -12,
  },
  header__icon: {
    paddingTop: 6,
    marginBottom: -6,
  },
  header__back: {
    marginRight: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header__backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default App;
