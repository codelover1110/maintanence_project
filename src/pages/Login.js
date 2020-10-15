import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';


import Icon from 'react-native-vector-icons/MaterialIcons'
import Logo from '../components/Logo';
import CheckBox from 'react-native-check-box';
import AsyncStorage from "@react-native-community/async-storage";

function Login(props) {
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const [isSelected, setSelection] = useState(true);
  const [isLogined, setLogined] = useState(false);


  useEffect(() => {
    AsyncStorage.getItem('check_status').then(value => {
      setLogined(value)
      if (value == 'true') {
        props.navigation.navigate('Home')
      }
    });
  });


  _handlePress = () => {

    if (userName && userPassword) {
      setShowLoading(true);

      let api_url = 'http://249fc3ad6c59.ngrok.io/getUserMobile/' + userName + '/' + userPassword;
      return fetch(api_url)
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.user_name != "") {
            if (responseJson.password != "") {
              if (responseJson.Authority != "false") {
                AsyncStorage.setItem('customerID', userName);
                AsyncStorage.setItem('userAutherity', responseJson["autherity"]);
                if (isSelected) {
                  AsyncStorage.setItem('check_status', 'true')
                }
                props.navigation.navigate('Home')
              } else {
                alert("Your account is inactive. Please contact administrator")
              }
              setShowLoading(false)
            } else {
              setShowLoading(false)
              alert("Your password doesn't correct! Input again.")
            }
          } else {
            setShowLoading(false)
            alert("Your username doesn't correct!")
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("You have to insert email and password!")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : height} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View style={styles.signupContainer}>
            <View style={styles.itemcontainer}>
              <TextInput style={styles.inputBox}
                placeholder="Username"
                placeholderTextColor="#ccc"
                selectionColor='#fff'
                returnKeyLabel={"next"}
                onChangeText={(text) => setUserName(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.itemcontainer}>
              <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="#ccc"
                returnKeyLabel={"next"}
                onChangeText={(text) => setUserPassword(text)}
              />
            </View>
            <View style={styles.itemcontainer}>
              <CheckBox
                onClick={() => {
                  setSelection(!isSelected)
                }}
                isChecked={isSelected}
              />
              <Text>Stay signed in?</Text>
            </View>
            <View style={styles.itemcontainer}>
              {showLoading == true ? <ActivityIndicator size="large" color="#00ff00" />
                : <TouchableOpacity style={styles.button}
                  onPress={this._handlePress}>
                  <Text style={styles.buttonText}>SignIn</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.itemcontainer}>
                <TouchableOpacity style={styles.button}
                  onPress={() => props.navigation.navigate('PasswordReset')}>
                  <Text style={styles.buttonText}>Reset password</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4d8f64',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signupContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    marginVertical: 16
  },

  button: {
    backgroundColor: '#7b8d93',
    width: 200,
    borderRadius: 10,
    marginVertical: 10,
    paddingVertical: 13,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center",
  },
  itemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imgIcon: {
    padding: 10
  },

});

export default Login;