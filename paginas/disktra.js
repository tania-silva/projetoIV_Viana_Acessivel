import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from "@react-native-community/geolocation";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Button, PermissionsAndroid, ActivityIndicator, } from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, Polyline, LatLng} from "react-native-maps";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo
import * as geolib from 'geolib';

let caminho = [];
let cores = [];

function disktra({route, navigation}) {

const {end} = route.params;
const {matriz} = route.params
const {valores} = route.params
const {incapacidade} = route.params
const {allData} = route.params

let dist;
let dist_end;
let bestDist = 4000; // guarda o numero em metro do StartpOINT MAIS PROXIMO DO UTILIZADOR
let start; // guarda o startpoint mais proximo do utilizador


let caminhos;   //Guarda todos os caminhos que o Dijkstra percorre 
let resultado   //Guarda o caminho mais curto 
let pontos = [];    //Guarda os pontos do caminho
let subarrayColor = [];  //Guarda as cores dos caminhos
let path = [];           //Coordenadas de todos os pontos

const [color, setColor] = useState("");
const [type, setType] = useState(1);

const [isLoad, setLoad]= useState(true);

useEffect(() =>{
    mudarCor();
    criarGrafos()
  }, []);


  const [initialPosition, setInitialPosition] = useState({
    latitude: 41.6946,
    longitude: -8.83016,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  //Marcador
  const [markerPositon, setMarkerPosition] = useState({
    latitude: 41.693447,
    longitude: -8.846955,
  });


  const handleSucess = positions => {
    var lat = parseFloat(positions.coords.latitude)
    var long = parseFloat(positions.coords.longitude)

    var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    }

    setInitialPosition(initialRegion);
    setMarkerPosition(initialRegion);
};

const handleError = error => {setError(error.message)};


useEffect(() => {
  const WatchId = Geolocation.watchPosition(handleSucess, handleError);
  console.log("aqui")
  return () => Geolocation.clearWatch(WatchId);        
}, []);

  mudarCor= () => {
    navigation.setOptions({ headerStyle: {backgroundColor:color}});
  }



criarGrafos = () => {
setLoad(false)
console.log("Inicio Dikjstra "+ Date.now());
  //-----------------------------StartPoint mais próximo da localização do utilizador---------------------------------------------------------
  
  for(let x=0; x<allData.length; x++){ // Ver qual o StartPoint mais proximo do utilizador

    let tamanho = allData[x].geometry.paths[0].length; // tamanho de array paths para chegar ao endpoint (length -1)

    dist = geolib.getDistance(
              { latitude: markerPositon.latitude, longitude: markerPositon.longitude },
              { latitude: allData[x].geometry.paths[0][0][1], longitude: allData[x].geometry.paths[0][0][0] }
          );
    dist_end = geolib.getDistance(
              { latitude: markerPositon.latitude, longitude: markerPositon.longitude },
              { latitude: allData[x].geometry.paths[0][tamanho-1][1], longitude: allData[x].geometry.paths[0][tamanho-1][0] }
          );

    if(dist<bestDist){
      bestDist = dist;
      start = allData[x].attributes.StartPoint;
    }
    if(dist_end<bestDist){
      bestDist = dist_end;
      start = allData[x].attributes.EndPoint;
    }

  } 
  console.log("bestDist: " + bestDist + " Start: " + start + "EndPoint:"+ end); 
  iStart= valores.indexOf(1285);
  iEnd= valores.indexOf(1254);
 


  var distances = [];

  for (var i = 0; i < matriz.length; i++) distances[i] = Number.MAX_VALUE;
  distances[iStart] = 0;


  var visited = [];    //Guardar os nos que já foram visitados
  caminhos= Array(valores.length).fill(''); //Definir o array caminho como vazio
  let n  = 0;
  while (true) {
      // ... find the node with the currently shortest distance from the start node...
      var shortestDistance = Number.MAX_VALUE;
      var shortestIndex = -1;
      for (var i = 0; i < matriz.length; i++) {
          //... by going through all nodes that haven't been visited yet
          if (distances[i] < shortestDistance && !visited[i]) {
              shortestDistance = distances[i];
              shortestIndex = i;
              n++;
          }
      }

      // console.log("Visiting node " + shortestDistance + " with current distance " + shortestDistance);

      if (shortestIndex === -1) {
          // There was no node not yet visited --> We are done
          return distances;
      }else if (shortestIndex === iEnd) { 
        
        resultado= caminhos[shortestIndex].split(",")

            for(var i= 0; i<resultado.length; i ++){
               pontos.push(valores[resultado[i]])
            }

          console.log("Fim Dikjstra " + Date.now());
          console.log("Nº de iterações: " + n)
          console.log("Custo"+ distances[shortestIndex])
          criarPolyline(pontos)
          return distances[shortestIndex];  
      }

      //...then, for all neighboring nodes....
      for (var i = 0; i < matriz[shortestIndex].length; i++) {
          //...if the path over this edge is shorter...
          if (matriz[shortestIndex][i] !== 0 && distances[i] > distances[shortestIndex] + matriz[shortestIndex][i]) {
              //...Save this path as new shortest path.
              distances[i] = distances[shortestIndex] + matriz[shortestIndex][i];

              if(caminhos[shortestIndex] == ""){
                // console.log("Entrei pela primeira vez")
                caminhos[i] = shortestIndex+","+i

                // console.log(caminhos[i]);
            }else{
                // console.log("Entrei pela segunda ou terceira vez")
                caminhos[i] = caminhos[shortestIndex]+","+i
                // console.log(caminhos[i])
            }
              // console.log("Updating distance of node " + i + " to " + distances[i]);
          }
      }
      // Lastly, note that we are finished with this node.
      visited[shortestIndex] = true;
      // console.log("Visited nodes: " + visited);
      // console.log("Currently lowest distances: " + distances);

  }
}


criarPolyline = (pontos) =>{
  console.log(pontos)
  
  
  for(var i = 0; i < allData.length; i ++){
    var inc;
  
  for(var j= 0; j<pontos.length -1; j++){
      let start = pontos[j];
      let end = pontos[j+1];
  
      
      if((allData[i].attributes.StartPoint == start && allData[i].attributes.EndPoint == end) || (allData[i].attributes.StartPoint == end && allData[i].attributes.EndPoint == start) ){
         
  
          var arrayPaths = allData[i].geometry.paths[0];
          var subarray = [];
         
     
          if(incapacidade == "MobReduzida"){
              if(allData[i].attributes.MobReduzida == 3){
                subarrayColor.push("#0000cc");
              }
              if(allData[i].attributes.MobReduzida == 4){
                subarrayColor.push("#00cccc");
              }
              if(allData[i].attributes.MobReduzida == 5){
                subarrayColor.push("#00cc00")
              }
            }
            
              //Incapacidade do utilizador
              if(incapacidade == "MobReduzida"){
                  inc = allData[i].attributes.MobReduzida
              }else if(incapacidade == "Invisual"){
                  inc = allData[i].attributes.Invisual
              }else{
                  inc = allData[i].attributes.Autismo
              }
  
  
            if(incapacidade == "Autismo" ||incapacidade == "Invisual"){
              if(inc == 0){
                subarrayColor.push("black");
              }
              if(inc ==  1){
                subarrayColor.push("#cc0000");
              }
              if(inc ==  2){
                subarrayColor.push("#cc00cc");
              }
              if(inc ==  3){
                subarrayColor.push("#0000cc");
              }
              if(inc ==  4){
                subarrayColor.push("#00cccc");
              }
              if(inc ==  5){
                subarrayColor.push("#00cc00");
              }
          }
              arrayPaths.map(item => {
                  subarray.push({latitude:  item[1] , longitude: item[0]},);         
                })
  
                 path.push(subarray);
            
      }
  
  }
    
  }
  
  console.log(path);
  console.log(subarrayColor);
  
  caminho= path;
  cores=subarrayColor;

  }

if(isLoad){
    return(
      <View>
        <ActivityIndicator
        size="large"
        color="yellow"/>
        <Text>Carregando</Text>
      </View>
    );
  }else{
return(
    <View style={styles.container}> 
                        
                        <MapView provider={PROVIDER_GOOGLE}
                          style={styles.map}
                          region={initialPosition}> 
                           {console.log("Inicio Polyline: "+ Date.now())}
                            {caminho.map((seila, index) =>{
                           
                           return(
                              <Polyline
                              key={index}
                              coordinates={caminho[index]}
                              strokeColor= {cores[index]} 
                              
                              strokeWidth={6}
                            /> )
                        
                            })
                          
                            }
                             {console.log("Fim Polyline:  "+ Date.now())}

                            <Marker coordinate={markerPositon} pinColor= 'green'>
                            </Marker>    
                              
                          </MapView>
                     
                       
                    

              {(() =>{ if((type == 2 && incapacidade == "Autismo") || (type == 2 && incapacidade == "Invisual")){
                            return(
                              <View style= {styles.legenda} >
                                <Text style= {{color: 'black', fontSize: 16}}>Excluir</Text>
                                <Image source={require('menu/images/legenda_6.png')} style= {{marginLeft: 15, marginRight: 15}}/> 
                                <Text style= {{color: 'black', fontSize: 16}}>Excelente</Text>
                              </View>
                            );
                }else if(type == 2 && incapacidade == "MobReduzida"){
                  return(
                    <View style= {styles.legenda} >
                      <Text style= {{color: 'black', fontSize: 16}}>Não Aconselhado</Text>
                      <Image source={require('menu/images/legenda_1.png')} style= {{marginLeft: 5, marginRight: 5}}/> 
                      <Text style= {{color: 'black', fontSize: 16}}>Aconselhado</Text>
                    </View>
                  );
                }
               })()}

    </View>
);

}





} 

const styles = StyleSheet.create({
  image:{
    width: 50,
    height: 50,
    },

  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: wp('2%'),
    height: hp('15%'),
    width: wp('55%'),
    textAlign: 'center',
  },
    texto: {
      fontSize:15,
      fontWeight: 'bold',
      margin: 5,
      alignSelf: 'center',
      color: "white",
    },
    containerLoading:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },

    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
    },

    map: {
      position:'absolute',
        ...StyleSheet.absoluteFillObject,
    },

    callout: {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: "bold",
    },
    arrow:{
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderTopColor: '#fff',
      borderWidth: 16,
      alignSelf: 'center',
      marginTop: -32,
    },

    arrowBorder:{
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderTopColor: '#007aB7',
      borderWidth: 16,
      alignSelf: 'center',
      marginTop: -0.5,
    },
 
    botoes: {
        alignSelf: "center",    //Colocar os botões no centro do layout
        borderColor:'#D0EAF5',
        alignItems:'center',
        width:45,
        height:45,
        backgroundColor:'#fff',
        borderRadius: 30,
    },

    botaoC: {
      alignSelf: "center",    //Colocar os botões no centro do layout
      borderColor:'#D0EAF5',
      alignItems:'center',
      width:45,
      height:45,
      borderRadius: 50,
      backgroundColor: 'rgba(0,0,0,.6)'
     },

    imagens: {
      width:40,
      height: 40,
      borderRadius:20,
    },

    clicado:{
      width:40,
      height: 40,
      borderRadius:20,
      opacity: 0.5,
    },

    espaco: {
      padding: 5,
    },

    legenda: {
      height: hp('5.5%'),
      width: wp('100%'),
      marginTop: hp('84.5%'),
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'row',
      backgroundColor: 'white',
      borderColor: '#757575',
      borderWidth: 2,
    },
});

export default disktra;