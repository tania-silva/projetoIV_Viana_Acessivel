import React, {useEffect,useState } from "react";
import AsyncStorage  from '@react-native-community/async-storage'; // shared- perferences armazenamento local
import { StyleSheet,Text, TouchableOpacity, View, Image, Modal, Pressable} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo
import * as geolib from 'geolib';

let trajetosS = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=StartPoint&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';
let start = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=StartPoint&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';
let end = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=EndPoint&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';

let valores = [];
let dataI= [];
let ponto;


//Tipos de matriz
let matriz;         //Mais apropriado
let matrizC;        //Mais curta
let matrizT;        //Mais rápida
let matrizD;        //Menos Declive
let matrizE;        //Matriz Euclidiana

function Info({route, navigation}){
    const {param1} = route.params; //categoria escolhida anteriormente
    const [data, setData] = useState([]); //Array para armazenar os valores do Json
    const [color, setColor]=useState("");
    const [incapacidade, setIncapacidade]=useState("");
  
  const [startP, setStartP]= useState();
  const [endP, setEndP]= useState();
  const [numI, setNumI] = useState();
  const [modalVisible, setModalVisible] = useState(false); // MODAL

  

  let arrayEnd=[];

//VERIFICAR SE EXITEM DADOS GUARDADOS NA STORAGE
    const readData = async () => {
      try {
          const inc = await AsyncStorage.getItem('TIPO_UTL');
          const cl = await AsyncStorage.getItem('COLOR');
        if (cl !== null) {
          setColor(cl);
          setIncapacidade(inc);
        }
      } catch (e) {
        alert('Failed to fetch the data from storage')
        console.log(e + 'erro em categoria');
      }
    };
    
          useEffect(() => {
          fetch('https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/1/query?where=1%3D1+and+OBJECTID%3D'+param1+'&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=OBJECTID+%2CCATEGORIA%2C+FOTO%2C+DESCRICAO%2C+DESIGNACAO%2C+TELEFONE+%2CPonto&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson')
          .then((response) => response.json())
          .then((responseJson) => {
            setData(responseJson.features);
  
          })
          .catch((error) => console.error(error));
          readData();
        }, []);


  //------------------------------------------------------------------Criação da matriz------------------------------------------------------------
  useEffect(() => {
    fetch(trajetosS)
    .then(response => response.json())
    .then(data => {
      dataI = data.features;  
      setNumI(data.features.length);     
  
    }).finally(()=> getEndPoint());
    }, []);
  
  getEndPoint = () =>{
    fetch(end)
      .then(response => response.json())
      .then(data => {
        setEndP(data.features);               //Array que guarda todos os dados
      }).finally(()=> getStartPoint())  
  }
  
  
  getStartPoint = () =>{
    fetch(start)
    .then(response => response.json())
    .then(data => {
      setStartP(data.features);   
        //Array que guarda todos os dados
    }).finally( ()=> criarMatriz()) ;
  }
  
  
  criarMatriz = () =>{
  
  //StartPoints 
      for(let i= 0; i< startP.length; i++){
        valores.push(startP[i].attributes.StartPoint);
      }
  
  //Add endPoints
  for(let j=0; j <endP.length; j++){
      let existe = false;
      for(let x=0; x< valores.length; x++){
  
          if(endP[j].attributes.EndPoint == valores[x]){
              existe = true;
          }
      }
  
      if(existe == false){
          valores.push(endP[j].attributes.EndPoint);
          arrayEnd.push(endP[j].attributes.EndPoint); //Array com os endpoints que são StartPoints
      }
  }
  
  let num = valores.length;

  matriz= Array(num).fill(null).map(() => Array(num).fill(0));
  matrizC= Array(num).fill(null).map(() => Array(num).fill(0));
  matrizD= Array(num).fill(null).map(() => Array(num).fill(0));
  matrizT= Array(num).fill(null).map(() => Array(num).fill(0));
  matrizE= Array(num).fill(null).map(() => Array(num).fill(0));

  //preencherMatriz StartPoitns
  for(let a=0; a< numI; a++){
  var start = dataI[a].attributes.StartPoint;
  var end = dataI[a].attributes.EndPoint;
  var peso;  //Trajeto Adequado
  var inc;   //Incapacidade Utl

  //----------Matrizes Adicionais
  var comprimento;
  var tempo;
  var declive;

  //---------------------------------------Incapacidade do utilizador--------------------------------------------
 if(incapacidade == "Invisual"){
    inc = dataI[a].attributes.Invisual
  }else{
    inc = dataI[a].attributes.Autismo
  }

  if(incapacidade == "MobReduzida"){
    peso = dataI[a].attributes.MobReduzida;
    if(peso == 3){
      peso = 10000;
    }
    if(peso == 4){
      peso = 200;
    }
    if(peso == 5){
      peso = 1;
    }
}


  //Definir peso
  if(incapacidade == "Autismo" ||incapacidade == "Invisual"){
  if(inc == 0){
    peso =100000
  }else if(inc == 1){
    peso = 10000;
  }else if(inc == 2){
    peso = 5000;
  }else if(inc == 3){
    peso = 1000;
  }else if(inc == 4){
    peso = 200;
  }else if(inc == 5){
    peso = 1;
  }
}
 
//-----------------------------------Comprimento do trajeto----------------------------------------
comprimento = dataI[a].attributes.compriment

//--------------------------------------Tempo do trajeto------------------------------------------
tempo = dataI[a].attributes.minutes

//--------------------------------------Declive do trajeto------------------------------------------
declive = dataI[a].attributes.declive

//------------------------------------------Distância Euclidiana---------------------------------------
let tamanho = dataI[a].geometry.paths[0].length; 

dist = geolib.getDistance(
  { latitude: dataI[a].geometry.paths[0][0][1], longitude: dataI[a].geometry.paths[0][0][1]},
  { latitude: dataI[a].geometry.paths[0][tamanho-1][1], longitude: dataI[a].geometry.paths[0][tamanho-1][0] }
);


  iStart= valores.indexOf(start);
  iEnd= valores.indexOf(end);


  
  for(let b=0; b<arrayEnd.length; b++){ //
    if(end == arrayEnd[b]){
      matriz[iEnd][iStart] = peso;
   
      matrizC[iEnd][iStart] = comprimento;

      matrizT[iEnd][iStart] = tempo;

      matrizD[iEnd][iStart] = declive;

      matrizE[iEnd][iStart] = dist;
    }else{
      matriz[iStart][iEnd] = peso;
      matriz[iEnd][iStart] = peso;
      
      matrizC[iStart][iEnd] = comprimento;
      matrizC[iEnd][iStart] = comprimento;

       
      matrizT[iStart][iEnd] = tempo;
      matrizT[iEnd][iStart] = tempo;

      matrizD[iStart][iEnd] = declive;
      matrizD[iEnd][iStart] = declive;
      
      matrizE[iStart][iEnd] = dist;
      matrizE[iEnd][iStart] = dist;

    }
  }
  }

  }  
    return(
      
        <View 
        style= {{ 
        flex:1, 
        backgroundColor: color,
        justifyContent: "center"}}>
           <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Escolher tipo de Trajeto:</Text>
                    

                    <Pressable
                      style={[styles.button, {backgroundColor: color}]}
                      onPress={() => {setModalVisible(false) ;navigation.navigate('teste', {matriz: matriz, valores: valores, incapacidade: incapacidade, allData: dataI, end: ponto})}}>
                      <Text style={styles.textStyle}>Trajeto mais Adequado</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, {backgroundColor: color}]}
                      onPress={() => {setModalVisible(false) ;navigation.navigate('teste', {matriz: matrizT, valores: valores, incapacidade: incapacidade, allData: dataI, end: ponto})}}>
                      <Text style={styles.textStyle}>Trajeto mais Rápido</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, {backgroundColor: color}]}
                      onPress={() => {setModalVisible(false) ;navigation.navigate('teste', {matriz: matrizD, valores: valores, incapacidade: incapacidade, allData: dataI, end: ponto})}}>
                      <Text style={styles.textStyle}>Menor declive</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, {backgroundColor: color}]}
                      onPress={() => {setModalVisible(false); navigation.navigate('teste', {matriz: matrizC, valores: valores, incapacidade: incapacidade, allData: dataI, end: ponto})}}>
                      <Text style={styles.textStyle}>Trajeto mais curto (distancia real)</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.button, {backgroundColor: color}]}
                      onPress={() => {setModalVisible(false); navigation.navigate('teste', {matriz: matrizE, valores: valores, incapacidade: incapacidade, allData: dataI, end: ponto})}}>
                      <Text style={styles.textStyle}>Trajeto mais curto (euclideano)</Text>
                    </Pressable>
                    
                    
                    <Pressable
                      style={[styles.cancel]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text>Cancelar</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

         <FlatList 
         data= {data}
         renderItem={({item})=> (
           
           <View style={styles.cartoes}>
               <Text style={styles.title}>{item.attributes.DESIGNACAO}</Text>
               {(() =>{ 
               ponto = item.attributes.Ponto;
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
               <Text style= {{marginStart:wp('7%'), marginBottom:15}}>
                <Text style={styles.texto}>Tipo: </Text>
                <Text style={{fontSize: 18}}>{item.attributes.CATEGORIA}</Text>
               </Text>
              
              <Text style= {{marginStart: wp('7%'), marginBottom: 15}}>
                <Text style={styles.texto}>Telefone: </Text>
                {(() =>{ 
               if(item.attributes.TELEFONE === null) {
                 return(
                  <Text style={{fontSize: 18}}>Sem informação</Text>
                 );
               }else{
                 return(
                  <Text style={{fontSize: 18}}>{item.attributes.TELEFONE}</Text>
                 );
               }
               
                })()}
             
              </Text>
                
              <Text style={{marginStart:wp('7%'), color:'black', fontSize:18, fontWeight: 'bold'}}>Descrição: </Text>
              {(() =>{ 
               if(item.attributes.DESCRICAO === null) {
                 return(
                  <Text style={{fontSize: 18, width:395, height:150, paddingStart:30, paddingEnd:30}}>Sem informação</Text>
                 );
               }else{
                 return(
                  // <ScrollView  style={{width:wp('100%'), height:115, paddingStart:wp('7%'), paddingEnd:wp('7%')}} pagingEnabled={true}>
                
                    <Text style= {{paddingStart:wp('7%'), paddingEnd:wp('7%'), marginBottom: 15,  fontSize: 18, justifyContent: 'center', textAlign: 'justify', lineHeight: 30}}>{item.attributes.DESCRICAO}</Text>
                    
                // </ScrollView>
                 );
               }
               
                })()}

           </View>
         )} 
         keyExtractor= {item =>(item.attributes.OBJECTID).toString()}
         />
        <TouchableOpacity style={{marginTop: 10,marginStart: 140, marginEnd: 150}} onPress={() => setModalVisible(true)}>
                <Image source={require('menu/images/ir.png')} style={styles.ir} /> 
        </TouchableOpacity>
        </View>
    );
            
    
}


const styles = StyleSheet.create({
  // -- MODAL --
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "black",
    textAlign: "center"
  },
  modalText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center"
  },

  cancel: {

    marginTop: 15,
    alignSelf: "flex-end"
  },
// ------------
    ir:{
      width: 110,
      height: 100
    },

    cartoes:{
      flex:1,
      flexDirection:"column",
    },

    image:{
      marginStart: 30,
      marginEnd: 30,
      marginBottom: 15,
      width: hp('44%'),
      height: wp('50%'),
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: 'white',
    },

    texto:{
      color:'black',
      fontSize:18,
      fontWeight: 'bold',
      margin: 10,
    },

    title:{
      textAlign: 'center',
      marginStart: 30,
      marginEnd: 30,
      marginBottom: 15,
      alignSelf: 'center',
      color:'black',
      fontSize:26,
      fontWeight: 'bold',
      justifyContent:"center",
      margin: 10,
    }
    
  })

export default Info;