import React,{useState} from 'react'
import { View, StyleSheet, TouchableHighlight, ScrollView, Button } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../components/CustomText';
import globalStyles from '../styles/globalStyles';
import { createTables, dropTables } from './../utils/DAO';
import Dialog from 'react-native-dialog'

export default function Settings({navigation}) {
  const [delDialogVis, setDelDialogVis] = useState(false)

  const handleDeleteData = () => {
    dropTables()
    createTables()
    console.log('All data deleted')
    setDelDialogVis(false)
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
        <CustomText style={styles.subHeading}>Delete all data</CustomText>
        <TouchableHighlight 
        onPress={() => setDelDialogVis(true)}
        style={styles.delButton}
        activeOpacity={0.9}
        underlayColor="pink"
        >
          <CustomText style={styles.delButtonText}>Delete</CustomText>
        </TouchableHighlight>
      </ScrollView>

      <Dialog.Container visible={delDialogVis} onBackdropPress={() => setDelDialogVis(false)}>
        <Dialog.Title>Delete all data?</Dialog.Title>
        <Dialog.Description>
          This action is irriversible!
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDelDialogVis(false)}/>
        <Dialog.Button label="Delete" onPress={handleDeleteData}/>
      </Dialog.Container>

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
  subHeadingContainer: {
    flexDirection: 'row',
  },
  subHeading: {
    fontSize: 30,
    marginHorizontal: 20,
    marginTop: 30
  },
  ml: {
    marginLeft: 10,
  },
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fcca47',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  delButton: {
    width: '40%',
    paddingVertical: 5,
    backgroundColor: '#e90b0b',
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16
  },
  delButtonText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    padding: 3
  }
})