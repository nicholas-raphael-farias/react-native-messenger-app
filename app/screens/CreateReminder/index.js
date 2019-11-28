import React, {Component} from 'react';
import { Container, Content, Form, Item, Text, Label, Input, Badge, Button} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MessengerStore from './../../stores/MessengerStore.js';
import AgendaPicker from './../../components/AgendaPicker'
import {computed} from 'mobx';
import {observer} from 'mobx-react';

const getMonth = (month) => {
  switch (month) {
    case 0:
      return "Enero"
      break;
    case 1:
      return "Febrero"
      break;
    case 2:
      return "Marzo"
      break;
    case 3:
      return "Abril"
      break;
    case 4:
        return "Mayo"
        break;
    case 5:
        return "Junio"
        break;
    case 6:
      return "Julio"
      break;
    case 7:
      return "Agosto"
      break;
    case 8:
      return "Septiembre"
      break;
    case 9:
      return "Octubre"
      break;
    case 10:
      return "Noviembre"
      break;
    case 11:
      return "Diciembre"
      break;
    default:
      break;
  }
}

@observer
class CreateReminder extends React.Component {


  @computed get date(){
    let date = MessengerStore.date;
    return `${date.getDate()} de ${getMonth(date.getMonth())}`
  }

  @computed get time(){
    let time = MessengerStore.time;
    return `${time.getHours()}:${time.getMinutes() === 0 ? "00" : time.getMinutes()}`
  }

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <Grid>
            <Row style={styles.titleContainer}>
              <Text style={styles.listTitle}>Crear Recordatorio</Text>
            </Row>
          </Grid>
          <DateTimePickerModal
            isVisible={MessengerStore.modals.date_modal}
            mode="date"
            onConfirm={(date) => {
              MessengerStore.changeValue("date", date)
              MessengerStore.changeModalVisibility("date_modal", false)
            }}
            onCancel={() => MessengerStore.changeModalVisibility("date_modal", false)}
            />
              
          <DateTimePickerModal
            isVisible={MessengerStore.modals.time_modal}
            mode="time"
            onConfirm={(date) => {
              MessengerStore.changeValue("time", date)
              MessengerStore.changeModalVisibility("time_modal", false)
            }}
            onCancel={() => MessengerStore.changeModalVisibility("time_modal", false)}
            />

          <Form>
            <Item picker>
              <AgendaPicker 
                value={MessengerStore.type} 
                onValueChange={(value) => MessengerStore.changeValue("type", value)}
                opts={MessengerStore.type_opts}/>
            </Item>
            <Item onPress={() => MessengerStore.changeModalVisibility("date_modal", true)} last>
              <Badge style={{backgroundColor: 'white', marginTop:12, width:64}}>
                <Text style={{color:"#000"}}>Fecha</Text>
              </Badge>
              <Input style={{color:"white"}} value={this.date} editable={false}/>
            </Item>
            <Item onPress={() => MessengerStore.changeModalVisibility("time_modal", true)} last>
              <Badge style={{backgroundColor: 'white', marginTop:12, width:64}}>
                <Text style={{color:"#000"}}>Hora</Text>
              </Badge>
              <Input style={{color:"white"}} value={this.time} editable={false}/>
            </Item>
            <Item last>
              <Badge style={{backgroundColor: 'white', marginTop:12, width:72}}>
                <Text style={{color:"#000"}}>Desc</Text>
              </Badge>
              <Input style={{color:"#FFF"}} 
              onChangeText={(value) => MessengerStore.changeValue("desc", value)} 
              value={MessengerStore.desc}/>
            </Item>
            <Item picker>
              <AgendaPicker 
                value={MessengerStore.status} 
                onValueChange={(value) => MessengerStore.changeValue("status", value)} 
                opts={MessengerStore.status_opts}/>
            </Item>
            <Item last>
              <Badge style={{backgroundColor: 'white', marginTop:12, width:100}}>
                <Text style={{color:"#000"}}>Ubicacion</Text>
              </Badge>
              <Input style={{color:"#FFF"}}/>
            </Item>
            <Item picker>
              <AgendaPicker 
                value={MessengerStore.contact} 
                onValueChange={(value) => MessengerStore.changeValue("contact", value)} 
                opts={MessengerStore.contacts.map(c => ({label: c.givenName, value: c.recordID}) )}/>
            </Item>
          </Form>
          <Button block light style={{marginTop:100, height:80}} onPress={() => {
            MessengerStore.createReminder()
            this.props.navigation.navigate('Lista de Tareas')
          }}>
            <Text>Crear</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252624',
  },
  formText:{
    color: 'white',
  },
  listTitle:{
    color: "#FFF",
    fontSize: 20,
    fontWeight: 'bold',
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

export default CreateReminder;