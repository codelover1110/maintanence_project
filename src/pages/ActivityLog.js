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

export default function ActivityLog({ route, navigation }) {
  const [metaData, setMetaData] = useState()
  const [metaDataLogs, setMetaDataLogs] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [nfcTAG, setNfcTAG] = useState()
  const [servicedBy, setServicedBy] = useState('')
  const [serviceRepair, setServiceRepair] = useState('')
  const [comment, setComment] = useState('')
  const { nfc_id } = route.params;
  const { equipment_name } = route.params;

  useEffect(() => {
    getMetaData(nfc_id)
    getMetaDataLog(equipment_name)
  }, [nfc_id, equipment_name]);

  const options = [
    { value: "Electricity", label: "Electricity" },
    { value: "Water", label: "Water" },
    { value: "CO2", label: "CO2" },
    { value: "NH3", label: "NH3" },
    { value: "Compressed Air", label: "Compressed Air" },
    { value: "Heat", label: "Heat" },
    { value: "Glycol", label: "Glycol" },
    { value: "Waste Water", label: "Waste Water" },
    { value: "pH", label: "pH" },
    { value: "Acid", label: "Acid" }
  ]

  getMetaData = (tag_id) => {
    let api_url = 'http://249fc3ad6c59.ngrok.io/editMetaMainData/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        let metaData = [
          { item: 'equipment_name', text: 'Equipment Name:', value: responseJson.equipment_name },
          { item: 'expected_service', text: 'Expected Service:', value: ((responseJson.expected_service).replace('T', ' ')).replace('Z', '') },
          { item: 'technical_category', text: 'Technical Type:', value: responseJson.technical_category },
        ]
        setMetaData(metaData)
        setNfcTAG(responseJson.tag_id)
      })
  }

  getMetaDataLog = (equipment_name) => {
    let api_url = 'http://249fc3ad6c59.ngrok.io/getMetaActivity/' + equipment_name;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        let convertJson = JSON.parse(responseJson)
        let metaDataLogs = []
        convertJson.map((metaDataLog) => (
          metaDataLogs.push({
            item: 'serviced:', 
            text: 'Serviced:', 
            value: ((metaDataLog["fields"]["date"]).replace('T', ' ')).replace('Z', '') ,
            serviced_by: metaDataLog["fields"]["serviced_by"],
            service_repair: metaDataLog["fields"]["service_repair"],
            comment: metaDataLog["fields"]["comment"]
          })
        ))
        setMetaDataLogs(metaDataLogs)
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

  _handleLogout = () => {
    AsyncStorage.removeItem('check_status')
    navigation.navigate('BACK')
  }

  renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={'#f1f1f1'}>
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
    </TouchableHighlight>
  )

  renderItemLog = ({ item }) => (
    <TouchableHighlight onPress={() => { setModalVisible(true); setServicedBy(item.serviced_by); setServiceRepair(item.service_repair); setComment(item.comment); }}
      underlayColor={'#f1f1f1'}>
      <View style={styles.item} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTitle}>
            <Text style={styles.itemTitleText}>{item.text}</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
            <Text style={styles.text}>{item.value} </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <FlatList
          data={metaData}
          keyExtractor={(item) => item.item}
          renderItem={renderItem}
        />
      </View>
      <View style={styles.contentContainerLog}>
        <FlatList
          data={metaDataLogs}
          keyExtractor={(item, key) => key}
          renderItem={renderItemLog}
        />
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
                  <Text style={styles.itemTitleText}>Serviced By:</Text>
                </View>
              </View>
              <View style={styles.itemContent}>
                <TextInput
                  defaultValue={servicedBy}
                  multiline={true}
                  editable={false}
                  maxLength={200}
                />
              </View>
            </View>
            <View style={styles.item} >
              <View style={styles.marginLeft}>
                <View style={styles.itemTitle}>
                  <Text style={styles.itemTitleText}>Service/Repair:</Text>
                </View>
              </View>
              <View style={styles.itemContent}>
                <TextInput
                  defaultValue={serviceRepair}
                  multiline={true}
                  editable={false}
                  maxLength={200}
                />
              </View>
            </View>
            <View style={styles.item} >
              <View style={styles.marginLeft}>
                <View style={styles.itemTitleNote}>
                  <Text style={styles.itemTitleText}>Note:</Text>
                </View>
              </View>
              <View style={styles.itemContentNote}>
                <TextInput
                  defaultValue={comment}
                  editable={false}
                  multiline={true}
                  maxLength={200}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  },
  contentContainerLog: {
    marginTop: 10,
    height: '60%'
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
  itemContentNote: {
    width: '55%',
    height: 150,
    maxHeight: 200,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
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
    // borderRadius: 10,
    backgroundColor: '#c4d3db',
    alignItems: "center",
    justifyContent: "center",

  },
  itemTitleNote: {
    padding: 10,
    width: 150,
    height: 150,
    // borderRadius: 10,
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

