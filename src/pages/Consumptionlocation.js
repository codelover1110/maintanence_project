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
  TouchableHighlight
} from 'react-native';

export default function Consumptionlocation({ route, navigation }) {


  const [date, setDate] = useState('')
  const [value, setValue] = useState()
  const [unit, setUnit] = useState()
  const [nfcID, setNfcID] = useState()
  const [nfcTAG, setNfcTAG] = useState()


  useEffect(() => {
    const { nfc_id } = route.params;
    console.log(nfc_id)
    setNfcID(nfc_id)
    getMetaData(nfc_id);
  }, []);

  getMetaData = (tag_id) => {
    let api_url = 'http://0224f17dee4f.ngrok.io/editConsumptionlocation/' + tag_id;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson["success"] == "false") {
          console.log("failure")
          setDate("There is no data")
          setValue("There is no data")
          setUnit("There is no data")
        } else {
            consumption = (JSON.parse(responseJson))
          //   latestDate = consumption[0]["fields"]["new_reading_date"].replace("T", " ").replace("Z", "")
          setDate(consumption[0]["fields"]["date"])
          setValue(consumption[0]["fields"]["consumption"])
          setUnit(consumption[0]["fields"]["unit"])
          setNfcTAG(consumption[0]["fields"]["nfc_tag"])
          console.log(responseJson)
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

  _handleLogout = () => {
    navigation.navigate('Home')
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}> TagID:  </Text>
          <Text style={styles.headerTextXY}>{nfcTAG}</Text>
        </View>
        <Image style={{ width: 40, height: 40, marginLeft: '10%', marginBottom: 20 }}
          source={require('../assets/images/metabrand.png')} />
      </View>

      <View style={styles.modalView}>
        <View style={styles.item} >
          <View style={styles.marginLeft}>
            <View style={styles.itemTitle}>
              <Text style={styles.itemTitleText}>Date</Text>
            </View>
          </View>
          <View style={styles.itemContent}>
            <Text>&middot; {date}</Text>
          </View>
        </View>
        <View style={styles.item} >
          <View style={styles.marginLeft}>
            <View style={styles.itemTitle}>
              <Text style={styles.itemTitleText}>Value</Text>
            </View>
          </View>
          <View style={styles.itemContent}>
            <Text>&middot; {value}</Text>
          </View>
        </View>
        <View style={styles.item} >
          <View style={styles.marginLeft}>
            <View style={styles.itemTitle}>
              <Text style={styles.itemTitleText}>Unit</Text>
            </View>
          </View>
          <View style={styles.itemContent}>
            <Text>&middot; {unit}</Text>
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
    height: 50,
    backgroundColor: '#c4d3db',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  itemTitleText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: "bold"
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
  itemImageStyle: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    marginTop: 50
  },
})

