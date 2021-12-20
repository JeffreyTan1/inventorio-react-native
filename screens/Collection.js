import React, {useState} from 'react'
import { View, ScrollView, StyleSheet, TextInput } from 'react-native'
import globalStyles from '../styles/globalStyles'
import SortBy from '../components/SortBy'
import ItemBubble from '../components/ItemBubble'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import Dialog from "react-native-dialog";
import CustomTextInput from '../components/CustomTextInput'

export default function Collection({navigation}) {
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
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
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
        <View style={styles.headingContainer}>
          {editingLabel ?
            <CustomTextInput style={[globalStyles.headingTextEdit, styles.container]}/>
          :
            <CustomText style={globalStyles.headingText}>Entertainment</CustomText>
          }
          <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>5</CustomText>
        </View>
        <View style={styles.subHeadingContainer}>
          <CustomText style={styles.subHeading}>Total: $99.99</CustomText>
          <CustomText style={[styles.subHeading, styles.ml]}>Items: 15</CustomText>
        </View>
      </View>

      <View style={styles.container}>
        <View styles={styles.sortPanel}>
          <SortBy style={{marginLeft: 30}}/>
        </View>
        <View style={styles.panel}>
            <ScrollView style={styles.scrollView}>
              <ItemBubble navigation={navigation}/>
              <ItemBubble navigation={navigation}/>
              <ItemBubble navigation={navigation}/>
              <ItemBubble navigation={navigation}/>
            </ScrollView>
        </View>
      </View>
      

      <Dialog.Container visible={visible} onBackdropPress={handleCancel}>
        <Dialog.Title>Delete Collection?</Dialog.Title>
        <Dialog.Description>
          You cannot undo this action. All items that don't belong to a collection will be placed in the "no collection" collection
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel}/>
        <Dialog.Button label="Delete" onPress={handleDelete}/>
      </Dialog.Container>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButton: {
    borderRadius: 100,
    padding: 10
  },
  header: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subHeadingContainer: {
    flexDirection: 'row',
  },
  subHeading: {
    fontSize: 20,
  },
  ml: {
    marginLeft: 10,
  },
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fcca47',
    flex: 1,
    overflow: 'hidden'
  },
  sortPanel: {
  },
  scrollView: {

  },
  
})