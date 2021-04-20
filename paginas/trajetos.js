import AsyncStorage from "@react-native-community/async-storage";
import Geolocation from "@react-native-community/geolocation";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image,  ActivityIndicator, } from "react-native";
import MapView, {Callout, Marker, PROVIDER_GOOGLE, Polyline, LatLng} from "react-native-maps";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'; //Ecrã responsivo
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTaxi, faMapMarkerAlt, faRoute, faParking} from '@fortawesome/free-solid-svg-icons';

function trajetos(){
return(
    <View>
        <Text>tRAJETOS</Text>
    </View>
)
}

export default trajetos;