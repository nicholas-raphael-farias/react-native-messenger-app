import React, {Component} from 'react';
import { Container, List, ListItem, Text, Body, Left, Right} from 'native-base';
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

  isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
      }
    return true;
  }

  @computed get reminders(){
    let reminders = MessengerStore.reminders
    let filters = MessengerStore.filters
    let result = []

    if (filters.length > 0) {
        result = 
          filters.reduce((accumulator, currentValue, currentIndex, array) => {
            let filtered = []
            switch (currentValue.type) {
              case 1:
                filtered = 
                  reminders.filter(r => 
                  r.d.getDate() === currentValue.date.getDate() &&
                  r.d.getMonth() === currentValue.date.getMonth() &&
                  r.d.getYear() === currentValue.date.getYear())
                break;
              case 2:
                if(currentValue.final_date == null){
                  console.warn("es null")
                 
                } else {
                  console.warn("es not null")
                   filtered = reminders.filter(
                    r => r.d.getTime() >= currentValue.initial_date.getTime() &&
                    r.d.getTime() <= currentValue.final_date.getTime())
                }
                break;
              case 3:
                filtered = reminders.filter(
                  r => r.d.getMonth() === currentValue.date.getMonth())
                break;
              case 4:
                filtered = reminders.filter(
                  r => r.d.getYear() === currentValue.date.getYear())
                break;
              case 5:
                filtered = reminders.filter(
                  r => r.type === currentValue.filter_type)
                break;
              default:
                break;
            }
            accumulator = accumulator.concat(filtered)
            return accumulator
          },[])

        //console.warn("result")
        //console.warn(result)
    } else {
      result = reminders
    }







    let deliveriesList = result.map(reminder => {
      return(
        <ListItem style={styles.listItem} onPress={() => {
          MessengerStore.setSelectedReminder(reminder)
          this.props.navigation.navigate('Detalle', {reminder: reminder})
        }}>
          <Body>
            <Text style={styles.listText}>{reminder.type}</Text>
            <Text note>{reminder.status}</Text>
          </Body>
          <Right>
            <Text style={styles.listText} note>{reminder.date}</Text>
            <Text style={styles.listText}>{reminder.hour}</Text>
          </Right>

        </ListItem>
      )
    });

    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <List>{deliveriesList}</List>
      </ScrollView>
    );
  }

  @computed get onPositionUpdate() {
    let position = MessengerStore.locationResponseTest;
    return (this.isEmpty(position) ? <Text>Vacio</Text> : <Position position={position}/>);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Grid style={{}}>
          {//<Row style={styles.titleContainer}>
            //<Text style={styles.listTitle}>Lista de tareas</Text>
            //</Row>
          }
          <Row>
            <Col style={{}}>
              {this.reminders}
            </Col>
          </Row>
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
    borderColor: '#494c47',
    height: 80,
  },
  listText:{
    color: 'white',
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
  },
  titleContainer:{
    marginLeft: 0, 
    paddingLeft: 0,
    paddingTop:8,
    paddingBottom:8,
    alignItems: 'center',
    justifyContent: 'center', 
    height:40,
  },
  listTitle:{
    color: "#FFF",
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Tasklist;