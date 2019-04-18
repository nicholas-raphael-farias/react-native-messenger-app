import React, { Component } from 'react';
import {Root, Text, Toast, Title } from "native-base";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';


@observer
export default class NewPassword extends Component {

  constructor(props) {
    super(props);

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  @computed get newPassword() {
    return MessengerStore.newPassword;
  }

  @computed get newPasswordRepeat() {
    return MessengerStore.newPasswordRepeat;
  }

  async handlePasswordChange() {
    if (this.newPassword === this.newPasswordRepeat) {
      await MessengerStore.updatePassword();
      this.props.navigation.navigate('Home'); 
    } else {
      Toast.show({
        text: "Las contraseñas no coinciden",
        position: "bottom",
        duration: 3000
      }); 
    }
  }

  render() {
    return (
      <Root>
        <KeyboardAvoidingView style={styles.container}>
          <Text style={styles.titleText}>Actualizar Contraseña</Text>
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/message/ultraviolet/50/3498db'}}/>
            <TextInput style={styles.inputs}
                placeholder="Contraseña"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => MessengerStore.setNewPassword(password)}/>
          </View>
          
          <View style={styles.inputContainer}>
            <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
            <TextInput style={styles.inputs}
                placeholder="Repite Contraseña"
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => MessengerStore.setNewPasswordRepeat(password)}/>
          </View>

          <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.handlePasswordChange()}>
            <Text  style={styles.loginText}>Actualizar Contraseña</Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  inputContainer: {
    backgroundColor: '#F3F6F8',
    borderRadius:6,
    width:280,
    height:45,
    marginBottom:8,
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
    height:45,
    marginLeft:16,
    borderBottomColor: '#F3F6F8',
    flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:30,
    marginBottom:20,
    width:280,
    borderRadius:6,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  titleText:{
    fontWeight: 'bold',
    fontSize: 24,
    marginTop:120,
    marginBottom:40,
  }
});