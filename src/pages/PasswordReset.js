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

function PasswordReset(props) {
  const [email, setEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  _handlePress = () => {
      if (email != '') {
        let formData = new FormData();
        formData.append("email", email);
        fetch('http://62e3972fd691.ngrok.io/resetEmailMobile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      })
        .then((response) => response.json())
        .then(response => {
            if (response["email"] == "") {
                alert("Email is incorrect. Try again.")
            } else {
                alert("Sent the email.")
                props.navigation.navigate('Login')
            }
        })
      } else {
          alert("Please insert an email.")
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
                placeholder="Insert Email"
                placeholderTextColor="#ccc"
                selectionColor='#fff'
                returnKeyLabel={"next"}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.itemcontainer}>
              {showLoading == true ? <ActivityIndicator size="large" color="#00ff00" />
                : <TouchableOpacity style={styles.button}
                  onPress={this._handlePress}>
                  <Text style={styles.buttonText}>Send Email</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={styles.itemcontainer}>
                <TouchableOpacity style={styles.button}
                  onPress={() => props.navigation.navigate('Login')}>
                  <Text style={styles.buttonText}>Cancel</Text>
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

export default PasswordReset;