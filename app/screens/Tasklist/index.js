import React, {Component} from 'react';
import { Container, List, ListItem, Text} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

// Try removing the `flex: 1` on the parent View.
// The parent will not have dimensions, so the children can't expand.
const NotActiveMessage = () => (
  <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
    <Text style={{width: 328, color: '#ffffff'}}>Activate para reportar tu posición y ver una lista de tus tareas asignadas. Tu posición no sera monitoreada mientras no estes activado</Text>
  </View>
);


@observer
class Tasklist extends React.Component {

  componentDidMound(){
    const locationPermition = MessengerStore.locationPermition;
    if (!locationPermition) {
      MessengerStore.requestLocationPermission()
    }
  }

  isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
      }
    return true;
  }

  @computed get deliveries(){
    let deliveries = MessengerStore.deliveries;

    let deliveriesList = deliveries.map(delivery => {
      if (delivery.tasks) {
        return(delivery.tasks.map(task => 
          <ListItem style={styles.listItem} onPress={() => {
            MessengerStore.setSelectedTask(task);
            this.props.navigation.navigate('TaskDetail', {task: task});
          }}>
            <Image 
              style={styles.listIcon} 
              source={ 
                task.state === 0 ? 
                require('./img/assigned_task.png') : 
                require('./img/started_task.png')
              }
            />
            <Text 
              numberOfLines={1} 
              style={styles.listAddress}>
              {task.attrs.address}
            </Text>
            <Text style={styles.listText}>
              Entregar con: {task.attrs.recipient}
            </Text>
          </ListItem>
        ));
      }
    });

    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <List>{deliveriesList}</List>
      </ScrollView>
    );
  }

  @computed get onDutyStatus() {
    return MessengerStore.onDuty;
  }

  @computed get onPositionUpdate() {
    let position = MessengerStore.locationResponseTest;
    return (this.isEmpty(position) ? <Text>Vacio</Text> : <Position position={position}/>);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Grid style={{marginLeft: 0, paddingLeft: 0}}>
          <Col style={{marginLeft: 0, paddingLeft: 0}}>
            { MessengerStore.onDuty ? this.deliveries : <NotActiveMessage/> }
          </Col>
        </Grid>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252624',
  },
  listItem:{
    marginLeft: 0,
    paddingLeft: 40,
    borderColor: '#494c47',
    height: 80,
  },
  listText:{
    color: 'white',
    position: 'absolute',
    top:40,
    left:48,
  },
  listAddress:{
    color: 'white',
    position: 'absolute',
    top:16,
    left:48,
    width: 290,
  },
  listIcon:{
    position: 'absolute',
    top:30,
    left:16,
    width:16,
    height:16,
  }
});

export default Tasklist;