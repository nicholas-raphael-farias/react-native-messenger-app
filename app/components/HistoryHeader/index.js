import React, {Component} from 'react';
import {TouchableHighlight, Platform, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Switch } from 'native-base';


class HistoryHeader extends React.Component {
  render() {
    return(
      <Header style={styles.header}>
        <Left style={{flex: 1}}>
          <TouchableOpacity onPress={() => {this.props.navigation.openDrawer();} }>
            <Icon style={styles.icon} name='menu'/>
          </TouchableOpacity>
        </Left>
        <Body style={{flex:1, paddingLeft:16}}>
          <Text style={{fontSize:20, fontWeight: 'bold', color: '#fff'}}>Historial</Text>
        </Body>
        <Right style={{flex:1}}>
          <Text></Text>
        </Right>
      </Header>
      );
  }
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2d2e2c',
  },
  icon:{
    color: '#FFF',
  },
});


export default HistoryHeader;