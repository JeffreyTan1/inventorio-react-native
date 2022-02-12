import React,{useState} from 'react'
import { View, StyleSheet, ScrollView, Alert, BackHandler, Linking } from 'react-native'
import CustomText from '../components/CustomText';
import globalStyles from '../styles/globalStyles';
import { clearHistory, createTables, dropTables, recordhistory } from './../utils/DAO';
import * as FileSystem from 'expo-file-system';
import IconButton from '../components/IconButton';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

  const openWebsite = () => {
    Linking.openURL('https://jeffreytan.dev')
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    backgroundColor: '#fcca47',
    flex: 1,
    padding: '5%',
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '13%',
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
    paddingHorizontal: '11%',
    paddingVertical: 5,
    backgroundColor: '#fff'
  },
  contactText: {
    fontSize: 20,
    color: '#189ef2',
  },
})