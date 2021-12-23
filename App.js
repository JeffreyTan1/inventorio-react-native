import { StatusBar } from 'expo-status-bar';
import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './screens/Main';
import Collection from './screens/Collection';
import { useFonts } from 'expo-font';
import Settings from './screens/Settings';
import { createTables, dropTables } from './utils/DAO';
import { Provider as PaperProvider } from 'react-native-paper';
import Item from './screens/Item';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // create tables if not already existing
    // dropTables()
    createTables()

  }, [])

  const [loaded] = useFonts({
    'Montserrat': require('./assets/Montserrat-Regular.ttf'),
    'Montserrat-bold' : require('./assets/Montserrat-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }
 
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        >
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Collection" component={Collection} />
          <Stack.Screen name="Item" component={Item} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
