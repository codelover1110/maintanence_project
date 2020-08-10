import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar
} from 'react-native';

import Routes from './src/routes/MainRoute';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#1c313a"
        barStyle="light-content"
      />
      <Routes />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});