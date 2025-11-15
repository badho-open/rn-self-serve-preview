import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import HomeScreen from '../screens/home';
import PreviewsScreen from '../screens/previews';

const Drawer = createDrawerNavigator();

function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={({navigation}) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}>
              <MaterialIcons name="menu" size={28} color="#000" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
        })}>
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Home'}}
        />
        <Drawer.Screen
          name="Previews"
          component={PreviewsScreen}
          options={{title: 'Previews'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    padding: 8,
  },
});

export default AppNavigator;

