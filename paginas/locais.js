import React, {useEffect,useState } from "react";
import AsyncStorage  from '@react-native-community/async-storage'; // shared- perferences armazenamento local
import { StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo


function Locais({route, navigation}){
    const {param1} = route.params; //categoria escolhida anteriormente
    const [data, setData] = useState([]); //Array para armazenar os valores do Json
    const [color, setColor]=useState("");

    let n = 0;
    

    useEffect(() => {
        fetch('https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/1/query?where=1%3D1+and+CATEGORIA%3D%27'+param1+'%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=OBJECTID+%2CCATEGORIA%2C+FOTO%2C+DESCRICAO%2C+DESIGNACAO&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson')
        .then((response) => response.json())
        .then((responseJson) => {
            setData(responseJson.features); 
        })
        .catch((error) => console.error(error));
        readData();
      }, []);


//VERIFICAR SE EXITEM DADOS GUARDADOS NA STORAGE
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

    return(
        <View 
        style= {{ 
        flex:1, 
        backgroundColor: color,
        justifyContent: "center"}}>
         <FlatList 
         data= {data}
         renderItem={({item})=> (
           <View>
              <TouchableOpacity style={styles.espaco}>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartoes} onPress={() => navigation.navigate('info', {param1: item.attributes.OBJECTID})} >
              <View style={styles.areaI}>
              {(() =>{ 
               if(item.attributes.FOTO === null) {
                 return(
                    <Image style={styles.image} source={require('menu/images/default.png')}/>
                 );
               }else{
                 return(
                    <Image style={styles.image} source={{uri: item.attributes.FOTO}}/>
                 );
               }
               
                })()}
              </View>
              
              <View style= {styles.areaT}>
              <Text style={styles.title}>{item.attributes.DESIGNACAO}</Text>
              </View>
              </TouchableOpacity>
           </View>
         )} 
         keyExtractor= {item =>(item.attributes.OBJECTID).toString()}
         />
        
        </View>
    );

}

const styles = StyleSheet.create({
  espaco: {
    padding:11,
  },
  cartoes:{
    height: hp('30%') ,
    width: wp('80%'),
    alignSelf: 'center',
    alignItems: "center",
    backgroundColor: "white",
    flexDirection:"column",
    borderColor: "black",
    borderRadius: 20,
    borderColor: 'black',
  },
  image:{
    width: wp('90%'),
    height: hp('29%'),
    borderRadius: 20
  },

  title:{
      margin: 15,
      color:'white',
      fontSize:20,
      justifyContent:"center",
  },

  areaT: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    justifyContent: 'center',
    height: hp('4%'),
    width: wp('90%'),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  areaI: {
    height: hp('22%') ,
    width: wp('90%'),
  }
})

export default Locais;