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
  Button,
  FlatList,
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView,
  SafeAreaView

} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";


export default function Consumption({ route, navigation }) {


  const [lastDate, setLastDate] = useState()
  const [newDate, setNewDate] = useState()
  const [nfcID, setNfcID] = useState()
  const [inputText, setInputText] = useState('')
  const [lastValue, setLastValue] = useState()
  const [nfcTAG, setNfcTAG] = useState()

  useEffect(() => {
    const { nfc_id } = route.params;
    const { nfc_tag } = route.params;
    setNfcTAG(nfc_tag)
    setNfcID(nfc_id)
    getMetaData(nfc_id);
  });

  getMetaData = (tag_id) => {
    let api_url = 'http://0bd44d9f4578.ngrok.io/editConsumptionmobile/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson["success"] == "false") {
          console.log("failure")
          setLastDate("There is no data")
        } else {
          consumption = (JSON.parse(responseJson))
          latestDate = consumption[0]["fields"]["new_reading_date"].replace("T", " ").replace("Z", "")
          setLastDate(latestDate)
          setLastValue(consumption[0]["fields"]["new_value"])
          console.log(consumption[0]["fields"], "------================")
        }
      })
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image style={styles.logoutButton}
              source={require('../assets/images/logo.png')} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}
              source={require('../assets/images/logo.png')}>Back</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // _handleLogout = () => {
  //   // navigation.navigate('Nfctagaa')
  // }

  _handleConsumptionData = () => {
    if (inputText != '' && ((inputText.split(",")).length < 3 )) {
      let alertData = "Consumption Data"
      Alert.alert(
        'Are you sure to save?',
        alertData,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => _upDateConsumptionData() },
        ],
        { cancelable: false },
      );
    } else {
      alert("Invalided Value. Try again!")
    }

  }

  _upDateConsumptionData = () => {
    let formData = new FormData();
    formData.append("tagID", nfcID)
    formData.append("lastDate", lastDate)
    formData.append("new_value", inputText)


    fetch('http://0bd44d9f4578.ngrok.io/manageConsumptionData/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          navigation.navigate('SuccessPage', { nfc_id: nfcID, nfc_tag: nfcTAG })
        } else {
          alert("update error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  _handleNewDate = () => {
    let currentDate = getCurrentDate()
    setNewDate(currentDate)
  }

  getCurrentDate = () => {
    let date = new Date().getDate(); //Current Date
    let month = new Date().getMonth() + 1; //Current Month
    let year = new Date().getFullYear(); //Current Year
    let hours = new Date().getHours(); //Current Hours
    let min = new Date().getMinutes(); //Current Minutes
    let sec = new Date().getSeconds();
    let currentDate = year + '-' + month + '-' + date + ' ' + hours + ':' + min + ':' + sec
    return currentDate;
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}> TagID:  </Text>
            <Text style={styles.headerTextXY}>{nfcID}</Text>
          </View>
          <Image style={{ width: 40, height: 40, marginLeft: '10%', marginBottom: 20 }}
            source={require('../assets/images/metabrand.png')} />
        </View>

        <View style={styles.modalView}>
          <View style={styles.item} >
            <View style={styles.marginLeft}>
              <View style={styles.itemTitle}>
                <Text style={styles.itemTitleText}>Last</Text>
                <Text style={styles.itemTitleText}>Reading</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <Text>&middot; Data From Meter</Text>
              <Text>&middot; {lastDate}</Text>
              <Text>&middot; {lastValue}</Text>
            </View>
          </View>
          <View style={styles.item} >
            <View style={styles.marginLeft}>
              <View style={styles.itemTitle}>
                <Text style={styles.itemTitleText}>New</Text>
                <Text style={styles.itemTitleText}>Reading</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <TextInput
                onChangeText={(text) => { setInputText(text); console.log('state ', inputText) }}
                defaultValue={newDate}
                editable={true}
                multiline={false}
                maxLength={200}
                keyboardType={"numeric"}
              />
            </View>
          </View>
          <View style={styles.modelButtonContainer}>
            <TouchableOpacity onPress={() => _handleConsumptionData()}>
              <Image style={styles.itemImageStyle}
                source={require('../assets/images/saveButton.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView >
  );

}


const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#548235',
    borderRadius: 15,
    flexDirection: "row"

  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    marginLeft: "20%"

  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextXY: {
    fontSize: 38,
    color: '#000000',
  },
  container: {
    backgroundColor: '#548235',
    padding: 5,
    height: '100%'
  },
  contentContainer: {
    height: '75%'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 5,
  },
  menu: {
    width: 20,
    height: 2,
    backgroundColor: '#111',
    margin: 2,
    borderRadius: 3,
  },
  text: {
    fontSize: 15,

  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold"

  },
  itemContent: {
    width: '55%',
    height: 50,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemTitleText: {
    fontSize: 15,
    color: '#ffffff',
  },

  textInput: {
    width: '90%',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    borderColor: 'gray',
    borderBottomWidth: 2,
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    backgroundColor: '#548235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableHighlight: {
    backgroundColor: 'white',
    marginVertical: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  logoutButton: {
    marginRight: 20,
    padding: 5,
    marginBottom: 0,
    width: 40,
    height: 40
  },
  backButton: {
    marginLeft: 20,
    padding: 10,
    marginBottom: 0,
    borderColor: '#ccc',
    borderWidth: 2,
    color: '#ffffff',
    borderRadius: 10,
    justifyContent: "center",
  },
  itemTitle: {
    borderWidth: 2,
    padding: 10,
    width: 120,
    height: 80,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#5b9bd5',
    alignItems: "center",
    justifyContent: "center",

  },
  logoContainer: {
    marginBottom: '10%',
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  modelButtonContainer: {
    flexDirection: "row",
  },
  itemImageStyle: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 20
  },
})

