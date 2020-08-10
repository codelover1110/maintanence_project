import * as React from 'react';
import { Button, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle, HeaderBackButton } from '@react-navigation/stack';
import { browserHistory } from 'react-router'

import Logroute from '../routes/LogRoute';
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
          name="BACK"
          component={Logroute}
          options={{
            headerShown: false
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
              backgroundColor: '#548235',
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
              backgroundColor: '#548235',
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
              backgroundColor: '#548235',
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
              backgroundColor: '#548235',
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
              backgroundColor: '#548235',
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
              backgroundColor: '#548235',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
