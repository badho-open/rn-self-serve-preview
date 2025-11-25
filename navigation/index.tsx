import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import HomeScreen from '../screens/home';
import PreviewsScreen from '../screens/previews';
import {theme} from '../theme';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>SELF SERVE</Text>
        <Text style={styles.drawerSubtitle}>PREVIEW DEMO</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={({navigation}) => ({
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.openDrawer()}>
              <MaterialIcons
                name="menu"
                size={28}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerTitleStyle: {
            fontFamily: theme.typography.fonts.bold,
          },
          drawerStyle: {
            backgroundColor: theme.colors.surface,
            width: 240,
          },
          drawerInactiveTintColor: theme.colors.textSecondary,
          drawerActiveTintColor: theme.colors.primary,
          drawerLabelStyle: {
            fontFamily: theme.typography.fonts.semiBold,
            fontSize: theme.typography.fontSizes.lg,
          },
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
    marginLeft: theme.metrics.spacing.md,
    padding: theme.metrics.spacing.sm,
  },
  drawerHeader: {
    padding: theme.metrics.spacing.lg,
    backgroundColor: theme.colors.primary,
    marginBottom: theme.metrics.spacing.sm,
  },
  drawerTitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes['2xl'],
    fontFamily: theme.typography.fonts.bold,
  },
  drawerSubtitle: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fonts.regular,
    opacity: 0.8,
  },
});

export default AppNavigator;

