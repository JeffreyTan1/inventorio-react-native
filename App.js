import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './screens/Main';
import Collection from './screens/Collection';
import {useFonts} from 'expo-font';
import Settings from './screens/Settings';
import { createTables, getAllCollections } from './utils/DAO';
import Item from './screens/Item';
import CameraModule from './screens/CameraModule';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import {SafeAreaView} from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [initCollections, setInitCollections] = useState(null);

  const  _cacheResourcesAsync = async () => {
    getAllCollections(setInitCollections)
    const resources = [require('./assets/plus-placeholder.png'), require('./assets/backpack.png'), require('./assets/icon.png')];
    const cacheResources = resources.map(resource => {
      return Asset.fromModule(resource).downloadAsync();
    }); 

    return Promise.all(cacheResources);
  }

  useEffect(() => {
    // create tables & directories if not already existing
    createTables()
    createDirectories()
    deleteCache()
  }, [])

  const [loaded] = useFonts({
    'Montserrat': require('./assets/Montserrat-Regular.ttf'),
    'Montserrat-bold' : require('./assets/Montserrat-Bold.ttf'),
  });

  if (!appIsReady || !loaded || !initCollections) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setAppIsReady(true)}
        onError={console.warn}
      />
    );
  }
 
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 1}}>
        <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
        >
          <Stack.Screen name="Main">
            {/* Make app loading more snappy */}
            {props => <Main {...props} initCollections={initCollections} />} 
          </Stack.Screen>
          <Stack.Screen name="Collection" component={Collection} />
          <Stack.Screen name="Item" component={Item} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="CameraModule" component={CameraModule} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  
  );
}


const createDirectories = async () => {
  const imagesDir = FileSystem.documentDirectory + 'images'
  const dirInfo = await FileSystem.getInfoAsync(imagesDir);
  if(!dirInfo.exists){
    await FileSystem.makeDirectoryAsync(imagesDir, {intermediates: true})
    console.log('directory:', imagesDir, 'created!')
  }
}

const deleteCache = async () => {

  const camCacheDir = FileSystem.cacheDirectory + 'Camera/'
  let files = await FileSystem.readDirectoryAsync(camCacheDir)
  for (const file of files) {
    FileSystem.deleteAsync(camCacheDir + file)
  }

  const ipCacheDir = FileSystem.cacheDirectory + 'ImagePicker/'
  files = await FileSystem.readDirectoryAsync(ipCacheDir)
  for (const file of files) {
    FileSystem.deleteAsync(ipCacheDir + file)
  }
}