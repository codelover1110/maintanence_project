import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';

import SelectInput from 'react-native-select-input-ios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../components/Logo';

function Register(props) {
  console.log(props)

  const selectOptions = [
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' },

  ]

  const selectOptions1 = []

  for (let i = 1980; i <= 2020; i++) {
    selectOptions1.push({ value: ('' + i), label: ('' + i) })
  }

  const [selectOption, setSelectOption] = useState('Female')
  const [selectOption1, setSelectOption1] = useState('1990')
  const [signEmail, setSignEmail] = useState('')
  const [signPassword, setSignPassword] = useState('')
  const [signName, setSignName] = useState('')
  const [signAge, setSignAge] = useState('')
  const [signLoading, setSignLoading] = useState('')

  _handleFormSubmit = () => {
    let formData = new FormData();
    formData.append("gender", selectOption)
    formData.append("email", signEmail)
    formData.append("password", signPassword)
    formData.append("name", signName)
    formData.append("age", selectOption1)
    console.log(formData);
    if (signEmail == '' || signPassword == ''
      || signName == '') {
      alert("You have to input your information correctly!")
    } else {
      setSignLoading(true)
      fetch('http://0bd44d9f4578.ngrok.io/adduser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      })
        .then((response) => response.json())
        .then(response => {
          setSignLoading(false)
          if (response.success == "true") {
            Alert.alert("Congratulations!  Successful Registered!")
            setSignName('');
            setSignPassword('');
            setSignAge('');
            setSignEmail('');
            props.navigation.navigate('Login')
          } else {
            alert("Your email already registed!")
          }
          console.log(response)
        }).catch(err => {
          console.log(err)
        })
    }
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : height} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Logo />
          <View style={styles.registerContainer}>
            <View style={styles.itemcontainer}>
              <Icon
                style={styles.imgIcon} name="email" size={20} color='#000'
              />
              <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Email"
                placeholderTextColor="#ffffff"
                keyboardType="email-address"
                onSubmitEditing={() => this.password.focus()}
                returnKeyLabel={"next"}
                onChangeText={(text) => setSignEmail(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.itemcontainer}>
              <Image
                style={styles.registerImageKey}
                source={require('../assets/images/key.png')}
              />
              <TextInput style={styles.inputBoxKey}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Password"
                placeholderTextColor="#ffffff"
                ref={(input) => this.password = input}
                returnKeyLabel={"next"}
                onChangeText={(text) => setSignPassword(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.itemcontainer}>
              <Icon
                style={styles.imgIcon} name="person" size={20} color='#000'
              />
              <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder="Name"
                placeholderTextColor="#ffffff"
                returnKeyLabel={"next"}
                onChangeText={(text) => setSignName(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.selectItemcontainer}>
              <Image
                style={styles.registerImage}
                source={require('../assets/images/birthday.png')}
              />
              <View style={styles.selectBoxContainerCustom}>
                <SelectInput
                  value={selectOption1}
                  options={selectOptions1}
                  onSubmitEditing={(value) => setSelectOption1(value)}
                  style={styles.selectInput}
                  placeholder={
                    { value: null, label: 'Select Gender' }
                  }
                />
              </View>
            </View>
            <View style={styles.selectItemcontainer}>
              <Image
                style={styles.registerImage}
                source={require('../assets/images/gender.png')}
              />
              <View style={styles.selectBoxContainerCustom}>
                <SelectInput
                  value={selectOption}
                  options={selectOptions}
                  onSubmitEditing={(value) => setSelectOption(value)}
                  style={styles.selectInput}
                />
              </View>
            </View>
            {signLoading == true ? <ActivityIndicator size="large" color="#00ff00" />
              : <TouchableOpacity style={styles.button}
                onPress={() => _handleFormSubmit()}>
                <Text style={styles.buttonText}>SignUp</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#548235',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  registerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
    marginVertical: 16
  },
  inputBoxKey: {
    width: 300,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000000',
    marginVertical: 16,
    marginLeft: 10
  },

  selectBox: {
    width: 300,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    paddingHorizontal: 10,
    // fontSize: 16,
    color: 'red',
    marginVertical: 16
  },

  selectBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    marginVertical: 5,

  },
  selectBoxContainerCustom: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: 30,
    // borderWidth: 1,
    borderColor: '#bdc3c7',
    overflow: 'hidden',
    marginVertical: 5,
    marginLeft: 10

  },

  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 300,
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 10,
    marginLeft: 30
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: "center"
  },
  itemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  selectItemcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  imgIcon: {
    padding: 10
  },
  selectInput: {
    flexDirection: 'row',
    height: 40,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 300,
  },
  selectInputLarge: {
    width: '100%',
    paddingHorizontal: 16
  },
  registerImage: {
    width: 18,
    height: 18,
    marginLeft: 10
  },
  registerImageKey: {
    width: 18,
    height: 18,
    marginLeft: 5
  }
});

export default Register;