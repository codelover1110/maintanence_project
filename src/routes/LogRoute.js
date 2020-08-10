import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import Login from '../pages/Login';
import Signup from '../pages/Register';


const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Login"
      activeColor="white"
      inactiveColor="#ccc"
      barStyle={{backgroundColor: '#548235'}}
    >
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarLabel: 'LOGIN',
          tabBarIcon: ({ color }) => (
            <Icon name="sign-in" color='#ffffff' size={25} />
          ),
        }}
      />

      <Tab.Screen
        name="Signup"
        component={Signup}
        options={{
          tabBarLabel: 'REGISTER',
          tabBarIcon: ({ color }) => (
            <Icon name="user-plus" color='#ffffff' size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    // <NavigationContainer>
      <MyTabs />
    // </NavigationContainer>
  );
}
