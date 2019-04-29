import React, {Component} from 'react';
import {Platform, StyleSheet, View, Linking, Image, TouchableOpacity} from 'react-native';
import { Button, Text, Header, Body, Switch} from 'native-base';
import MessengerStore from '../../stores/MessengerStore.js';
import {computed} from 'mobx';
import {observer} from 'mobx-react';
import { Col, Row, Grid } from "react-native-easy-grid";


const SuccededLabel = () => (
  <Text style={styles.taskSucceded}>Exitoso</Text>  
);

const FailedLabel = () => (
  <Text style={styles.taskFailed}>Fallido</Text>
);


@observer
class HistoryTaskDetail extends React.Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;
    this.state = {
      task: navigation.getParam('task', 'NO-TASK'), //! Agregar request para obtener la info mas actualizada de la task del API
      testState: 1,
      wasCorrectlyFinished: true,
    };
  }


  @computed get selectedTask(){
    console.warn(MessengerStore.selectedHistoryTask);
    return MessengerStore.selectedHistoryTask;
  }

  render() {
    return (
      <View style={styles.container}>
        <Grid>
          <Row style={{height:88, marginTop:24, marginLeft:0, paddingLeft: 24 ,borderBottomColor: '#494c47', borderBottomWidth: 1}}>
            <Col>
              <Text style={styles.taskAddress}>{this.state.task.attrs.address}</Text>
              <Text style={styles.taskAddress}>{this.state.task.attrs.recipient}</Text>
            </Col>
            <Col style={{ width: 80 }} onPress={() => Linking.openURL(`http://maps.google.com/?daddr=${this.state.task.attrs.address.replace(' ','+')}`)}>
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
          
          <Row style={{ marginLeft:0, paddingLeft: 24, marginTop: 40}}>
            <Text style={styles.taskTitle}>Estado de terminacion: {'\n'}
              {this.state.task.succeded ? <SuccededLabel/> : <FailedLabel/>}
            </Text>
          </Row>

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

export default HistoryTaskDetail;