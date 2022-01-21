import React,{useState} from 'react'
import { View, StyleSheet, TouchableHighlight, ScrollView, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../components/CustomText';
import globalStyles from '../styles/globalStyles';
import { createTables, dropTables, recordhistory } from './../utils/DAO';
import * as FileSystem from 'expo-file-system';

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
        <TouchableHighlight
        style={styles.iconButton}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={()=>navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={35}/>
        </TouchableHighlight>
      </View>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <CustomText style={globalStyles.headingText}>Settings</CustomText>
        </View>
      </View>
      
      <ScrollView style={styles.panel}>
        <View style={styles.field}>
          <CustomText style={styles.fieldName}>Delete all data</CustomText>
          <TouchableHighlight 
          onPress={() => deleteDialog()}
          style={styles.button}
          activeOpacity={0.9}
          underlayColor="white"
          >
            <Icon name='delete' style={styles.delButtonText}/>
          </TouchableHighlight>
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
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fcca47',
    flex: 1,
    padding: 20
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  fieldName: {
    fontSize: 25,
  },
  button: {
    flexGrow: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginLeft: 30
  },
  delButtonText: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    padding: 5,
    
  }
})