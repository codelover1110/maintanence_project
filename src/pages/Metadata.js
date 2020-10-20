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
  Keyboard,
  ScrollView
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from '@react-native-community/geolocation';
import SelectInput from 'react-native-select-input-ios';
import {
 heightPercentageToDP as hp,
 widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default function Metadata({ route, navigation }) {
  const [metaData, setMetaData] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [editedItem, setEditedItem] = useState(0)
  const [itemTitle, setItemTitle] = useState()
  const [rowID, setRowID] = useState()
  const [nfcTagID, setNfcTagID] = useState()
  const [nfcTAG, setNfcTAG] = useState()
  const [equipmentName, setEquipmentName] = useState('')
  const [currentLatitude, setCurrentLatitude] = useState('')
  const [currentLogitude, setCurrentLongitude] = useState('')
  const [serviceRepair, setServiceRepair] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [comment, setComment] = useState('')
  const [latestService, setLatestService] = useState('')
  const [newService, setNewService] = useState('')
  const [userName, setUserName] = useState('')
  const { nfc_id } = route.params;
  const [userAutherity, setUserAutherity] = useState();
  const [selectedLatitude, setSelectedLatitude] = useState();
  const [selectedLongitude, setSelectedLongitude] = useState();

  useEffect(() => {
    setNfcTagID(nfc_id)
    getMetaData(nfc_id)
    getCurrentLocation()
    AsyncStorage.getItem('customerID').then(value => {
      setUserName(value)
    });
    AsyncStorage.getItem('userAutherity').then(value => {
      setUserAutherity(value)
    });

  }, [nfc_id]);

  getMetaData = (tag_id) => {
    let api_url = 'http://0224f17dee4f.ngrok.io/editMetaMainData/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setRowID(responseJson.id)
        setEquipmentName(responseJson.equipment_name)
        getLatestService(responseJson.equipment_name)
        setSelectedLatitude(responseJson.latitude)
        setSelectedLongitude(responseJson.longitude)
        let metaData = [
          { item: 'equipment_name', text: 'Equipment Name:', value: responseJson.equipment_name },
          { item: 'expected_service', text: 'Expected Service:', value: ((responseJson.expected_service).replace('T', ' ')).replace('Z', '') },
          { item: 'technical_category', text: 'Technical Type:', value: responseJson.technical_category },
          { item: 'nfc_tag', text: 'NFC Tag:', value: responseJson.nfc_tag },
          { item: 'service_interval', text: 'Service Interval:', value: (responseJson.service_interval + ' [Month]') },
          { item: 'legit', text: 'Legit:', value: responseJson.legit },
          { item: 'contacts', text: 'Contacts:', value: responseJson.contacts },
          { item: 'longitude', text: 'Longitude:', value: responseJson.longitude },
          { item: 'latitude', text: 'Latitude:', value: responseJson.latitude },
        ]
        setMetaData(metaData)
        setNfcTAG(responseJson.nfc_tag)
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

  _handleActivity = () => {
    Alert.alert(
      'Are you sure to save?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => _saveActivity() },
      ],
      { cancelable: false },
    );
  }

  _addActivity = () => {
    _handleNewDate()
    let alertData = "Please select item"
    Alert.alert(
      alertData,
      'Are you sure?',
      [
        {
          text: 'Service',
          onPress: () => {setServiceRepair("Service"); setModalVisible(true);},
          style: 'cancel',
        },
        { text: 'Repair', onPress: () => { setModalVisible(true); setServiceRepair("Repair") }},
      ],
      { cancelable: false },
    );
   
  }

  _handleValidation = (text) => {
    let newText = '';
    let numbers = '0123456789';

    for (var i=0; i < text.length; i++) {
      if(numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        alert("Please enter numbers only");
      }
    }
    setDueTime(newText);
  }

  getLatestService = (equipmentName) => {
    let api_url = 'http://0224f17dee4f.ngrok.io/getMetaActivityService/' + equipmentName;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        let convertJson = JSON.parse(responseJson)
        if (convertJson.length > 0) {
          setLatestService(convertJson[(convertJson.length) - 1]["fields"]["date"])
        } else {
          setLatestService(newService)
        }
      })
  }

  _handleNewDate = () => {
    let currentDate = getCurrentDate()
    setNewService(currentDate)
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



  _saveActivity = () => {
    let formData = new FormData();
    formData.append("equipment_name", equipmentName)
    formData.append("service_repair", serviceRepair)
    formData.append("due_time", dueTime)
    formData.append("comment", comment)
    if (serviceRepair == "Service") {
      formData.append("date", newService)
    } else {
      formData.append("date", latestService)
    }
    formData.append("serviced_by", userName)


    fetch('http://0224f17dee4f.ngrok.io/addMataArchive/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })                    
      .then((response) => response.json())
      .then(response => {
        if (response.success == "true") {
          setModalVisible(false)
          setComment('');
          setDueTime('');
          getMetaData(nfc_id)
        } else {
          alert("save error")
        }
      }).catch(err => {
        console.log(err)
      })
  }

  getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        let longitude = JSON.stringify(position.coords.longitude);
        let latitude = JSON.stringify(position.coords.latitude);
        setCurrentLatitude(latitude)
        setCurrentLongitude(longitude)
        AsyncStorage.setItem('currentLongitude', longitude);
        AsyncStorage.setItem('currentLatitude', latitude);

      },
      (error) => alert(error.message),
      {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
      }
    )
  }


  _getLocation = () => {
    if (userAutherity == 'Admin') {
    let alertData = "Get Current Location"
      Alert.alert(
        'Are you sure?',
        alertData,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('OK Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => _upDateLocation() },
        ],
        { cancelable: false },
      );
    } else {
      alert("Only Available if user had User Authority  'Admin'")
    }
  }

  _upDateLocation = () => {
    let formData = new FormData();
    formData.append("id", nfc_id);
    formData.append("longitude", currentLogitude);
    formData.append("latitude", currentLatitude);
    fetch('http://0224f17dee4f.ngrok.io/updateMetaMainDataLocation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })                    
    .then((response) => response.json())
    .then(response => {
      if (response.success == "true") {
        getMetaData(nfc_id)
      } else {
        alert("save error")
      }
    }).catch(err => {
      console.log(err)
    })
  }

  _goMap = () => {
    navigation.navigate('Location', {equipment_name: equipmentName, longitude: selectedLongitude, latitude: selectedLatitude})
  }

  renderItem = ({ item }) => (
    // <TouchableHighlight onPress={() => { if(item.item == "equipment_name") navigation.navigate('ActivityLog', { nfc_id: rowID, equipment_name: item.value })}}
    //   underlayColor={'#f1f1f1'}>
      <View style={styles.item} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTitle}>
            <Text style={styles.itemTitleText}>{item.text}</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          { item.item != 'contacts' ?  
            <Text style={styles.text}>{item.value} </Text> :
            <View style={styles.scrollText}>
              <ScrollView>
                 {JSON.parse(item.value).map((contact) => 
                  <Text style={styles.text} key={contact["label"]} >{contact["label"]} </Text>
                )}
              </ScrollView>
            </View>
          }
        </View>
      </View>
    // </TouchableHighlight>
  )

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* <FlatList
          data={metaData}
          keyExtractor={(item) => item.item}
          renderItem={renderItem}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0
          }}
        /> */}
        {metaData && metaData.map((item, key) => {
          return (
            <View style={styles.item} key={key}>
              <View style={styles.marginLeft}>
                <View style={styles.itemTitle}>
                  <Text style={styles.itemTitleText}>{item.text}</Text>
                </View>
              </View>
              <View style={styles.itemContent}>
                { item.item != 'contacts' ?  
                  <Text style={styles.text}>{item.value} </Text> :
                  <View style={styles.scrollText}>
                    <ScrollView>
                      {JSON.parse(item.value).map((contact) => 
                        <Text style={styles.text} key={contact["label"]} >{contact["label"]} </Text>
                      )}
                    </ScrollView>
                  </View>
                }
              </View>
            </View>
          )
        })}
      </View>
      <Modal animationType="fade" visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : height} style={styles.container}>
          <View style={styles.modalView}>
            <View style={styles.logoContainerLogoutButton}>
                <TouchableOpacity onPress={() => { setModalVisible(false) }} style={styles.backButtonContainer} >
                  <Text style={styles.backButtonModal} >Back</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.item} >
              <View style={styles.marginLeft}>
                <View style={styles.itemTitle}>
                  <Text style={styles.itemTitleText}>Latest Service:</Text>
                </View>
              </View>
              <View style={styles.itemContent}>
                <TextInput
                  defaultValue={(latestService.replace('T', ' ')).replace('Z', '')}
                  multiline={true}
                  editable={false}
                  maxLength={200}
                />
              </View>
            </View>
            {
              serviceRepair == "Service" ?
              <View style={styles.item} >
                <View style={styles.marginLeft}>
                  <View style={styles.itemTitle}>
                    <Text style={styles.itemTitleText}>New Service:</Text>
                  </View>
                </View>
                <View style={styles.itemContent}>
                  <TextInput
                    defaultValue={newService}
                    multiline={true}
                    editable={false}
                    maxLength={200}
                  />
                </View>
              </View> :
              <></>
            }
            <View style={styles.item} >
              <View style={styles.itemContentPlaceholder}>
                <TextInput
                  onChangeText={(text) => { _handleValidation(text) }}
                  defaultValue={dueTime}
                  placeholder = "Time spent on activity... (Hours(s)):"
                  placeholderTextColor="#000f"
                  editable={true}
                  multiline={false}
                  maxLength={200}
                  keyboardType='numeric'
                />
              </View>
            </View>
            <View style={styles.item} >
              <View style={styles.itemContentPlaceholder}>
                <TextInput
                  onChangeText={(text) => { setComment(text) }}
                  defaultValue={comment}
                  placeholder = "Note..."
                  placeholderTextColor="#000f"
                  editable={true}
                  multiline={true}
                  maxLength={200}
                />
              </View>
            </View>
            <View style={styles.modelButtonContainer}>
              <TouchableHighlight onPress={() => _handleActivity()}
                style={styles.modalButton}>
                <Text style={styles.modalText}> Save </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => setModalVisible(false)}
                style={styles.modalButton}>
                <Text style={styles.modalText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

     <View style={styles.buttonGroup} >
        <TouchableOpacity onPress={() => _getLocation()}>
          <View style={styles.buttonGroupContainer}>
            <View>
                <Text style={styles.textStyle}>Get Location</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ActivityLog', { nfc_id: rowID, equipment_name: equipmentName })}>
          <View style={styles.buttonGroupContainer}>
            <View>
                <Text style={styles.textStyle}>Activity  Log</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonGroupContainer}>
          <View>
            <TouchableOpacity onPress={() => _addActivity()}>
              <Text style={styles.textStyle}>New  Activity</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View>
            <TouchableOpacity onPress={() => _goMap()}>
              <Text style={styles.textStyle}>Equipment Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

}


