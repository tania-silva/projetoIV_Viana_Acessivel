import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import stackP from './stackP';
import sobre from '../paginas/sobre';
import menuIncapacidade from '../paginas/menuIncapacidade';
import {DrawerContent} from './DrawerContent';

const Drawer = createDrawerNavigator();


export default function Drawble(){
return(

  <Drawer.Navigator  drawerContent={props => <DrawerContent {...props}/>}>
      <Drawer.Screen name="stackP" component={stackP} />
      <Drawer.Screen name="menuIncapacidade" component={menuIncapacidade} options={{title: 'Indique a sua condição', headerShown:true}}/>
      <Drawer.Screen name="sobre" component={sobre} options={{title: 'Sobre', headerShown:true, headerTintColor:"black"}}/>   
  </Drawer.Navigator>
);

}