import React, {Component} from 'react';
import {Platform, StyleSheet, View, Linking} from 'react-native';
import { Button, Text } from 'native-base';
import MessengerStore from '../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';


const ChangeStateButton = (props) => {
  return(
    <Button block success onPress={props.function}>
      <Text>{props.text}</Text>
    </Button>
  );
};

@observer
class TaskDetail extends React.Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;
    this.state = {
      task: navigation.getParam('task', 'NO-TASK'), //! Agregar request para obtener la info mas actualizada de la task del API
    };
    this.startTask = this.startTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
  }


  @computed get taskButton(){
    return MessengerStore.selectedTask;
  }

  async completeTask(){
    await MessengerStore.changeState(this.state.task['id'], 3);
  }

  async startTask(){ 
    await MessengerStore.changeState(this.state.task['id'], 2);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>ID: {this.taskButton.id}</Text>
        <Text>Cliente: {this.taskButton.attrs.recipient}</Text>
        <Text>Direccion de entrega: {this.taskButton.attrs.address}</Text>

        <Button block success   onPress={() => { Linking.openURL(`http://maps.google.com/?daddr=${this.taskButton.attrs.address}`)}}>
          <Text>map</Text>
        </Button>

        <Button block success   onPress={() => { Linking.openURL(`tel:${this.taskButton.attrs.phone}`)}}>
          <Text>telefono</Text>
        </Button>

        <Button block success   onPress={() => { Linking.openURL(`sms:${this.taskButton.attrs.phone}`)}}>
          <Text>sms</Text>
        </Button>

        {this.taskButton.state === 1  ? <ChangeStateButton text='iniciar tarea' function={() => this.startTask()} /> : <ChangeStateButton text='completar tarea'  function={() => this.completeTask()}   />}
      </View>
    );
  }

}

export default TaskDetail;