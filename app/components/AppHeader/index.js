import React, {Component} from 'react';
import {TouchableHighlight, Platform, StyleSheet, Text, View, Alert} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';


const ActiveButton = () => (
  <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => MessengerStore.deactivateMessenger()}>
    <Text style={styles.loginText}>Activo </Text>
  </TouchableHighlight>
);

const InactiveButton = () => (
  <TouchableHighlight style={[styles.buttonContainer, styles.inactiveButton]} onPress={() => MessengerStore.activateMessenger()}>
    <Text style={styles.inactiveText}>Inactivo </Text>
  </TouchableHighlight> 
);

@observer
class AppHeader extends React.Component {

  @computed get onDuty() {
    return MessengerStore.onDuty;
  }

  render() {
    return(
      this.onDuty ? <ActiveButton/> : <InactiveButton/>
      );
  }
}


const styles = StyleSheet.create({
  buttonContainer: {
    height:32,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginLeft:'auto',
    marginRight: 'auto',
    alignItems: 'center',
    width:80,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  inactiveButton: {
    backgroundColor: "grey",
  },
  inactiveText: {
    color: 'black',
  },
  loginText: {
    color: 'white',
  }
});

export default AppHeader;