/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {TouchableHighlight, Platform, StyleSheet, Text, View, StatusBar} from 'react-native';

import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, createAppContainer } from "react-navigation";
import {Root} from "native-base";
import { Provider } from "mobx-react";
import stores from "./app/stores";

import AgendaHeader from './app/components/AgendaHeader';
import Tasklist from './app/screens/Tasklist';
import TaskDetail from './app/screens/TaskDetail';
import CreateReminder from './app/screens/CreateReminder';
import CreateFilter from './app/screens/CreateFilter'
import ReminderDetail from './app/screens/ReminderDetail'



const StackTasklist = createStackNavigator({
  Tasklist: {
    screen: Tasklist,
    navigationOptions: {
      headerLayoutPreset: 'center',
      header: props => <AgendaHeader {...props} />
    }
  },
  TaskDetail: {
    screen: TaskDetail,
    navigationOptions: ({ navigation }) => ({
      title: `Tarea ${navigation.state.params.task.id}`,
      headerStyle: {backgroundColor: '#2d2e2c'},
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#fff',
      },
    }),
  },
});


const MainNavigator = createDrawerNavigator({
  'Lista de Tareas': StackTasklist,
  'Formulario': CreateReminder,
  'Filtros': CreateFilter,
  'Detalle': ReminderDetail,
  });

const AppContainer = createAppContainer(MainNavigator);
export default class App extends React.Component {
  render() {
    return(
      <Provider {...stores}>
        <Root>
          <AppContainer/>
        </Root>
      </Provider>
    );
  }
}