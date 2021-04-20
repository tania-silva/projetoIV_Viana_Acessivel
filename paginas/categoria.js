import React, { Component ,useEffect,useState } from "react";
import AsyncStorage  from '@react-native-community/async-storage'; // shared- perferences armazenamento local
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo
let categorias = "https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=CATEGORIA&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson";

function Categorias({navigation}){
  const [data, setData] = useState([]); //Array para armazenar os valores do Json
  const [color, setColor]=useState("");

  //VERIFICAR SE EXITEM DADOS GUARDADOS NA STORAGE bbbbbb
  const readData = async () => {
    try {
        const cl = await AsyncStorage.getItem('COLOR');
      if (cl !== null) {
        setColor(cl);
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
      console.log(e + 'erro em categoria');
    }
  };
  

        useEffect(() => {
        fetch(categorias)
        .then((response) => response.json())
        .then((responseJson) => {
          setData(responseJson.features);

        })
        .catch((error) => console.error(error));
        readData();
      }, []);

    return(
     <View 
     style= {{ 
     flex:1, 
     backgroundColor: color,
     justifyContent: "center",
     }}>
      <FlatList 
      style= {{marginTop: hp('5%')}}
      data= {data}
      renderItem={({item})=> (
        <View >
          <TouchableOpacity style={styles.espaco}>
            <Text style={{fontSize:22, color: "#fff", fontWeight: 'bold'}}>- - - - - - - - - - - - - - - - - - - - - - -</Text>
          </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('locais', {param1: (item.attributes.CATEGORIA).toString()})}>
            <Text style={styles.texto}>{item.attributes.CATEGORIA}</Text>
        </TouchableOpacity>
        </View>
      )} 
      keyExtractor= {item =>item.attributes.CATEGORIA}
      />
     
     </View>
    );
}

const styles = StyleSheet.create({

    container:{
     position : 'absolute', 
     top : 0, 
     left : 0, 
     right : 0,
     bottom : 0,
    },

    botao: {
      width: wp('90%'),
      alignSelf: 'center',
      justifyContent:"center",
      alignItems:"center",
      padding: 8, //altura da view
      backgroundColor: "black",
      flexDirection: 'row',
      borderRadius:20,
    },

    texto: {
      color:"white",
      fontSize:20 ,
      fontWeight: 'bold',
    },

    lista: {
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },

    espaco: {
      alignSelf: 'center',
      padding:15,
    }

  });

export default Categorias;