import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ListStackParamList } from './src/types/navigation';

import CreateScreen from './src/screens/CreateScreen';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import RecycleTestComponent from './src/screens/Sample';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<ListStackParamList>();

function ListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen
          name="Cargos"
          component={ListStack}
          options={{ headerShown: false }}
        />
        {/*  <Tab.Screen
          name="sample"
          component={RecycleTestComponent}
          options={{ headerShown: false }}
        /> */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
