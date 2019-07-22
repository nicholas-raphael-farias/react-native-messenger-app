import React, {Component} from 'react';
import {Platform, StyleSheet, View, Linking, Image, TouchableOpacity} from 'react-native';
import { Button, Text, Header, Body, Switch} from 'native-base';
import MessengerStore from '../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import { Col, Row, Grid } from "react-native-easy-grid";


const StartTaskContainer = (props) => (
  <Row style={{marginTop:176, height:48}}>
    <Col style={{paddingLeft: 16, paddingRight: 16}}>
      <Button block success onPress={props.startTask}>
        <Text>Iniciar Tarea</Text>
      </Button>
    </Col>
  </Row>
);


const CompleteTaskContainer = (props) => (
  <Grid>
    <Row style={{ marginLeft:0, paddingLeft: 24, marginTop: 40}}>
      <Text style={styles.taskTitle}>Estado de terminacion: {'\n'}
        {props.wasCorrectlyFinished ? <SuccededLabel/> : <FailedLabel/>}
      </Text>
      <Switch
        style={{position: 'absolute', left: 192, top: 3 }}
        value={props.wasCorrectlyFinished} 
        thumbColor={props.wasCorrectlyFinished ? '#5cb85c' : 'red'}
        onValueChange={props.changeEndingTaskState}/>
    </Row>

    <Row style={{marginBottom:16, height:48}}>
      <Col style={{paddingLeft: 16, paddingRight: 16}}>
        <Button block success onPress={props.completeTask}>
          <Text>Completar Tarea</Text>
        </Button>
      </Col>
    </Row>
  </Grid>
);

const SuccededLabel = () => (
  <Text style={styles.taskSucceded}>Exitoso</Text>  
);

const FailedLabel = () => (
  <Text style={styles.taskFailed}>Fallido</Text>
);

@observer
class TaskDetail extends React.Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;
    this.state = {
      task: navigation.getParam('task', 'NO-TASK'), //! Agregar request para obtener la info mas actualizada de la task del API
      testState: 1,
      wasCorrectlyFinished: true,
    };
    this.startTask = this.startTask.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.changeEndingTaskState = this.changeEndingTaskState.bind(this);
    this.startTaskTest = this.startTaskTest.bind(this);
    this.completeTaskTest = this.completeTaskTest.bind(this);
  }


  @computed get selectedTask(){
    console.warn(MessengerStore.selectedTask);
    return MessengerStore.selectedTask;
  }

  @computed get messengerVehicle(){
    const vehicleIndex = MessengerStore.messenger.vehicle;
    let vehicleString;
    if (vehicleIndex === "0") {
      vehicleString="walking";
    } else if (vehicleIndex === "1") {
      vehicleString="bicycling";
    } else {
      vehicleString="driving";
    }
    return vehicleString;
  }

  async completeTask(){
    await MessengerStore.changeState(this.state.task['id'], 3);
    if(!this.state.wasCorrectlyFinished){
      MessengerStore.changeSuccessStatus(this.state.task['id']);
    }
    this.props.navigation.goBack();
  }

  async startTask(){ 
    console.warn(this.state.task['id']);
    await MessengerStore.changeState(this.state.task['id'], 2);
  }

  changeEndingTaskState(newValue){
    this.setState({wasCorrectlyFinished: newValue});
  }


  startTaskTest(){
    this.setState({testState: 2});
  }

  completeTaskTest(){
    this.setState({testState: 3});
  }

  render() {
    return (
      <View style={styles.container}>
        <Grid>
          <Row style={{height:88, marginTop:24, marginLeft:0, paddingLeft: 24 ,borderBottomColor: '#494c47', borderBottomWidth: 1}}>
            <Col>
              <Text style={styles.taskAddress}>{this.state.task.attrs.address}</Text>
            </Col>
            <Col style={{ width: 80 }} onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${this.state.task.attrs.address.replace(' ','+')}&travelmode=${this.messengerVehicle}`)}>
              <TouchableOpacity>
                <Image 
                  style={styles.listIcon} 
                  source={require('./img/up-arrow.png')}
                />
              </TouchableOpacity>
            </Col>
          </Row>
          <Row style={styles.notesCol}>
            <Text style={styles.taskTitle}>Notas: {'\n'}
              <Text style={styles.taskAddress}>{this.state.task.attrs.notes}</Text>
            </Text>
          </Row>
          <Row style={{height:56}}>
            <Col style={styles.buttonCol}>
              <Button 
                onPress={() => { Linking.openURL(`tel:${this.state.task.attrs.phone}`)}}
                style={styles.taskButton} 
                block>
                <Text>Llamar</Text>
              </Button>
            </Col>
            <Col style={styles.buttonCol}>
              <Button 
                onPress={() => { Linking.openURL(`sms:${this.state.task.attrs.phone}`)}}
                style={styles.taskButton} 
                block>
                <Text>Enviar SMS</Text>
              </Button>
            </Col>
          </Row>

          {this.state.task.state === 1 ? <StartTaskContainer startTask={this.startTask}/> :
            <CompleteTaskContainer 
            wasCorrectlyFinished={this.state.wasCorrectlyFinished} 
            changeEndingTaskState={this.changeEndingTaskState}
            completeTask={this.completeTask}
            />
          }

        </Grid>
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
    marginLeft:0, 
    paddingLeft: 24, 
    paddingTop:16, 
    height:104,
  },
});

export default TaskDetail;