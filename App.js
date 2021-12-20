import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './screens/Main';
import Collection from './screens/Collection';
import Item from './screens/Item';
import { useFonts } from 'expo-font';
import Settings from './screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loaded] = useFonts({
    Montserrat: require('./assets/Montserrat-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Collection" component={Collection} />
        <Stack.Screen name="AddCollection" component={Collection} />
        <Stack.Screen name="AddItem" component={Collection} />
        <Stack.Screen name="Item" component={Item} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
