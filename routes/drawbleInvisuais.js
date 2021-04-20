import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';


import stackP from './stackP';
import sobre from '../paginas/sobre';
import menuIncapacidade from '../paginas/menuIncapacidade';

const Drawer = createDrawerNavigator();

export default function Drawble({navigation}){
return(
  <Drawer.Navigator>
      <Drawer.Screen name="stackP" component={stackP}/>
      <Drawer.Screen name="menuIncapacidade" component={menuIncapacidade}/>
      <Drawer.Screen name="sobre" component={sobre}/>   
  </Drawer.Navigator>
);

}