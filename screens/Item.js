import React, {useState} from 'react'
import { View, ScrollView, StyleSheet, TouchableHighlight, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'
import ActionButton from '../components/ActionButton'
import IconButton from '../components/IconButton'
import Dialog from "react-native-dialog"
import CustomTextInput from '../components/CustomTextInput'


export default function Item({navigation}) {
  const [editingLabel, setEditingLabel] = useState(false)
  const [visible, setVisible] = useState(false)
  const showDialog = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleDelete = () => {
    setVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={globalStyles.navBar}>

        <IconButton
          style={styles.iconButton}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={()=>navigation.goBack()}
          iconName="arrow-back-ios"
          size={35}
        />

        <View style={{flexDirection: 'row'}}>
          <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>showDialog()}
            iconName="delete"
            size={35}
          />
          {
            editingLabel ?
            <View style={{flexDirection:'row'}}>
              <IconButton
              style={styles.iconButton}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={()=>setEditingLabel(false)}
              iconName="cancel"
              size={35}
              />
              <IconButton
              style={styles.iconButton}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={()=>setEditingLabel(false)}
              iconName="save"
              size={35}
              />
            </View>
            :
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>setEditingLabel(true)}
            iconName="edit"
            size={35}
            />
          }
          
        </View>
      </View>

      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('./../assets/gprox.png')}
          />
        </View>
      </View>
      
      <View style={styles.panel}>
        
        {
          editingLabel ?
          <View style={styles.container}>
            <CustomTextInput style={[globalStyles.headingTextEdit, styles.textContainer]}/>
            <ScrollView style={styles.scrollView}>
              <View style={{flexDirection: 'row'}}>
                <CustomTextInput style={[styles.textEdit, styles.textContainer]}/> 
                <CustomTextInput style={[styles.textEdit, styles.textContainer]}/>
              </View>
              <CustomTextInput style={[styles.textEdit, styles.textContainer]}/>
            </ScrollView>
          </View>
          :
          <View style={styles.container}>
            <CustomText style={[globalStyles.headingText, styles.textContainer]}>Logitech G Pro X</CustomText>
            <ScrollView style={styles.scrollView}>
              <View style={{flexDirection: 'row'}}>
                <CustomText style={[styles.subheadingText, styles.textContainer]}>$190</CustomText> 
                <CustomText style={[styles.subheadingText, styles.textContainer]}>x1</CustomText>
              </View>
              <CustomText style={[styles.subheadingText, styles.textContainer]}>Total $190</CustomText>
            </ScrollView>
          </View>
        }
      </View>
      <Dialog.Container visible={visible} onBackdropPress={handleCancel}>
        <Dialog.Title>Delete Item?</Dialog.Title>
        <Dialog.Description>
          You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel}/>
        <Dialog.Button label="Delete" onPress={handleDelete}/>
      </Dialog.Container>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  iconButton: {
    borderRadius: 100,
    padding: 10
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginBottom: 30
  },
  image: {
    borderRadius: 30
  },
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fcca47',
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  scrollView: {
    flex: 1,
  },
  textContainer: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
  },
  subheadingText: {
    fontSize: 30
  },
  actionButtonContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  textEdit: {
    borderWidth: 1,
    borderColor: 'grey', 
    borderRadius: 15, 
    marginRight: 15, 
    padding: 10, 
    flex: 1,
    fontSize: 30,
  },

})