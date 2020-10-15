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
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";

import {
 heightPercentageToDP as hp,
 widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default function ShopScreen({ navigation }) {
  const [content, setContent] = useState('Please connect Nfc tag')
  const [connectNfc, setConnectNfc] = useState(true)
  const [conntectStatus, setConnectStatus] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(false)


  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')

  }

  useEffect(() => {
    NfcManager.start();
    return function cleanup() {
      this._cleanUp();
    }
    // this._cleanSuccess(11);

  });

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  buildUrlPayload = (valueToWrite) => {
    return Ndef.encodeMessage([
      Ndef.uriRecord(valueToWrite),
    ]);
  }

  _connectNfctag = async () => {
    try {
      let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to Read your NFC tags!'
      });
      let ndef = await NfcManager.getNdefMessage();
      await NfcManager.setAlertMessageIOS('Welcome to MetaData!')
      let tag = await NfcManager.getTag();
      let nfc_id = Ndef.text.decodePayload(tag.ndefMessage[0].payload)
      if (nfc_id != '') {

        this._cleanSuccess(nfc_id);
        NfcManager.cancelTechnologyRequest().catch(() => 0);
      }
    } catch (ex) {
      this._cleanUp();
    }
  }

  _cleanSuccess = (nfc_id) => {
    let api_url = 'http://249fc3ad6c59.ngrok.io/getMetaMainDataTag/' + nfc_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        let tag_id = responseJson["id"]
        navigation.navigate('Metadata', {
          nfc_id: tag_id
        });
      })
      .catch((response) => alert("There isn't data TagID: " + nfc_id))
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainerLogoutButton}>
        <Text onPress={() => navigation.navigate('Home')} style={styles.backButton} >Back</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image style={{ width: wp('30%'), height: wp('30%') }}
          source={require('../assets/images/logo.png')} />
      </View>
      <TouchableOpacity style={[connectNfc == false ? styles.hiddenVoteButtons : styles.nfctagButton]}
        onPress={() => this._connectNfctag()}
      >
        <Text style={styles.buttonText}>Tap to Scan</Text>
      </TouchableOpacity>
     
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
    justifyContent: 'flex-end',
    alignItems: "center",
    top: '10%'
  },

  button: {
    backgroundColor: '#4d8f64',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10
  },
  nfctagButton: {
    backgroundColor: '#ccc',
    width: wp('60%'),
    borderRadius: wp('1%'),
    marginVertical: hp('30%'),
    paddingVertical: hp('5%'),
  },

  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#7b8d93',
    textAlign: "center",
  },
  showVoteButtons: {
    display: 'flex'
  },
  hiddenVoteButtons: {
    display: 'none'
  },
  textContainer: {
    // width: 300,
    borderWidth: 3,
    color: 'rgba(0, 0, 0, 0.7)',
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  logoContainerLogoutButton: {
    flexDirection: "row",
    width: '100%',
    borderBottomWidth: 1,
    // borderTopWidth: 1,
    borderColor: '#000000',
    padding: 5,
  },
  backButton:  {
    padding: 10,
    marginBottom: 0,
    backgroundColor: '#7b8d93',
    color: '#fff',
    borderRadius: 5,
    justifyContent: "center",
    marginLeft: '5%',

  }
});