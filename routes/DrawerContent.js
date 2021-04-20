import * as React from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import{ useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Alert } from "react-native";
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faInfoCircle, faUser, faMapMarkerAlt, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo




export function DrawerContent(props){
const [color, setColor] = useState('pink');
const [incapacidade, setIncapacidade]=useState('');

useEffect(() =>{
    readData();
}, []);
    
   const readData = async () => {
        try {
            const inc = await AsyncStorage.getItem('TIPO_UTL');
            const c = await AsyncStorage.getItem('COLOR');
      
          if (inc !== null) {
           setColor(c);

           if(inc =="MobReduzida"){
            setIncapacidade("Mobilidade Reduzida");
           }else if(inc =="Invisual"){
            setIncapacidade("Visão nula ou reduzida");
           }else if(inc =="Autismo"){
            setIncapacidade("Perturbação do espetro do autismo");
           }
          
    
           console.log("Cor" + c);
           console.log("Inc"+inc);
          }else{
            console.log('não existe');
          }
        } catch (e) {
          alert('Failed to fetch the data from storage')
          console.log(e + 'erro no menu principal')
        }
  
      };
    
  

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
           <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <Image source={require('menu/images/ipvc.png')} style={styles.image} />
                        <Image source={require('menu/images/cmvc.png')} style={{width: 65, height:90}}/>
                    </View>
                    <View style={styles.incapacidade}>
                        <Text style={{ color:'black', fontSize: 18, fontWeight: 'bold'}}>{incapacidade}</Text>
                    </View>                    
                </View>
                <View>
                <DrawerItem 
                icon ={({color, size})=> (
                       <FontAwesomeIcon icon={faMapMarkerAlt} size={25} color={'black'}/>
                    )}
                    label='Menu Principal'
                    onPress={() => {props.navigation.navigate('stackP')}}
                >

                </DrawerItem>
                <DrawerItem
                icon ={({color, size})=> (
                       <FontAwesomeIcon icon={faUser} size={25} color={'black'}/>
                    )}
                    label='Menu Incapacidade'
                    onPress={() => {props.navigation.navigate('menuIncapacidade')}}
                >

                </DrawerItem>

                <DrawerItem
                icon ={({color, size})=> (
                       <FontAwesomeIcon icon={faQuestionCircle} size={25} color={'black'}/>
                    )}
                    label='Sobre'
                    onPress={() => {props.navigation.navigate('sobre')}}
                >

                </DrawerItem>
                </View>
           </DrawerContentScrollView>
        
                <DrawerItem
                icon ={({color, size})=> (
                       <FontAwesomeIcon icon={faInfoCircle} size={30} color={'black'}/>
                    )}
                    label='Informação'
                    onPress={() =>
                        Alert.alert('Aviso','Mensagem de aviso!',
                            [ {text: 'Concordo'}],
                            { cancelable: false }
                        )
                      }
                >

                </DrawerItem>
     
        </View>
    );
}


const styles = StyleSheet.create({
    drawerContent: {
        flex:1
    },

    userInfoSection: {
        flexDirection:"row",
        justifyContent: "center",
        alignItems: "center"
    },

    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold'
    },

    caption:{
        fontSize: 14,
        lineHeight:14,
    },
    row:{
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },

    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },

    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        marginBottom: 'row',
        borderTopColor: 'pink',
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    },

    
    image:{
        width: hp('12%'),
        height: wp('7%'),
        marginRight: 20
       },

    incapacidade: {
        marginTop: 20,
        padding: 50,
        alignItems:"center",
        justifyContent: "center"
    }
});