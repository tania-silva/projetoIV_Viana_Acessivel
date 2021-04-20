import 'react-native-gesture-handler';
import React, { useState,  useEffect } from "react";
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo
import { DrawerActions } from '@react-navigation/native';


//Import das páginas
import menuPrincipal from '../paginas/menuPrincipal';
import categoria from '../paginas/categoria';
import locais from '../paginas/locais';
import info from '../paginas/info';
import disktra from '../paginas/disktra';
import invisuais from '../paginas/invisuais';
import teste from '../paginas/teste';



const Stack = createStackNavigator();


function stackP() {
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

            if(inc == 'Invisual'){
              setIni("invisuais");
            }else if(inc == "MobReduzida" || inc == "Autista"){
              setIni("menuPrincipal");
            }
      
        }else{
          setColor(cl);
    
        }
        setLoad(false);
      } catch (e) {
        alert('Failed to fetch the data from storage')
        console.log(e + 'erro no menu principal')
      }
     
    };
    

    if(isLoad){
        return(
          <View style={styles.containerLoading}>
            <Image style={styles.transicao} source={require('../images/transe.jpg')} />
          </View>
        );
      }else{
    return(
        <Stack.Navigator initialRouteName= {ini}>
        <Stack.Screen
        name="menuPrincipal"
        component={menuPrincipal}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <Image style={styles.imagens} source={require('../images/burguer.png')} />
            </TouchableOpacity>          ),
          headerTitle: styles.headerTitle,
          headerTitle: () => (
            <View>
            <TouchableOpacity style={styles.botoes} onPress={() =>  navigation.navigate('categoria')}>
              <Text style={styles.btnText}>Escolha o seu destino</Text>
            </TouchableOpacity>
            </View>
          ),
          
        })} />

        

        <Stack.Screen 
        name="categoria"
        component={categoria}
        options={{title: 'Escolha a categoria'}}
        />

        <Stack.Screen 
        name="locais"
        component={locais}
        options={{title: 'Locais de interesse'}}
        />

        <Stack.Screen
        name="info"
        component={info}
        options={
          {
           title: 'Informação do local'
          }
        }
        />

        <Stack.Screen
                  name="disktra"
                  component={disktra}
                  options={
                    {
                    title: 'A sua Rota'
                    }
                  }
          />

        <Stack.Screen
                  name="teste"
                  component={teste}
                  options={
                    {
                    title: 'A sua Rota'
                    }
                  }
          />
            
        <Stack.Screen
             name="invisuais"
             component={invisuais}
             options={({ navigation }) => ({
              headerStyle: {
                backgroundColor: color,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Image style={styles.imagens} source={require('../images/burguer.png')} />
                </TouchableOpacity>
              ),
              headerLeftContainerStyle: styles.headerLeft,
              headerTitle: styles.headerTitle,
              headerTitle: () => (
                <View>
                <TouchableOpacity style={styles.botoes} onPress={() =>  navigation.navigate('categoria')}>
                  <Text style={styles.btnText}>Escolha o seu destino</Text>
                </TouchableOpacity>
                </View>
              ),
              
            })}   
          />

        </Stack.Navigator>

    );
}
}

const styles = StyleSheet.create({
    transicao:{
      //...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    }, 

    headerTitle: {
      alignSelf:'center',
      alignContent:'center',
      alignItems: 'center',
    },

    headerLeft: {
        alignSelf: "center",    //Colocar os botões no centro do layout
        justifyContent: "center",
        alignItems:'center',
        marginLeft: 10,
    },

    imagens: {
      marginLeft: 10,
      width: 25, 
      height: 25
    },


    containerLoading:{
      ...StyleSheet.absoluteFillObject,
        height: '100%',
    },

    botoes: {
      
       borderRadius:20,
        backgroundColor:'black',
        alignSelf: "center",
        justifyContent:"center",
        alignItems:"center",
        width: wp('50%'),
        height: hp('5.5%'),
        
        
    },

    btnText: {
      color: "white",
      fontSize: 17,
      fontWeight: "bold",
      justifyContent: "center",
      textAlign: "center",
    },
  });

export default stackP;