const styles = StyleSheet.create({
  header: {
    height: 100,
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextXY: {
    fontSize: 38,
    color: '#000000',
  },
  container: {
    backgroundColor: '#4d8f64',
    padding: 5,
    height: '100%'
  },
  contentContainer: {
    marginTop: 30,
    height: '75%'
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#4d8f64',
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
  scrollText: {
    maxHeight: 50
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold"

  },
  itemContent: {
    width: '55%',
    height: 50,
    maxHeight: 50,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemContentPlaceholder: {
    width: '96%',
    height: 50,
    maxHeight: 50,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 30,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    marginLeft: 5
  },
  itemTitleText: {
    fontSize: 15,
    color: '#000',
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
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#7b8d93',
    color: '#ffffff',
    borderRadius: 10,
    justifyContent: "center",
  },
  itemTitle: {
    padding: 10,
    width: 150,
    height: 50,
    backgroundColor: '#c4d3db',
    alignItems: "center",
    justifyContent: "center",

  },
  logoContainer: {
    marginBottom: '10%',
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  modalButton: {
    borderWidth: 2,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
    borderRadius: 15,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    margin: 20
  },
  modelButtonContainer: {
    flexDirection: "row",
  },
  bottomContaner: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 5

  },
  getLocation: {
    width: 40,
    height: 40,
    marginLeft: '10%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10,
    backgroundColor: '#ffffff'
  },
  bottomRightContainer: {
    flexDirection: "row"
  },
  selectInput: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonGroup: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#4d8f64',
    alignItems: 'center',
    bottom: '5%',
    justifyContent: "center",
    width: '100%'
  },
  buttonGroupContainer: {
      marginLeft: 5,
      borderRadius: 10,
      width: 85,
      height: 80,
      backgroundColor: '#7b8d93',
      alignItems: "center",
      justifyContent: "center",
      padding: 3
  },
  textStyle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.1,
    color: '#fff',
    textAlign: 'center'
  },
   logoContainerLogoutButton: {
    position: "absolute",
    top: hp('4%'),
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#fff',
    padding: 5,
  },
  backButtonContainer: {
    width: '25%',
    borderRadius: 10,
    backgroundColor: '#7b8d93',
  },
  backButtonModal:  {
    padding: 10,
    marginBottom: 0,
    justifyContent: "center",
    borderRadius: 5,
    textAlign: "center",
    color: '#ffffff'
  },
})

