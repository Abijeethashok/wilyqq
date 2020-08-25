import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createAppContainer, NavigationActions, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import Booktransactionscreen from './screens/Booktr'
import Searchscreen from './screens/Searchscreen'
import LoginScreen from './screens/LoginScreen'

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    )
  }
}

const Tabnavigator = createBottomTabNavigator({
  Transaction : {screen : Booktransactionscreen},
  Search : {screen : Searchscreen},

},
{defaultNavigationOptions : ({navigation})=>({
tabBarIcon : ({}) =>{
  const routename = navigation.state.routeName
  if (routename === 'Transaction'){
    return(
      <Image source = {require('./assets/book.png')}
      style = {{width: 40,height:40}}></Image>
    )
  }
  else if(routename === 'Search'){
    return(
      <Image source = {require('./assets/searchingbook.png')}
      style = {{width: 40,height:40}}></Image>
    )
  }
}
})})

const SwitchNavigator  =  createSwitchNavigator({
  LoginScreen : {screen : LoginScreen},Tabnavigator:{screen:Tabnavigator}
})



const AppContainer = createAppContainer(SwitchNavigator)     