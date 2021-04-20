import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from "@react-native-community/geolocation";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image,  ActivityIndicator, Alert, SafeAreaView } from "react-native";
import MapView, {Callout, Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTaxi, faMapMarkerAlt, faRoute, faParking} from '@fortawesome/free-solid-svg-icons';
import {PermissionsAndroid} from 'react-native';


let markerURL= 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';
let markerTaxi = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';
let markerEstacionamento= 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';



let trajetosS = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=StartPoint&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';
let start = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=StartPoint&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';
let end = 'https://geo.cm-viana-castelo.pt/arcgis/rest/services/Viana_acessivel/MapServer/4/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=EndPoint&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=true&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=false&datumTransformation=&parameterValues=&rangeValues=&f=pjson';

let caminho=[];
let cores=[];
let matriz;
let valores = [];
let dataI= [];

function menuPrincipal({navigation}) {
  const [state, setState] = useState({colorId: 1});
  const [color, setColor] = useState("");

  const [incapacidade, setIncapacidade] = useState("");


  const [isLoad, setLoad]= useState(true);
  const [type, setType] = useState(1);

  const [startP, setStartP]= useState();
  const [endP, setEndP]= useState();
  // const [dataI, setDataI]= useState();
  const [numI, setNumI] = useState();
  let alertShow=0;


  let arrayEnd=[];

  
let path = [];
let subcor = [];
let subarrayPaths = [];


const [loadP, setLoadP] = useState(false);

startLoading = () => {
  setLoadP(true);
  setTimeout(() => {
    setLoadP(false);
  }, 500);
};
//------------------------------------------------------------------Permissão Localização----------------------------------------------------------
const [granted,setGranted] = useState('');




const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Example App',
        'message': 'Example App access to your location '
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
    } else {
      console.log("location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }

}




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
      pesquisarEstradas();

        //Array que guarda todos os dados
     }).finally( ()=> criarMatriz()) ;
  }
  
  
  // Criar a matriz
  criarMatriz = () =>{
    console.log("Inicio Matriz " + Date.now());
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
  

  //preencherMatriz StartPoitns
  for(let a=0; a< numI; a++){
  var start = dataI[a].attributes.StartPoint;
  var end = dataI[a].attributes.EndPoint;
  var peso;
  var inc;
 
  //Incapacidade do utilizador
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
 
  iStart= valores.indexOf(start);
  iEnd= valores.indexOf(end);


  
  for(let b=0; b<arrayEnd.length; b++){ //
    if(end == arrayEnd[b]){
      matriz[iEnd][iStart] = peso;
      matriz[iEnd][iStart] = peso;
    }else{
      matriz[iStart][iEnd] = peso;
      matriz[iEnd][iStart] = peso
    }
  }
  }
  console.log("Fim da Matriz " + Date.now());
  setLoad(false);
  }


