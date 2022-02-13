import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, Alert, BackHandler, Linking, Switch } from 'react-native'
import CustomText from '../components/CustomText';
import globalStyles from '../styles/globalStyles';
import { clearHistory, createTables, dropTables, recordhistory } from './../utils/DAO';
import * as FileSystem from 'expo-file-system';
import IconButton from '../components/IconButton';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { changeLocalAuthReducer } from '../redux/settingsSlice';
import { changeThemeReducer } from '../redux/themeSlice';

const deleteAllDataAnswer = "delete all data";
const deleteHistoryAnswer = "delete history";

export default function Settings({navigation}) {
  const appState = useSelector(state => state);
  const colorState = useSelector(state => state.theme.theme.value.colors);
  const dispatch = useDispatch();
  const [deleteInput, setDeleteInput] = useState('');

  const deleteDirContents = async (dir) => {
    const files = await FileSystem.readDirectoryAsync(dir)
    for (const file of files) {
      FileSystem.deleteAsync(dir + file)
    }
  }

  const handleDeleteData = () => {
    dropTables()
    createTables()
    recordhistory()
    deleteDirContents(FileSystem.documentDirectory + 'images/')
    deleteDirContents(FileSystem.cacheDirectory + 'Camera/')
    deleteDirContents(FileSystem.cacheDirectory + 'ImagePicker/')
  }

  const handleClearHistory = () => {
    Alert.alert(
      `Clear history data?`,
      `This action is irreversible!`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: async() => {
          clearHistory()
        } }
      ]
    );
    
  }

  const handleExport = async () => {
    await Sharing.shareAsync(
      FileSystem.documentDirectory + 'SQLite/db.inventory', 
      {dialogTitle: 'share or copy your DB via'}
    ).catch(error =>{
        console.log(error);
    })
  }

  const handleImport = async () => {
    const documentResult = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
      type: '*/db'
    })
    const uri = documentResult.uri

    if(uri) {
      Alert.alert(
      `Replace database with selected file?`,
      `The app will close after this operation. Please note that corrupted database files may break this app proceed at your own risk.`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: async() => {
          await FileSystem.copyAsync({from: uri, to: FileSystem.documentDirectory + 'SQLite/db.inventory'})
          BackHandler.exitApp()
        } }
      ]
      );
    }
    
  }

  const deleteDialog = () => {
    Alert.alert(
      `Delete all data?`,
      `This action is irriversible!`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDeleteData() }
      ]
    );
  }

  const openWebsite = () => {
    Linking.openURL('https://jeffreytan.dev')
  }

  return (
    <View style={[styles.container, {backgroundColor: colorState.background}]}>
      <View style={styles.navBar}>
        <IconButton
          style={styles.iconButton}
          activeOpacity={0.6}
          onPress={()=>navigation.goBack()}
          iconName="arrow-back-ios" 
          size={35}
        />
      </View>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <CustomText style={globalStyles.headingText}>Settings</CustomText>
        </View>
      </View>
      
      <View style={[styles.panel, {backgroundColor: colorState.primary}]}>

          <ScrollView style={styles.content}>
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Authentication</CustomText>
              <Switch
                value={appState.settings.settings.localAuthRequired} 
                onChange={() => dispatch(changeLocalAuthReducer(appState.settings.settings.localAuthRequired ? 'off' : 'on'))}
              />
            </View>
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Dark Mode</CustomText>
              <Switch 
                value={appState.theme.theme.type === 'dark'} 
                onChange={() => dispatch(changeThemeReducer(appState.theme.theme.type === 'dark' ? 'light' : 'dark'))}
              />
            </View> 
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Export Data</CustomText>
              <IconButton
              onPress={() => handleExport()}
              style={[styles.button, {backgroundColor: colorState.background}]}
              activeOpacity={0.9}
              iconName='publish'
              size={30} 
              />
            </View> 
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Import Data</CustomText>
              <IconButton
              onPress={() => handleImport()}
              style={[styles.button, {backgroundColor: colorState.background}]}
              activeOpacity={0.9}
              iconName='vertical-align-bottom'
              size={30} 
              />
            </View> 
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Clear History</CustomText>
              <IconButton
              onPress={() => handleClearHistory()}
              style={[styles.button, {backgroundColor: colorState.background}]}
              activeOpacity={0.9}
              iconName='close'
              size={30} 
              />
            </View> 
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Delete All Data</CustomText>
              <IconButton
              onPress={() => deleteDialog()}
              style={[styles.button, {backgroundColor: colorState.background}]}
              activeOpacity={0.9}
              iconName='delete'
              size={30} 
              />
            </View> 
            <View style={styles.field}>
              <CustomText style={styles.fieldName}>Contact</CustomText>
              <TouchableOpacity
                onPress={() => openWebsite()}
              >
                <CustomText style={styles.contactText}>jeffreytan.dev</CustomText>
              </TouchableOpacity>
            </View> 

            <View style={styles.field}>
                <CustomText style={styles.versionText}>V 1.0.0</CustomText>
            </View> 
          </ScrollView>
          
        </View>
 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButton: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
  },
  header: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: '1%',
    height: '9%'
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginTop: '4%'
  },
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    paddingHorizontal: '5%',
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10%',
  },
  fieldName: {
    fontSize: 25,
  },
  versionText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: '10%',
    paddingVertical: '3%',
  },
  contactText: {
    fontSize: 20,
    color: '#189ef2',
  },
})