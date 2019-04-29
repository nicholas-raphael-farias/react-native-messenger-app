import React, {Component} from 'react';
import { Container, List, ListItem, Text} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, ScrollView, Image } from 'react-native';

import MessengerStore from './../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';

@observer
class History extends React.Component {

  @computed get taskHistory(){
    let deliveries = MessengerStore.taskHistory;
    console.warn('updating history');
    let deliveriesList = deliveries.map(delivery => {
      if (delivery.tasks) {
        return(delivery.tasks.map(task => 
          <ListItem style={styles.listItem} onPress={() => {
            MessengerStore.setSelectedHistoryTask(task);
            this.props.navigation.navigate('HistoryTaskDetail', {task: task});
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


  render() {
    return (

     <Container style={styles.container}>
        <Grid style={{marginLeft: 0, paddingLeft: 0}}>
          <Col style={{marginLeft: 0, paddingLeft: 0}}>
            {this.taskHistory}
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

export default History;