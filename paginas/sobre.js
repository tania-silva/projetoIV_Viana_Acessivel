import React, {useEffect,useState } from "react";
import AsyncStorage  from '@react-native-community/async-storage'; // shared- perferences armazenamento local
import { StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo

function Sobre({navigation}){

  const [color, setColor] = useState("");

  useEffect(() =>{
    readData();
  }, []);

  const readData = async () => {
    try {
        const inc = await AsyncStorage.getItem('TIPO_UTL');
        const c = await AsyncStorage.getItem('COLOR');
  
      if (inc !== null) {
       setColor(c);
      }else{
        console.log('não existe');
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
      console.log(e + 'erro no menu principal')
    }
    mudarCor();
  };

    mudarCor= () => {
      navigation.setOptions({ headerStyle: {backgroundColor:color}});
    }

   return(
       <ScrollView style={{backgroundColor: 'white', flex: 1, flexDirection: "column"}}>

        <View style={{flexDirection: 'row'}}> 
          <Image source={require('menu/images/ipvc.png')} style={styles.image}/>
          <Image source={require('menu/images/cmvc.png')} style={{width: 75, height:100, marginStart: 100, marginBottom: 20, marginTop: 10}}/>
        </View>
        

        <Text style={styles.title}>Aplicação desenvolvida pelos alunos da Licenciatura em Engenharia Informática:</Text>
      
        <Text style={styles.nomes}>Bruno Mateus</Text>
        <Text style={styles.nomes}>Carlos Pinheiro</Text>
        <Text style={styles.nomes}>David Verde</Text>
        <Text style={styles.nomes}>Júlio Silva</Text>
        <Text style={styles.nomes}>Ruben Ferreira</Text>
        <Text style={styles.nomes}>Samuel Rodrigues</Text>
        <Text style={styles.nomes}>Tânia Silva</Text>
      

      <Text style={styles.profs}>Supervisão dos Professores:</Text>
      <Text style={styles.nomes}>Sara Paiva</Text>
      <Text style={styles.nomes}>Pedro Castro</Text>
      <Text style={styles.nomes}>Ana Pereira (IPB)</Text>
      <View style={styles.espaco}>

      </View>
      <Text style={styles.title}>Design gráfico efetuado pela aluna do Mestrado de Design do Produto:</Text>
      <Text style={styles.nomes}>Caroline Barbosa</Text>
      <Text style={styles.profs}>Supervisão da Professora:</Text>
      <Text style={styles.nomes}>Ana Curralo</Text>
      
      <View style={styles.espaco}>

      </View>
      <Text style={styles.profs}>Responsavéis pela publicação da App:</Text>
      <Text style={styles.nomes}>David Verde</Text>
      <Text style={styles.nomes}>Helder Gonçalves</Text>
      <Text style={styles.nomes}>Tânia Silva</Text>

      <View style={styles.espaco}>

      </View>
      <Text style={styles.profs}>Font Awesome Icons</Text>
      <Text style={styles.nomes}>Licença: creativecommons.org/licenses/by/4.0/</Text>
      
      </ScrollView>
   );
}


const styles = StyleSheet.create({
    
    nomes:{
      marginStart: 30, 
      marginBottom: 10,
      fontSize: 16,
    },

    image:{
     width: hp('17%'),
     height: wp('12%'),
     marginStart: 40,
     marginTop: 40,
    },

    texto:{
      color:'black',
      fontSize:18,
      fontWeight: 'bold',
      margin: 10,
    },

    title:{
        alignSelf: 'center',
        textAlign: 'justify',
        color:'black',
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent:"center",
        marginStart: 30,
        marginEnd: 30,
        marginTop: 5,
        marginBottom: 10,
    },

    profs:{
        textAlign: 'left',
        color:'black',
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent:"center",
        marginStart: 30,
        marginEnd: 30,
        marginTop: 10,
        marginBottom: 10,
    },
    espaco: {
      padding: 20,
    }
    
  })

export default Sobre;