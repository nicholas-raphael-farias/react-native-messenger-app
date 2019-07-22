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

import AppHeader from './app/components/AppHeader';
import TestHeader from './app/components/TestHeader';
import HistoryHeader from './app/components/HistoryHeader';
import SignIn from './app/screens/SignIn';
import Tasklist from './app/screens/Tasklist';
import TaskDetail from './app/screens/TaskDetail';
import HistoryTaskDetail from './app/screens/HistoryTaskDetail';
import History from './app/screens/History';
import Main from './app/screens/Main';
import Settings from './app/screens/Settings';
import NewPassword from './app/screens/NewPassword';

const StackTasklist = createStackNavigator({
  Tasklist: {
    screen: Tasklist,
    navigationOptions: {
      headerLayoutPreset: 'center',
      header: props => <TestHeader {...props} />
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


const HistoryStackTasklist = createStackNavigator({
  History: {
    screen: History,
    navigationOptions: {
      headerLayoutPreset: 'center',
      header: props => <HistoryHeader {...props} />
    }
  },
  HistoryTaskDetail: {
    screen: HistoryTaskDetail,
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
  'Historial': HistoryStackTasklist,
  'Ajustes': {screen: Settings},
  'Cerrar Sesion': {screen: Main,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: "locked-closed",
    }),
  },
});

const AuthenticationNavigator = createSwitchNavigator({
  Home: {
    screen: SignIn,
  },
  Main: MainNavigator,
  NewPassword: {
    screen: NewPassword,
  },
});

const AppContainer = createAppContainer(AuthenticationNavigator);
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