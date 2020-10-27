import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Keyboard, Dimensions, Alert } from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { TouchableHighlight } from "react-native-gesture-handler";


const App = ({ navigation, route }) => {

  const [metaDatas, setMetaDatas] = useState([])
  const [tagID, setTagID] = useState('')
  const [tagType, setTagType] = useState('')
  const [searchContent, setSearchContent] = useState('')
  const [tempMetaData, setTempMetaData] = useState()
  const [btnColor, setBtnColor] = useState('white')
  const [mapTypes, setMapTypes] = useState('standard')
  const [nfcTAG, setNfcTAG] = useState('')
  const [energyArt, setEnergyArt] = useState('')
  const [flag, setFlag] = useState(true)
  const [userAutherity, setUserAutherity] = useState()
  const [currentLatitude, setCurrentLatitude] = useState(37.33233141)
  const [currentLogitude, setCurrentLongitude] = useState(-122.0312186)
  const [userTechnicalCatetory, setUserTechnicalCategory] = useState([])

  const { height, width } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.009
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height)
  const colorButton = {
    Water: require('../assets/images/metaIcon/blue.png'),
    Electricity: require('../assets/images/metaIcon/green.png'),
    CO2: require('../assets/images/metaIcon/darkgrey.png'),
    NH3: require('../assets/images/metaIcon/black.png'),
    "Compressed Air": require('../assets/images/metaIcon/orange.png'),
    Heat: require('../assets/images/metaIcon/red.png'),
    Glycol: require('../assets/images/metaIcon/white.png'),
    "Waste Water": require('../assets/images/metaIcon/brown.png'),
    pH: require('../assets/images/metaIcon/purple.png'),
    Acid: require('../assets/images/metaIcon/yellow.png'),
  };
  const [initialRegion, setInitialRegion] = useState({latitude: 37.33233141, longitude: -122.0312186, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA, })

  useFocusEffect(() => {
    if(flag) {
      getMetaDatas()
      setFlag(false)
      AsyncStorage.getItem('customerID').then(value => {
        setUserAutherity(value)
      });
    }
    getCurrentLocation()
    setTagType('')
  });

  useEffect(() => {
    if (route.params) {
        const { equipment_name } = route.params;
        console.log(initialRegion)
        setSearchContent(equipment_name);
        _handleSearchContent(equipment_name);

    } 
  }, [route.params])

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

  getMetaDatas = () => {
    AsyncStorage.getItem('customerID').then(value => {
      let api_url = 'http://62e3972fd691.ngrok.io/getUserByID/' + value;
      return fetch(api_url)
        .then((response) => response.json())
        .then((responseJson) => {
          let convertJson = JSON.parse(responseJson.technical_authority);
          setUserTechnicalCategory(convertJson)
          api_url = 'http://62e3972fd691.ngrok.io/getMetaMainDatas/';
          return fetch(api_url)
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(convertJson)
              var filterdData = []
              convertJson.map((item) => {
                filterdData = filterdData.concat(responseJson.filter(x => x.technical_category == item.label))
              })
              setMetaDatas(filterdData)
              setTempMetaData(filterdData)
          })
        })
        .catch((error) => {
          console.error(error);
        })    
    });
  }

  _handleSearch = () => {
    if (searchContent == '') {
      return
    }
    setMetaDatas(tempMetaData)
    let searchData = (metaDatas => metaDatas.filter(x => (x.technical_category) && (x.technical_category).toLowerCase() == searchContent.toLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == searchContent.toLowerCase()
      || (x.nfc_tag) && (x.nfc_tag).toLowerCase() == searchContent.toLowerCase() || (x.service_interval) && (x.service_interval).toLowerCase() == searchContent.toLowerCase() || (x.legit) && (x.legit).toLowerCase() == searchContent.toLowerCase()
      || (x.latest_service) && (x.latest_service).toLowerCase() == searchContent.toLowerCase() || (x.longitude) && (x.longitude).toLowerCase() == searchContent.toLowerCase() || (x.latitude) && (x.latitude).toLowerCase() == searchContent.toLowerCase()
      || (x.expected_service) && (x.expected_service).toLowerCase() == searchContent.toLowerCase() || (x.reminder_month) && (x.reminder_month).toLowerCase() == searchContent.toLowerCase() || (x.nfc_tag) && (x.nfc_tag).toLowerCase() == searchContent.toLowerCase()
      || (x.reminder_week) && (x.reminder_week).toLowerCase() == searchContent.toLowerCase() || (x.reminder_flag) && (x.reminder_flag).toLowerCase() == searchContent.toLowerCase()))
    setMetaDatas(searchData)
    if ((metaDatas).length > 0) {
      setRegion({
        latitude: parseFloat(metaDatas[0]["latitude"]),
        longitude: parseFloat(metaDatas[0]["longitude"]),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    }
  }

  const [region, setRegion] = useState(initialRegion);

  _handleMarker = (metaData) => {
    setTagID(metaData["equipment_name"])
    setTagType(metaData["media_type"])
    setNfcTAG(metaData["id"])
    setEnergyArt(metaData["technical_category"])

  }

  _handleSearchContent = (searchContent) => {
    setSearchContent(searchContent)
    setMetaDatas(tempMetaData)

    if (searchContent == '') {
      setMetaDatas(tempMetaData)
      return
    }
    _handleRealtimeSearch(searchContent)
  }

  _handleRealtimeSearch = (searchContent) => {
    let tmd = tempMetaData
    let filteredValue = tmd.filter(x => (x.technical_category) && (x.technical_category).includes(searchContent) || (x.equipment_name) && ((x.equipment_name).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.nfc_tag) && ((x.nfc_tag).toLowerCase()).includes(searchContent.toLowerCase()) || (x.service_interval) && ((x.service_interval).toLowerCase()).includes(searchContent.toLowerCase()) || (x.legit) && ((x.legit).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.latest_service) && ((x.latest_service).toLowerCase()).includes(searchContent.toLowerCase()) || (x.longitude) && ((x.longitude).toLowerCase()).includes(searchContent.toLowerCase()) || (x.latitude) && ((x.latitude).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.expected_service) && ((x.expected_service).toLowerCase()).includes(searchContent.toLowerCase()) || (x.reminder_month) && ((x.reminder_month).toLowerCase()).includes(searchContent.toLowerCase()) || (x.nfc_tag) && ((x.nfc_tag).toLowerCase()).includes(searchContent.toLowerCase())
      || (x.reminder_week) && ((x.reminder_week).toLowerCase()).includes(searchContent.toLowerCase()) || (x.reminder_flag) && ((x.reminder_flag).toLowerCase()).includes(searchContent.toLowerCase()))
    setMetaDatas(filteredValue)
  }


  useLayoutEffect(() => {
    navigation.setOptions({
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

  _goMetaData = () => {
    if (nfcTAG == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('Metadata', { nfc_id: nfcTAG })
  }
  _getLocation = () => {
    if (nfcTAG == '') {
      alert("Select Tag!")
      return
    }
    let api_url = 'http://62e3972fd691.ngrok.io/getUserByID/' + userAutherity;
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.user_authority == 'Admin') {
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
      })
      .catch((error) => {
        console.error(error);
      })          
  }

  _upDateLocation = () => {
    let formData = new FormData();
    formData.append("id", nfcTAG);
    formData.append("longitude", currentLogitude);
    formData.append("latitude", currentLatitude);
    console.log(nfcTAG, currentLatitude, currentLogitude)

    fetch('http://62e3972fd691.ngrok.io/updateMetaMainDataLocation/', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    })                    
    .then((response) => response.json())
    .then(response => {
      if (response.success == "true") {
        getMetaDatas()
      } else {
        alert("save error")
      }
    }).catch(err => {
      console.log(err)
    })
  }

  _goTags = () => {
    navigation.navigate('Tags')
  }

  _handleMapType = () => {
    if (mapTypes == 'standard') {
      setMapTypes('satellite')
    } else {
      setMapTypes('standard')
    }
  }

  _goActivityLog = () => {
    if (nfcTAG == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('ActivityLog', { nfc_id: nfcTAG, equipment_name: tagID })
  }

  onRegionChange = () => {
    setInitialRegion({
      latitude: 58.586940,
      longitude: 9.726038,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    })
  }

  mapStyle = [{ "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] }, { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] }, { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }];

  return (
    <View style={styles.container}>
      <View style={styles.item} >
        <View style={styles.searchContent}>
          <TextInput
            onChangeText={(text) => { _handleSearchContent(text) }}
            editable={true}
            multiline={false}
            maxLength={200}
            placeholder="search..."
            autoCapitalize="none"
            value={searchContent}
          />
        </View>
        <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleSearch()}>
              <Image style={styles.searchButton}
                source={require('../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={mapStyle}
        mapType='satellite'
        showsUserLocation={true}
        onRegionChange={onRegionChange}
        onRegionChangeComplete={onRegionChange}
        // onRegionChange={region => setRegion({ region })}
        // onRegionChangeComplete={region => setRegion({ region })}
        zoomEnabled={true}
        showsMyLocationButton={false}
      >
        {metaDatas.length > 0 && metaDatas.map((metaData) => {
          if (metaData["latitude"] && metaData["longitude"]) {
            return <Marker
            draggable
            coordinate={{
              latitude: parseFloat(metaData["latitude"]),
              longitude: parseFloat(metaData["longitude"]),
            }}
            onDragEnd={(e) => _handleMarker(e, metaData)}
            image={colorButton[(metaData["technical_category"])]}
            onPress={() => _handleMarker(metaData)}
            onCalloutPress={() => _handleMarker(metaData)}
            key={metaData["id"]}
          >
            <MapView.Callout>
              <TouchableHighlight onPress={() => _handleMarker(metaData)}>
                <View>
                  <Text>Equipment: {metaData["equipment_name"]}</Text>
                  <Text>Technical Category: {metaData["technical_category"]}</Text>
                </View>
              </TouchableHighlight>
            </MapView.Callout>
          </Marker>}
          })
        }
      </MapView>
       <View style={styles.itemTag} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text style={styles.itemTitleText}>Equipment Name:</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <TextInput
            editable={false}
            multiline={false}
            maxLength={200}
            value={tagID}
          />
        </View>
      </View>
      <View style={styles.itemTagType} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text style={styles.itemTitleText}>Technical Category:</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
          <TextInput
            editable={false}
            multiline={false}
            maxLength={200}
            value={energyArt}
          />
        </View>
      </View>
      <View style={styles.buttonGroup} >
        <TouchableOpacity onPress={() => _getLocation()}>
          <View style={styles.buttonGroupContainer}>
            <View style={styles.itemTitle}>
                <Text style={styles.textStyle}>Get Location</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => _goMetaData()}>
          <View style={styles.buttonGroupContainer}>
            <View style={styles.itemTitle}>
                <Text style={styles.textStyle}>Meta Data</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goActivityLog()}>
              <Text style={styles.textStyle}>Activity Log</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => navigation.navigate('EquipmentList')}>
              <Text style={styles.textStyle}>Equipment List</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#4d8f64'
  },
  map: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    bottom: '40%',
    borderRadius: 20
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
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 0,
    backgroundColor: '#7b8d93',
    color: '#ffffff',
    borderRadius: 5,
    justifyContent: "center",
  },
  item: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#4d8f64',
    alignItems: 'center',
    justifyContent: "center",
    top: 10,
    width: '117%'
  },
  itemTag: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#4d8f64',
    alignItems: 'center',
    bottom: '30%',
    justifyContent: "center",
    width: '70%',
    borderRadius: 20
  },
  itemTagType: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#4d8f64',
    alignItems: 'center',
    bottom: '23%',
    justifyContent: "center",
    width: '70%'
  },
  buttonGroup: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#4d8f64',
    alignItems: 'center',
    bottom: '5%',
    justifyContent: "center",
    width: '60%'
  },
  marginLeft: {
    marginLeft: 5,
  },
  text: {
    fontSize: 15,

  },

  itemContent: {
    width: '80%',
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },

  searchContent: {
    width: '80%',
    height: 35,
    backgroundColor: '#ffffff',
    justifyContent: "center",
    paddingLeft: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  searchButton: {
    width: 35,
    height: 35,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  buttonSerial: {
    width: 65,
    height: 65,
  },
  buttonService: {
    width: 50,
    height: 50,
  },
  itemTagTitle: {
    borderWidth: 1,
    width: 165,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    paddingLeft: 35,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  buttonGroupContainer: {
    marginLeft: 5,
    borderRadius: 10,
    width: 80,
    height: 80,
    backgroundColor: '#7b8d93',
    alignItems: "center",
    justifyContent: "center"
  },
  buttonGroupContainerActive: {
    marginLeft: 5,
    borderRadius: 10,
    width: 80,
    height: 80,
    backgroundColor: 'orange',
    alignItems: "center",
    justifyContent: "center"
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.1,
    color: '#fff',
    textAlign: 'center'
  },

});

export default App;