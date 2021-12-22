import React, {useState} from 'react'
import { View, ScrollView, StyleSheet, TouchableHighlight, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
// import Dialog from "react-native-dialog"
import CustomTextInput from '../components/CustomTextInput'
import ItemInfoBubble from '../components/ItemInfoBubble'
import CustomChip from '../components/CustomChip'

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

      {
        editingLabel ?
        <CustomTextInput style={[globalStyles.headingTextEdit, styles.textContainer, {fontFamily: 'Montserrat-bold'}]}/>
        :
        <CustomText style={[globalStyles.headingText, styles.textContainer, {fontFamily: 'Montserrat-bold'}]}>Logitech G Pro X</CustomText>
      }

      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('./../assets/gprox.png')}
          />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 20}}>
          <ItemInfoBubble label='Price' value="190"/>
          <ItemInfoBubble label='Qty' value="2"/>
          <ItemInfoBubble label='Total' value="380"/>
        </View>

        <View style={{flexDirection: 'row', margin: 20, flexWrap: 'wrap'}}>
          <CustomChip>Example</CustomChip>
          <CustomChip>Example</CustomChip>
          <CustomChip>Example</CustomChip>
          <CustomChip>Example</CustomChip>
        </View>

      </View>

      {/* <Dialog.Container visible={visible} onBackdropPress={handleCancel}>
        <Dialog.Title>Delete Item?</Dialog.Title>
        <Dialog.Description>
          You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel}/>
        <Dialog.Button label="Delete" onPress={handleDelete}/>
      </Dialog.Container> */}
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
    width: '92%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginBottom: 20,
    marginTop: 20
  },
  image: {
    width: '100%',
    borderRadius: 30,
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
  },

  actionButtonContainer: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

})