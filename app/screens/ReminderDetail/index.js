import React, {Component} from 'react';
import { StyleSheet, View} from 'react-native';
import { Button, Text, Header, Body, Switch} from 'native-base';
import MessengerStore from '../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import { Col, Row, Grid } from "react-native-easy-grid";
import AgendaPicker from './../../components/AgendaPicker'

@observer
class ReminderDetail extends React.Component {
  constructor(props){
    super(props)
    const { navigation } = this.props
    this.state = {
      reminder: navigation.getParam('reminder', 'NO-TASK'), //! Agregar request para obtener la info mas actualizada de la task del API
    }
    MessengerStore.setSelectedReminder(this.state.reminder)
  }


  @computed get selectedTask(){
    console.warn(MessengerStore.selectedTask);
    return MessengerStore.selectedTask;
  }

  render() {
    return (
      <View style={styles.container}>
        <Grid>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Id: {'\n'}
              <Text style={styles.taskAddress}>{this.state.reminder.id}</Text>
            </Text>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Tipo: {'\n'}
              <Text style={styles.taskAddress}>{this.state.reminder.type}</Text>
            </Text>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Fecha: {'\n'}
              <Text style={styles.taskAddress}>{this.state.reminder.date}</Text>
            </Text>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Hora: {'\n'}
              <Text style={styles.taskAddress}>{this.state.reminder.hour}</Text>
            </Text>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Descripcion: {'\n'}
              <Text style={styles.taskAddress}>{this.state.reminder.desc}</Text>
            </Text>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Estado: {'\n'}</Text>
              <AgendaPicker 
                value={this.state.reminder.status} 
                onValueChange={(value) => MessengerStore.changeStatus(this.state.reminder.id, value)}
                opts={MessengerStore.status_opts}/>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Contacto: {'\n'}</Text>
              <AgendaPicker 
                value={this.state.reminder.contact} 
                onValueChange={(value) => MessengerStore.changeContact(this.state.reminder.id, value)}
                opts={MessengerStore.contacts.map(c => ({label: c.givenName, value: c.recordID}) )}/>
          </Row>
        </Grid>
          <Button block danger onPress={() => {
            MessengerStore.deleteReminder(this.state.reminder.id)
            this.props.navigation.navigate('Lista de Tareas')
          }}>
            <Text>Eliminar</Text>
          </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2d2e2c',
  },
  container: {
    backgroundColor: '#252624',
    flex: 1,
  },
  taskTitle:{
    color: '#a5a5a5',
  },
  taskSucceded:{
    color: '#5cb85c',
    fontWeight: 'bold',
  },
  taskFailed:{
    color: 'red',
    fontWeight: 'bold',
  },
  taskAddress:{
    color: '#fff',
  },
  listIcon:{
    height: 48,
    width: 48,
    position: 'absolute',
    marginTop: 2,
  },
  taskButton:{
    backgroundColor: '#2d2e2c',
  },
  buttonCol:{
    paddingLeft: 16, 
    paddingRight: 16
  },
  notesCol:{
    paddingLeft: 24, 
    paddingTop:16, 
    height:60
  },
});

export default ReminderDetail;