//---------------------------------------------------------------------Criação da Página-------------------------------------------------------------
  useEffect(() =>{
    requestLocationPermission();
    readData();
    if(alertShow == 0){
      Alert.alert('Aviso','Mensagem de aviso!',
                            [ {text: 'Concordo'}],
                            { cancelable: false }
                        )
      alertShow++;
    }
  }, []);

  const readData = async () => {
    try {
        const inc = await AsyncStorage.getItem('TIPO_UTL');
        const c = await AsyncStorage.getItem('COLOR');
  
      if (inc !== null) {
       setColor(c);
       setIncapacidade(inc);

       console.log(c);
       console.log(inc);
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

   const [error, setError] =useState();

   const [initialPosition, setInitialPosition] = useState({
    latitude: 41.6946,
    longitude: -8.83016,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    });

    //Marcador
    const [markerPositon, setMarkerPosition] = useState({
        latitude: 41.693447,
        longitude: -8.846955,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

      //Marcador
      const [centroViana, setCentroViana] = useState({
        latitude: 41.693978,
        longitude: -8.829216,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });

    const [data, setData] = useState([]);


//Mostar os pontos de interesse sempre que é aberta a app
    useEffect(() => {
      fetch(markerURL)
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson.features)
        setType(1);  //Locais de interesse 
        setLoad(false); //Carregamento da página
        console.log(isLoad + "TOU AQUI");
      })
      .catch((error) => console.error(error))
    }, []);

//Mudar marker conforme o botão selecionado
    listarPontos = (url, valor ) => {
      fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson.features) // mudar a cor do pin
        setType(valor);
      })
      .catch((error) => console.error(error))

    }



  pesquisarEstradas = () => {
   
   
    for(let i = 0; i <numI; i++){
      var peso;
      subarrayPaths = [];
      var subarray= dataI[i].geometry.paths[0]

      if(incapacidade=="MobReduzida"){
        peso= dataI[i].attributes.MobReduzida
      }else if(incapacidade=="Invisual"){
        peso= dataI[i].attributes.Invisual
      }else if(incapacidade=="Autismo"){
        peso = dataI[i].attributes.Autismo
      }


       if(peso == 0){
        subcor.push("black");
       }else if(peso == 1){
        subcor.push("#cc0000");
       }else if(peso == 2){
        subcor.push("#cc00cc");
       }else if(peso == 3){
        subcor.push("#0000cc");
      }else if(peso == 4){
        subcor.push("#00cccc");
      }else if(peso == 5){
        subcor.push("#00cc00");
      }

      subarray.map(item => {
        subarrayPaths.push({latitude:  item[1] , longitude: item[0]},);
        
      })
  
      path.push(subarrayPaths);
 
    }

    caminho = path;
    cores = subcor;

  }

  
  botaoClicado= (i) => {
    setState({colorId: i})
 }

    //Saber a localização do utilizador
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


    //Atualizar a localização do utl
    useEffect(() => {
        const WatchId = Geolocation.watchPosition(handleSucess, handleError);
        return () => Geolocation.clearWatch(WatchId);        
    }, []);



 if(isLoad){
   return(
     <View style={styles.containerLoading}>
       <ActivityIndicator
       size="large"
       color="yellow"/>
       <Text>Carregando</Text>
     </View>
   );
 }else{

    return(

        <View style={styles.container}>

                  {(() =>{ 
                    if(type == 1) {
                      return(
                        <MapView provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={centroViana}>
                        {data.map(marker => ( 
                          
                          
                          <Marker 
                           key={marker.attributes.Ponto}
                           coordinate={{latitude: marker.geometry.y,
                                       longitude: marker.geometry.x}}>
     
                           <Callout tooltip onPress={() => navigation.navigate('teste', {matriz: matriz, valores: valores, incapacidade: incapacidade, allData: dataI, end: marker.attributes.Ponto})}>
                             <View>
                              <View style={styles.bubble}>
                                  <Text style={styles.callout}>{marker.attributes.DESIGNACAO}</Text>
                              </View>

                              <View style={styles.arrowBorder}/>
                              <View style={styles.arrow}/>
                             </View> 
                           </Callout>
                         
                           </Marker>
                         
                         ))
                       }
                         <Marker coordinate={markerPositon}
                         pinColor= 'green'>
                        </Marker>
                        </MapView>
                        

                      );
                    }else if (type == 2) {
                      return(
          
                      
                        <MapView provider={PROVIDER_GOOGLE}
                          style={styles.map}
                          region={centroViana}> 

                            {caminho.map((seila, index) =>{

                                
                                return(
                                  <Polyline
                                  key={index}
                                  coordinates={caminho[index]}
                                  strokeColor= {cores[index]} // fallback for when strokeColors is not supported by the map-provider
                                  
                                  strokeWidth={4}
                                /> ); 

                              })
                              
                              }
                              <Marker coordinate={markerPositon} pinColor= 'green'>
                              </Marker>
                         
                          </MapView>
      
                       );
                    }else if (type == 3) {
                      return(
                        <MapView provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={centroViana}>
                        {data.map(taxi => ( 
                          <Marker 
                          key={taxi.attributes.Ponto}
                          coordinate={{latitude: taxi.geometry.y,
                                      longitude: taxi.geometry.x}}
                                      pinColor= '#ffd54f'>
    
                          <Callout tooltip onPress= {() => navigation.navigate('disktra', {matriz: matriz, valores: valores, incapacidade: incapacidade, allData: dataI, end: taxi.attributes.Ponto})}>
                          <View>
                              <View style={styles.bubble}>
                             <Text style={styles.callout}>{taxi.attributes.RUA}</Text>
                             <Text>
                               <Text style= {{fontSize: 16, fontWeight: 'bold'}}>Lugares: </Text>
                               <Text style={{fontSize: 16}}>{taxi.attributes.LUGARES}</Text>
                             </Text>
                           
                  
                              </View>
                              <View style={styles.arrowBorder}/>
                              <View style={styles.arrow}/>
                             </View> 
                          </Callout>
                          </Marker>
                        ))
                      }
                        <Marker coordinate={markerPositon} pinColor= 'green'>
                        </Marker>

                        </MapView>
                       );
                    }else if ( type == 4){
                      return(
                      <MapView provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      region={centroViana}>
                      {data.map(est => ( 
                        <Marker 
                        key={est.attributes.Ponto}
                        coordinate={{latitude: est.geometry.y,
                                    longitude: est.geometry.x}}
                                    pinColor= 'blue'>
  
                        <Callout tooltip onPress= {() => navigation.navigate('teste', {matriz: matriz, valores: valores, incapacidade: incapacidade, allData: dataI, end: est.attributes.Ponto})}>
                        <View>
                             <View style={styles.bubble}>
                             <Text style={styles.callout}>{est.attributes.RUA}</Text>

                             <Text>
                               <Text style= {{fontSize: 16, fontWeight: 'bold'}}>Lugares: </Text>
                               <Text style={{fontSize: 16}}>{est.attributes.LUGARES}</Text>
                             </Text>
                           
                          
                              </View>
                              <View style={styles.arrowBorder}/>
                              <View style={styles.arrow}/>
                             </View> 
                        </Callout>
                      
                        </Marker>
                      ))
                    }
                        <Marker coordinate={markerPositon} pinColor= 'green'>
                        </Marker>
                      </MapView>
                      );
                    }

                   
                  })()}
                  

                <View style={{backgroundColor: color,  height: hp('7%'), width: wp('100%'), flexDirection: 'row',position:"absolute", bottom:0, alignItems: 'center', alignSelf: "center", justifyContent: 'center' }}>
          
                       
                           <FontAwesomeIcon icon={faMapMarkerAlt} size={30} color={"#d91a20"} style={state.colorId === 1? styles.clicado : styles.botaoC} onPress={ () => {this.listarPontos(markerURL, 1); this.botaoClicado(1);}}/>
                           <FontAwesomeIcon icon={faRoute} size={30} color={"purple"} style={state.colorId === 2? styles.clicado : styles.botaoC}  onPress={ () => {this.startLoading(); setType(2); this.botaoClicado(2);}}/>
                           <FontAwesomeIcon icon={faTaxi} color={"#ebb134"} size={30} style={state.colorId === 3? styles.clicado : styles.botaoC} onPress={ () => {this.listarPontos(markerTaxi, 3); this.botaoClicado(3);}}/>
                           <FontAwesomeIcon icon={faParking} color={"blue"} size={30} style={state.colorId === 4? styles.clicado : styles.parking} onPress={ () => {this.listarPontos(markerEstacionamento, 4); this.botaoClicado(4);}}/>

                </View>
                
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
    alignContent: 'center',
    justifyContent:'center'
  },
    texto: {
      fontSize:15,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: "black",
      marginBottom: 9,
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
      alignContent: 'center',
      justifyContent: 'center'
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
        marginRight:15,
        marginLeft:15,
        marginTop: 3,
    },

    botaoC: {
     margin: 35,
     },
    
     parking: {
      margin: 35,
      borderRadius: 2,
      backgroundColor: "white"
     },

    clicado:{
      margin: 35,
      opacity: 0.7,
      
    },


    legenda: {
      height: hp('5.5%'),
      width: wp('100%'),
      position: "absolute",
      bottom:48,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'row',
      backgroundColor: 'white',
      borderColor: '#757575',
      borderWidth: 2,
    },

    spinnerTextStyle: {
      color: '#FFF',
    },
});

export default menuPrincipal;