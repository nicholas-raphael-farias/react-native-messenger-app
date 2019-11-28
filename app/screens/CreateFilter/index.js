import React, {Component} from 'react';
import { Container,Card, CardItem, Content, Form, Item, Text, Label, Input, Badge, Button} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MessengerStore from './../../stores/MessengerStore.js';
import Modal from "react-native-modal";
import {computed} from 'mobx';
import {observer} from 'mobx-react';

@observer
class CreateFilter extends React.Component {
  render() {
    return(
      <Container style={styles.container}>

            <Modal isVisible={MessengerStore.modals.type_modal}>
              <View style={styles.content}>
                <Text style={styles.contentTitle}>Elegir Tipo</Text> 
                <Button block bordered info style={{marginTop:4}} onPress={() => {
                  MessengerStore.addTypeFilter("cita")
                }}>
                  <Text>Cita</Text>
                </Button>
                <Button block bordered info style={{marginTop:4}} onPress={() => {
                  MessengerStore.addTypeFilter("junta")
                }}>
                  <Text>Junta</Text>
                </Button>
                <Button block bordered info style={{marginTop:4}} onPress={() => {
                  MessengerStore.addTypeFilter("entrega")
                }}>
                  <Text>Entrega</Text>
                </Button>
                <Button block bordered info style={{marginTop:4}} onPress={() => {
                  MessengerStore.addTypeFilter("examen")
                }}>
                  <Text>Examen</Text>
                </Button>
                <Button block bordered info style={{marginTop:4}} onPress={() => {
                  MessengerStore.addTypeFilter("otro")
                }}>
                  <Text>Otro</Text>
                </Button>
              </View>
            </Modal>
          
            <DateTimePickerModal
              isVisible={MessengerStore.modals.filter_day_modal}
              mode="date"
              onConfirm={(date) => {
                MessengerStore.addDayFilter(date)
              }}
              onCancel={() => MessengerStore.changeModalVisibility("filter_day", false)}
            />

            <Button transparent style={{justifyContent:"center"}} onPress={() => {console.warn(MessengerStore.filters)}}>
              <Text style={styles.listTitle}>Crear Filtro</Text>
            </Button>
            <Button style={styles.but} block onPress={() => {
              MessengerStore.changeValue("filter_type", 1)
              MessengerStore.changeModalVisibility("filter_day", true)
            }}>
              <Text>Por Dia</Text>
            </Button>
            <Button style={styles.but} block onPress={() => {
              MessengerStore.changeValue("filter_type", 2)
              MessengerStore.changeModalVisibility("filter_day", true)
            }}>
              <Text>Por rango de dias</Text>
            </Button>
            <Button style={styles.but} block block onPress={() => {
              MessengerStore.changeValue("filter_type", 3)
              MessengerStore.changeModalVisibility("filter_day", true)
            }}>
              <Text>Por Mes</Text>
            </Button>
            <Button style={styles.but} block block onPress={() => {
              MessengerStore.changeValue("filter_type", 4)
              MessengerStore.changeModalVisibility("filter_day", true)
            }}>
              <Text>Por Año</Text>
            </Button>
            <Button style={styles.but} block onPress={() => {
              MessengerStore.changeValue("filter_type", 5)
              MessengerStore.changeModalVisibility("type_modal", true)
            }}>
              <Text>Por Tipo</Text>
            </Button>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252624',
    display:"flex", 
    justifyContent:"space-evenly"
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
  but:{
    backgroundColor:"#4b4d49",
    color:"#ccc",
    height:80,
    marginLeft:16,
    marginRight:16
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
})

export default CreateFilter