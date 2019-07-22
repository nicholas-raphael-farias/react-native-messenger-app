import React, { Component } from 'react';
import {Root, Text, Toast, Container } from "native-base";
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
import { Col, Row, Grid } from 'react-native-easy-grid';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed, autorun} from 'mobx';
import {observer} from 'mobx-react';

@observer
export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  @computed get auxIsLogged() {
    return MessengerStore.auxIsLogged;
  }

  @computed get isActive() {
    return MessengerStore.isActive;
  }

  @computed get phone() {
    return MessengerStore.auxPhone;
  }

  @computed get password() {
    return MessengerStore.auxPassword;
  }

  async handleLogin() {
    await MessengerStore.auxAuthMessenger();
    if (this.auxIsLogged) {
      this.props.navigation.navigate('Lista de Tareas'); 
      MessengerStore.setAuxPhone('');
      MessengerStore.setAuxPassword('');
      MessengerStore.setAuxIsLogged(false);
    } else {
      Toast.show({
        text: "Contraseña o Teléfono incorrectos",
        buttonText: "Okay",
        position: "bottom",
        duration: 3000
      }); 
    }
  }

  render() {
    return (
      <Container>
        <Grid>
          <Row style={{ backgroundColor: '#FFF'}}>
            <KeyboardAvoidingView style={styles.container}>
              <Image style={styles.delivery_icon} source={require('./img/delivery_deck.png')}/>
              <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/phone/ultraviolet/50/3498db'}}/>
                <TextInput style={styles.inputs}
                    placeholder="Teléfono"
                    keyboardType="phone-pad"
                    underlineColorAndroid='transparent'
                    value={this.phone}
                    onChangeText={(phone) => MessengerStore.setAuxPhone(phone)}/>
              </View>
            
              <View style={styles.inputContainer}>
                <Image style={styles.inputIcon} source={{uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db'}}/>
                <TextInput style={styles.inputs}
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    value={this.password}
                    onChangeText={(password) => MessengerStore.setAuxPassword(password)}/>
              </View>
              
              <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.handleLogin()}>
                <Text  style={styles.loginText}>Iniciar Sesión</Text>
              </TouchableHighlight>
            </KeyboardAvoidingView>
          </Row>
        </Grid>
      </Container>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginTop:60,
    width:280,
    borderRadius:6,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  delivery_icon:{
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom:0,
  }
});