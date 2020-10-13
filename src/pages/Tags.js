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
  Keyboard
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from '@react-native-community/geolocation';


export default function Tags({ route, navigation }) {


  const [metaDatas, setMetaDatas] = useState()
  const [modalVisible, setModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const [editedItem, setEditedItem] = useState(0)
  const [itemTitle, setItemTitle] = useState()
  const [rowID, setRowID] = useState()
  const [nfcTagID, setNfcTagID] = useState()


  useEffect(() => {
    getMetaData()
  });

  getMetaData = (tag_id) => {
    let api_url = 'http://249fc3ad6c59.ngrok.io/getMetaDatas/';
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setMetaDatas(responseJson);     
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
    navigation.navigate('Home')
  }


  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { navigation.navigate('Metadata', { nfc_id: item.tag_id }); }}
      underlayColor={'#f1f1f1'} key={item.id} >
      <View style={styles.item} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTitle}>
            <Text style={styles.itemTitleText}>TagID</Text>
          </View>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.text}>&middot; {item.tag_id} </Text>
        </View>
      </View>
    </TouchableHighlight>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}> Tag List </Text>
        </View>
        <Image style={{ width: 40, height: 40, marginLeft: '10%', marginBottom: 20 }}
          source={require('../assets/images/metabrand.png')} />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={metaDatas}
          keyExtractor={(item) => item.tag_id}
          renderItem={renderItem}
        />
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
    height: 35,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemTitleText: {
    fontSize: 12,
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
    width: 150,
    height: 35,
    borderColor: '#ffffff',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#5b9bd5',
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
    marginTop: 15

  },
  getLocation: {
    width: 40,
    height: 40,
    marginLeft: '10%',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 10
  }
})

