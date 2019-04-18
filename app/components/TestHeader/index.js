import React, {Component} from 'react';
import {TouchableHighlight, Platform, StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Switch } from 'native-base';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

@observer
class TestHeader extends React.Component {

  @computed get onDutyStatus() {
    return MessengerStore.onDuty;
  }

  constructor(props){
    super(props);
    this.changeStatusDuty = this.changeStatusDuty.bind(this);
  }

  changeStatusDuty(new_value){
    MessengerStore.changeDutyStatus(new_value);
  }

  render() {
    return(
      <Container>
        <Header style={styles.header}>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => {this.props.navigation.openDrawer();} }>
              <Icon style={styles.icon} name='menu'/>
            </TouchableOpacity>
          </Left>
          <Body style={{flex:1, paddingLeft:56}}>
            <Switch
              value={this.onDutyStatus} 
              thumbColor={this.onDutyStatus ? '#1f8cce' : '#3e3f3d'}
              onValueChange={this.changeStatusDuty}/>
          </Body>
          <Right style={{flex:1}}>
            <Text></Text>
          </Right>
        </Header>
      </Container>
      );
  }
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2d2e2c',
  },
  icon:{
    color: '#FFF',
  }
});

export default TestHeader;