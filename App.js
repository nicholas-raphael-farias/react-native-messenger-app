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

import { Provider } from "mobx-react";
import stores from "./app/stores";

import AppHeader from './app/components/AppHeader';
import TestHeader from './app/components/TestHeader';
import SignIn from './app/screens/SignIn';
import Tasklist from './app/screens/Tasklist';
import TaskDetail from './app/screens/TaskDetail';
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
  TaskDetail: {screen: TaskDetail},
});

const MainNavigator = createDrawerNavigator({
  'Lista de Tareas': StackTasklist,
  'Historial': {screen: History},
  'Ajustes': {screen: Settings},
  Main: {screen: Main},
});

const AuthenticationNavigator = createSwitchNavigator({
  Main: MainNavigator,
  Home: {
    screen: SignIn,
  },
  NewPassword: {
    screen: NewPassword,
  },
});

const AppContainer = createAppContainer(AuthenticationNavigator);
export default class App extends React.Component {
  render() {
    return(
      <Provider {...stores}>
        <AppContainer/>
      </Provider>
    );
  }
}