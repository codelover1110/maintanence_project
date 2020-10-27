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
import SelectInput from 'react-native-select-input-ios';
import {
 heightPercentageToDP as hp,
 widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default function Consumption({ route, navigation }) {


  const [lastDate, setLastDate] = useState()
  const [newDate, setNewDate] = useState()
  const [nfcID, setNfcID] = useState()
  const [inputText, setInputText] = useState('')
  const [lastValue, setLastValue] = useState()
  const [nfcTAG, setNfcTAG] = useState()
  const [selectOption, setSelectOption] = useState('')
  const [remarks, setRemarks] = useState([])
  const [currentID, setCurrentID] = useState('')

  useEffect(() => {
    const { nfc_id } = route.params;
    const { nfc_tag } = route.params;
    setNfcTAG(nfc_tag)
    setNfcID(nfc_id)
    getMetaData(nfc_id);
    getRemarks();
    AsyncStorage.getItem('customerID').then(value => {
      setCurrentID(value)
    });
  });

  getMetaData = (tag_id) => {
    let api_url = 'http://62e3972fd691.ngrok.io/editConsumptionmobile/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson["success"] == "false") {
          setLastDate("There is no data")
        } else {
          consumption = (JSON.parse(responseJson))
          latestDate = consumption[0]["fields"]["reading_date"].replace("T", " ").replace("Z", "")
          setLastDate(latestDate)
          setLastValue(consumption[0]["fields"]["new_value"])
        }
      })
  }

  getRemarks = () => {
    let api_url = 'http://62e3972fd691.ngrok.io/getRemarks/';
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        const selectOptions1 = []
        responseJson.forEach(element => {
          selectOptions1.push({ value: element.value, label: element.value })
        });
        setRemarks(selectOptions1)
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
    if (selectOption == '') {
      alert("Note is required ")
    }

    if (inputText != '' && ((inputText.split(",")).length < 3  && (inputText.split(",")[0] != '') )) {
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
      alert("Invalid Value. Try again!")
    }

  }

  _upDateConsumptionData = () => {
    let formData = new FormData();
    formData.append("tagID", nfcID)
    formData.append("new_value", inputText)
    formData.append("remark", selectOption)
    formData.append("read_by", currentID)

    fetch('http://62e3972fd691.ngrok.io/manageConsumptionData/', {
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

  _changConsumpData = (inputText) => {
    console.log(inputText.includes(','))
    console.log((inputText.split(","))[1])
    if (inputText.split(",")[1] == '') {
      setInputText(inputText + '0');
    } else {
      setInputText(inputText);
    }
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
      keyboardVerticalOffset="100"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}> TagID:  </Text>
            <Text style={styles.headerTextXY}>{nfcID}</Text>
          </View>
          <Image style={{ width: wp('7%'), height: wp('7%'), marginLeft: wp('5%'), marginBottom: wp('7%') }}
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
                onChangeText={(text) => { _changConsumpData(text) }}
                defaultValue={newDate}
                editable={true}
                multiline={false}
                maxLength={200}
                keyboardType={"numeric"}
              />
            </View>
          </View>
          <View style={styles.item} >
            <View style={styles.marginLeft}>
              <View style={styles.itemTitle}>
                <Text style={styles.itemTitleText}>Note</Text>
              </View>
            </View>
            <View style={styles.itemContent}>
              <SelectInput
                value={selectOption}
                options={remarks}
                onSubmitEditing={(value) => setSelectOption(value)}
                style={styles.selectInput}
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
    height: hp('10%'),
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4d8f64',
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
    fontSize: wp('10%'),
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextXY: {
    fontSize: wp('9%'),
    color: '#000000',
  },
  container: {
    backgroundColor: '#4d8f64',
    padding: 5,
    height: '100%'
  },
  contentContainer: {
    height: '75%'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#4d8f64',
    alignItems: 'center',
  },
  marginLeft: {
    marginLeft: 5,
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
    height: hp('7%'),
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
    backgroundColor: '#4d8f64',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: '10%'
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
    width: wp('25%'),
    height: hp('10%'),
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
    marginTop: 5
  },
  selectInput: {
    flexDirection: 'row',
    height: 40,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
})

