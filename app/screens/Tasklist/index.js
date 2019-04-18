import React, {Component} from 'react';
import {TouchableHighlight, Platform, StyleSheet, View, Header, FlatList} from 'react-native';
import { Container, Content, List, ListItem, Text } from 'native-base';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

const NotActiveMessage = () => (
  <View style={{alignItems: 'center', justifyContent: 'center'}}>
    <Text style={{width: 328}}>Activate para reportar tu posición y ver una lista de tus tareas asignadas. Tu posición no sera monitoreada mientras no estes activado</Text>
  </View>
);

@observer
class Tasklist extends React.Component {
  constructor(props){
    super(props);
  }

  @computed get deliveries(){
    const deliveries = MessengerStore.deliveries;
    let deliveriesList = deliveries.map(delivery => {
      if (delivery.tasks) {
        return(delivery.tasks.map(task => 
          <ListItem   onPress={() => {
            MessengerStore.setSelectedTask(task);
            this.props.navigation.navigate('TaskDetail', {task: task,});
          }}>
          <Text>{task.attrs.address}</Text>
          <Text>{task.attrs.recipient}</Text>
          </ListItem>
        ));
      }
    });
    return (<List>{deliveriesList}</List>);
  }

  @computed get onDutyStatus() {
    return MessengerStore.onDuty;
  }

  render() {
    return (
      <Container>
        <Content>
          {this.onDutyStatus ? this.deliveries : <NotActiveMessage/>}
        </Content>
    </Container>
    );
  }
}

export default Tasklist;