import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Button
} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import {
 heightPercentageToDP as hp,
 widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default function Home({ navigation }) {

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('Login')

  }
  _handlegoScan = (route) => {
    navigation.navigate(route)
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainerLogoutButton}>
        <TouchableOpacity onPress={() => { AsyncStorage.removeItem('check_status'); _handleLogout() }} style={styles.backButtonContainer} >
          <Text style={styles.backButton} >Log Out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => _handlegoScan('Nfctag')}>
          <View style={styles.itemTextStyle}>
            <Text style={styles.textStyle}>SCAN</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => _handlegoScan('Location')}>
          <View style={styles.itemTextStyle}>
            <Text style={styles.textStyle}>Equipment Map</Text>
          </View>
        </TouchableOpacity>
      </View>

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d8f64',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    // flexGrow: 1,
    marginTop: hp('4%'),
    justifyContent: 'flex-end',
    alignItems: "center",

  },
  logoContainerLogoutButton: {
    position: "absolute",
    top: hp('4%'),
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  backButton:  {
    padding: 10,
    marginBottom: 0,
    justifyContent: "center",
    borderRadius: 10,
    textAlign: "center",
    color: '#ffffff'

  },
  backButtonContainer: {
    width: '25%',
    borderRadius: 10,
    backgroundColor: '#7b8d93',
  },
  itemImageStyle: {
    width: wp('30%'),
    height: hp('15%'),
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 25,
    backgroundColor: '#ffffff',
    marginBottom: hp('3%')
  },
  itemTextStyle: {
    marginBottom: 20,
    backgroundColor: "#7b8d93",
    borderRadius: 10,
    width: wp('60%'),
    height: hp('10%'),
    alignItems: "center",
    justifyContent: "center"
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.1,
    color: '#fff'
  },


});