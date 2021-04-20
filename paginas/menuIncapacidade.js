import React, { Component ,useEffect,useState } from "react";
import AsyncStorage  from '@react-native-community/async-storage'; // shared- perferences armazenamento local
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator} from "react-native";
import {StackActions} from '@react-navigation/native';


function MenuIncapacidade({navigation}) {
  const [isLoad, setLoad]= useState(true);

  //ARMAZENAR O TIPO DE INCAPACIDADE
    storeData = async (key,valor) => {
      try {
        await AsyncStorage.setItem( key, valor);
  
        
      } catch (error) {
        console.log('erro menu incapacidade não sei pq')
      }
    };

    useEffect(() => {
        setLoad(false); //Carregamento da página
        console.log(isLoad + "Aqui menu incapacidade");
    }, []);



    if(isLoad){
      return(
        <View style={styles.containerLoading}>
          <ActivityIndicator
          size="large"
          color="yellow"/>
          <Text>Carregabdo</Text>
        </View>
      );
    }else{
    return (
      <View style={styles.container}>
        
       <TouchableOpacity style={styles.invisual}  onPress={ () => {this.storeData('COLOR', '#DBDBDB'); this.storeData('TIPO_UTL', 'Invisual');  navigation.dispatch(StackActions.replace('drawble'));}}>
          <Image source={require('menu/images/cego.png')} style={styles.image} /> 
          <Text style={styles.text}>Pessoas com visão nula ou reduzida</Text>
        </TouchableOpacity>
  
  
        <TouchableOpacity style={styles.cadeirante}  onPress={ () => {this.storeData('COLOR', '#D4E6C0'); this.storeData('TIPO_UTL', 'MobReduzida');  navigation.dispatch(StackActions.replace('drawble'));}}> 
         <Image source={require('menu/images/cadeira_rodas.png')} style={styles.image} /> 
          <Text style={styles.text}>Pessoas com cadeira de rodas</Text> 
        </TouchableOpacity>

  
        <TouchableOpacity style={styles.surdo} onPress={() => {this.storeData('COLOR', '#E0B9D8'); this.storeData('TIPO_UTL', 'MobReduzida');  navigation.dispatch(StackActions.replace('drawble'));}}>
         <Image source={require('menu/images/surdos.png')} style={styles.image} /> 
          <Text style={styles.text}>Pessoas com surdez</Text>
        </TouchableOpacity>
  
        
  
        <TouchableOpacity style={styles.autismo} onPress={() => {this.storeData('COLOR', '#F9DDC2'); this.storeData('TIPO_UTL', 'Autismo'); navigation.dispatch(StackActions.replace('drawble'));}}>
         <Image source={require('menu/images/autismo.png')} style={styles.image} /> 
          <Text style={styles.text}>Pessoas com Perturbação do Espetro do Autismo (PEA)</Text>
        </TouchableOpacity>
  
  
        <TouchableOpacity style={styles.gravidas} onPress={() => {this.storeData('COLOR', '#F9D1E1'); this.storeData('TIPO_UTL', 'MobReduzida');  navigation.dispatch(StackActions.replace('drawble'));}}>
         <Image source={require('menu/images/gravidacriancas.png')} style={styles.image} /> 
          <Text style={styles.text}>Grávidas,pessoas com carrinhos de bébé ou crianças pequenas</Text>
        </TouchableOpacity>
  
       
  
        <TouchableOpacity style={styles.idosos} onPress={() => {this.storeData('COLOR', '#D0EAF5'); this.storeData('TIPO_UTL', 'MobReduzida'); navigation.dispatch(StackActions.replace('drawble'));}}>
        <Image source={require('menu/images/idosos.png')} style={styles.image} /> 
          <Text style={styles.text}>Pessoas idosas ou com mobilidade condicionado</Text>
        </TouchableOpacity>
     
      </View>   
    );
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
      paddingHorizontal: 10  //borda de lado 
    },
  
    image:{
      width: 70,
      height: 70
      },
  
    invisuais:{
      width: 55,
      height: 55
    },

     text:{
      flex:3,
      color:'black',
      fontSize:15,
      paddingStart:15
     },
  
    cadeirante: {
      alignItems: "center",
      padding: 5, //altura da view
      backgroundColor: "#D4E6C0",
      flexDirection: 'row'
    },
  
    invisual: {
      alignItems: "center",
      padding: 5, //altura da view
      backgroundColor: "#DBDBDB",
      flexDirection: 'row'
    },
  
    surdo: {
      alignItems: "center",
      padding: 5, //altura da view
      backgroundColor: "#E0B9D8",
      flexDirection: 'row'
    },
  
    autismo: {
      alignItems: "center",
      padding: 5, //altura da view
      backgroundColor: "#F9DDC2",
      flexDirection: 'row'
    },
  
    
    gravidas: {
      alignItems: "center",
      padding: 5, //altura da view
      backgroundColor: "#F9D1E1",
      flexDirection: 'row',
    },
  
    idosos: {
      alignItems: "center",
      padding: 5, //altura da view
      backgroundColor: "#D0EAF5",
      flexDirection: 'row',
    },
   
  });


export default MenuIncapacidade;