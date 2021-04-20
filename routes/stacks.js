/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useState,  useEffect } from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import {View, StyleSheet, Image} from 'react-native';


//Import das páginas
import menuIncapacidade from '../paginas/menuIncapacidade';
import drawble from './drawble';


const Stack = createStackNavigator();


function Stacks(){


  const [color, setColor] = useState('white');
  const [ini, setIni]= useState("");
  const [isLoad, setLoad]= useState(true);

 
  useEffect(() =>{
    readData();
  }, []);

//VERIFICAR SE EXITEM DADOS GUARDADOS NA STORAGE
  const readData = async () => {
    try {
        const inc = await AsyncStorage.getItem('TIPO_UTL');
        const cl = await AsyncStorage.getItem('COLOR');
  
      if (inc !== null) {
        setIni("drawble");
        setColor(cl);
    
      }else{
        setIni("menuIncapacidade");
        setColor(cl);
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')

    }
    setLoad(false);
  };

  if(isLoad){
    return(
      <View style={styles.containerLoading}>
        <Image style={styles.transicao} source={require('../images/transe.jpg')} />
      </View>
    );
  }else{
    return(
      <NavigationContainer>
      <Stack.Navigator initialRouteName = {ini}>
      <Stack.Screen
            name="menuIncapacidade"
            component={menuIncapacidade}
            options={{
              title: 'Selecione a sua incapacidade',
              headerLeft: null }}
           />

            <Stack.Screen
                name="drawble"
                component={drawble}
                options={{headerShown: false,}}
            />

      </Stack.Navigator>   
  </NavigationContainer>
    );
      }
 }

   
  const styles = StyleSheet.create({
    transicao:{
      //...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    }, 

    containerLoading:{
      ...StyleSheet.absoluteFillObject,
        height: '100%',
    },

  });


export default Stacks;