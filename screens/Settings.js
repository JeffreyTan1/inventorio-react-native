import React,{useState} from 'react'
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native'
import CustomText from '../components/CustomText';
import globalStyles from '../styles/globalStyles';
import { clearHistory, createTables, dropTables, recordhistory } from './../utils/DAO';
import * as FileSystem from 'expo-file-system';
import IconButton from '../components/IconButton';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export default function Settings({navigation}) {

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

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <IconButton
          style={styles.iconButton}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
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
      
      <ScrollView style={styles.panel}>
        <View style={styles.content}>
             
          <View style={styles.field}>
            <CustomText style={styles.fieldName}>Export data</CustomText>
            <IconButton
            onPress={() => handleExport()}
            style={styles.button}
            activeOpacity={0.9}
            underlayColor="#e0e0e0"
            iconName='publish'
            size={30} 
            color='#000'
            />
          </View> 
          <View style={styles.field}>
            <CustomText style={styles.fieldName}>Import data</CustomText>
            <IconButton
            onPress={() => handleImport()}
            style={styles.button}
            activeOpacity={0.9}
            underlayColor="#e0e0e0"
            iconName='vertical-align-bottom'
            size={30} 
            color='#000'
            />
          </View> 
          <View style={styles.field}>
            <CustomText style={styles.fieldName}>Clear history</CustomText>
            <IconButton
            onPress={() => handleClearHistory()}
            style={styles.button}
            activeOpacity={0.9}
            underlayColor="#e0e0e0"
            iconName='close'
            size={30} 
            color='#000'
            />
          </View> 
          <View style={styles.field}>
            <CustomText style={styles.fieldName}>Delete all data</CustomText>
            <IconButton
            onPress={() => deleteDialog()}
            style={styles.button}
            activeOpacity={0.9}
            underlayColor="#e0e0e0"
            iconName='delete'
            size={30} 
            color='#000'
            />
          </View> 
        </View>
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  iconButton: {
    borderRadius: 100,
    padding: 10
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  header: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    height: '9%'
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ml: {
    marginLeft: 10,
  },
  content: {
    marginTop: 15
  },
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fcca47',
    flex: 1,
    padding: 20,
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  fieldName: {
    fontSize: 25,
  },
  button: {
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 40,
    paddingVertical: 5,
    backgroundColor: '#fff'
  },

})