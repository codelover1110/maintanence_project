import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Keyboard } from "react-native";

import MapView, { Marker } from "react-native-maps";

const App = ({ navigation }) => {

  const [metaDatas, setMetaDatas] = useState([])
  const [tagID, setTagID] = useState('')
  const [tagType, setTagType] = useState('')
  const [searchContent, setSearchContent] = useState('')
  const [tempMetaData, setTempMetaData] = useState()
  const [btnColor, setBtnColor] = useState('white')
  const [mapTypes, setMapTypes] = useState('')
  const [nfcTAG, setNfcTAG] = useState('')
  const [energyArt, setEnergyArt] = useState('')


  const colorButton = {
    Vand: require('../assets/images/metaIcon/blue.png'),
    El: require('../assets/images/metaIcon/green.png'),
    CO2: require('../assets/images/metaIcon/darkgrey.png'),
    NH3: require('../assets/images/metaIcon/black.png'),
    Trykluft: require('../assets/images/metaIcon/orange.png'),
    Varme: require('../assets/images/metaIcon/red.png'),
    Glycol: require('../assets/images/metaIcon/white.png'),
    Spildevand: require('../assets/images/metaIcon/brown.png'),
    pH: require('../assets/images/metaIcon/purple.png'),
    Syre: require('../assets/images/metaIcon/yellow.png'),
  };

  useEffect(() => {
    getMetaDatas()
  }, []);

  getMetaDatas = () => {
    let api_url = 'http://0bd44d9f4578.ngrok.io/getMetaDatas/';
    return fetch(api_url)
      .then((response) => response.json())
      .then((responseJson) => {
        setMetaDatas(responseJson)
        setTempMetaData(responseJson)
      })
  }

  _handleSearch = () => {
    if (searchContent == '') {
      return
    }
    setMetaDatas(tempMetaData)
    let searchData = (metaDatas => metaDatas.filter(x => (x.tag_id).toLowerCase() == searchContent.toLowerCase() || (x.column_line).toLowerCase() == searchContent.toLowerCase()
      || (x.energy_art).toLowerCase() == searchContent.toLowerCase() || (x.latitude).toLowerCase() == searchContent.toLowerCase() || (x.longtitude).toLowerCase() == searchContent.toLowerCase()
      || (x.media_type).toLowerCase() == searchContent.toLowerCase() || (x.meta_data_picture).toLowerCase() == searchContent.toLowerCase() || (x.meter_level_structure).toLowerCase() == searchContent.toLowerCase()
      || (x.meter_location).toLowerCase() == searchContent.toLowerCase() || (x.meter_point_description).toLowerCase() == searchContent.toLowerCase() || (x.nfc_tag).toLowerCase() == searchContent.toLowerCase()
      || (x.supply_area_child).toLowerCase() == searchContent.toLowerCase() || (x.supply_area_parent).toLowerCase() == searchContent.toLowerCase()))
    // console.log(metaDatas)
    setMetaDatas(searchData)
    // setRegion({
    //   latitude: parseFloat(metaDatas[0]["latitude"]),
    //   longitude: parseFloat(metaDatas[0]["longtitude"]),
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // })
    setRegion({
      latitude: 55.1183760,
      longitude: 9.729960,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
  }

  const [region, setRegion] = useState({
    latitude: 55.583760,
    longitude: 9.729960,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  _handleMarker = (metaData) => {
    console.log(metaData["tag_id"], "000000000")
    setTagID(metaData["tag_id"])
    setTagType(metaData["media_type"])
    setNfcTAG(metaData["nfc_tag"])
    setEnergyArt(metaData["energy_art"])

  }

  _handleSearchContent = (text) => {
    setSearchContent(text)
    if (text == '') {
      setMetaDatas(tempMetaData)
    }
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

  _goConsumption = () => {
    if (tagID == '') {
      alert("Select Tag!")
      return
    }
    // navigation.navigate('Consumptionlocation', { nfc_id: nfcTAG })
    navigation.navigate('Consumption', { nfc_id: tagID })
  }
  _goMeataData = () => {
    if (tagID == '') {
      alert("Select Tag!")
      return
    }
    navigation.navigate('Metadata', { nfc_id: nfcTAG })
  }
  _goTags = () => {
    navigation.navigate('Tags')
  }
  _handleMapType = () => {
    if (mapTypes == '') {
      setMapTypes('satellite')
    } else {
      setMapTypes('')
    }
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
        initialRegion={region}
        customMapStyle={mapStyle}
        mapType={mapTypes}
      // onRegionChange={() => onRegionChange()}
      >
        {/* <CustomMarker /> */}
        {metaDatas.length > 0 ? metaDatas.map((metaData) =>
          <Marker
            draggable
            coordinate={{
              latitude: parseFloat(metaData["latitude"]),
              longitude: parseFloat(metaData["longtitude"]),
            }}
            onDragEnd={(e) => _handleMarker(e, metaData)}
            title={'TagID: ' + metaData["tag_id"]}
            // description={'Location: ' + metaData["meter_location"]}
            image={colorButton[(metaData["energy_art"])]}
            onTouchStart={() => _handleMarker(metaData)}
            key={metaData["id"]}
          />) : <Marker
            draggable
            coordinate={{
              latitude: 0,
              longitude: 0,
            }}
            image={require('../assets/images/degreeday.png')}
          />}
      </MapView>
      <View style={styles.itemTag} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text style={styles.itemTitleText}>TagID       :</Text>
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
        {/* <View>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleLogout()}>
              <Image style={styles.searchButton}
                source={require('../assets/images/search.png')} />
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
      <View style={styles.itemTagType} >
        <View style={styles.marginLeft}>
          <View style={styles.itemTagTitle}>
            <Text style={styles.itemTitleText}>EnergyArt:</Text>
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
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goMeataData()}>
              <Image style={styles.buttonService}
                source={require('../assets/images/service.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goTags()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/list.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _goConsumption()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/consumption.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.buttonGroupContainer}>
          <View style={styles.itemTitle}>
            <TouchableOpacity onPress={() => _handleMapType()}>
              <Image style={styles.buttonSerial}
                source={require('../assets/images/location.png')} />
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
    backgroundColor: '#548235'
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
    marginBottom: 0,
    borderColor: '#ccc',
    borderWidth: 2,
    color: '#ffffff',
    borderRadius: 10,
    justifyContent: "center",
  },
  item: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    justifyContent: "center",
    top: 10,
    width: '117%'
  },
  itemTag: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '33%',
    justifyContent: "center",
    width: '105%',
    borderRadius: 20
  },
  itemTagType: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '27%',
    justifyContent: "center",
    width: '105%'
  },
  buttonGroup: {
    position: 'absolute',
    flexDirection: 'row',
    borderBottomWidth: 5,
    borderBottomColor: '#548235',
    alignItems: 'center',
    bottom: '12%',
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
    width: 80,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  buttonGroupContainer: {
    marginLeft: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 15,
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    alignItems: "center",
    justifyContent: "center"
  }

});

export default App;