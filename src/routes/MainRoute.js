import * as React from 'react';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle, HeaderBackButton } from '@react-navigation/stack';
import { browserHistory } from 'react-router'
import Login from '../pages/Login';
import PasswordReset from '../pages/PasswordReset';
import ActivityLog from '../pages/ActivityLog';



import Nfctag from '../pages/Nfctag';
import Home from '../pages/Home';
import Metadata from '../pages/Metadata';
import Consumption from '../pages/Consumption';
import SuccessPage from '../pages/SuccessPage';
import Location from '../pages/Location';
import Consumptionlocation from '../pages/Consumptionlocation';
import Tags from '../pages/Tags';




const Stack = createStackNavigator();




function App() {
  const handleLogout = (navigation) => {
    navigation.Screen('BACK')

  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogOut">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="PasswordReset"
          component={PasswordReset}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ActivityLog"
          component={ActivityLog}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
              // shadowColor: 'transparent'
            },
            headerLeft: null
          }}
        />
        <Stack.Screen
          name="Nfctag"
          component={Nfctag}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}

          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Metadata"
          component={Metadata}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
              // shadowColor: 'transparent'
            },
            headerLeft: null
          }}
        />
        <Stack.Screen
          name="Consumption"
          component={Consumption}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
              // shadowColor: 'transparent'
            },
          }}
        />
        <Stack.Screen
          name="SuccessPage"
          component={SuccessPage}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
              // shadowColor: 'transparent'
            },
          }}
        />
        <Stack.Screen
          name="Location"
          component={Location}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
            },
            headerLeft: null
          }}
        />
        <Stack.Screen
          name="Consumptionlocation"
          component={Consumptionlocation}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
            },
            headerLeft: null
          }}
        />
        <Stack.Screen
          name="Tags"
          component={Tags}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#4d8f64',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
