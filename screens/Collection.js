import React, {useState, useEffect} from 'react'
import { View, ScrollView, StyleSheet, TextInput } from 'react-native'
import globalStyles from '../styles/globalStyles'
import SortBy from '../components/SortBy'
import ItemBubble from '../components/ItemBubble'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import { Dialog, Portal, Button, Paragraph } from "react-native-paper";
import { getFromItems, deleteCollection } from '../utils/DAO'
import { useIsFocused } from '@react-navigation/native'

export default function Collection({route, navigation}) {
  const isFocused = useIsFocused();

  const [name, setName] = useState(route.params.name)
  const [editingLabel, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [visible, setVisible] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if(isFocused) {
      getFromItems(name, setItems)
    }
  }, [isFocused])

  const showDialogDelete = () => {
    setVisible(true)
  }

  const handleCancelDelete = () => {
    setVisible(false)
  }

  const handleDelete = () => {
    deleteCollection(name)
    setVisible(false)
    navigation.navigate('Main')
  }

  const showEdit = () => {
    setEditingName(true)
  }

  const handleCancelEdit = () => {
    setNewName('')
    setEditingName(false)
  }

  const handleEdit = () => {
    if(newName !== '') {
      updateCollection(name, newName)
      setName(newName)
    }
    setEditingName(false)
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
            onPress={()=>showDialogDelete()}
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
              onPress={()=>handleCancelEdit()}
              iconName="cancel"
              size={35}
              />
              <IconButton
              style={styles.iconButton}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={()=>handleEdit()}
              iconName="save"
              size={35}
              />
            </View>
            :
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>showEdit()}
            iconName="edit"
            size={35}
            />
          }
          
        </View>
      </View>

      <View style={styles.header}>
        <View style={styles.headingContainer}>
          {editingLabel ?
            <TextInput style={[globalStyles.headingTextEdit, styles.container]} value={newName} onChangeText={val => setNewName(val)}/>
          :
            <CustomText style={globalStyles.headingText}>{name}</CustomText>
          }
          <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>5</CustomText>
        </View>
        <View style={styles.subHeadingContainer}>
          <CustomText style={styles.subHeading}>Total: $99.99</CustomText>
          <CustomText style={[styles.subHeading, styles.ml]}>Items: 15</CustomText>
        </View>
      </View>

      <View style={styles.container}>
        <View styles={styles.options}>
          <SortBy style={{marginLeft: 30}}/>
          <IconButton
            style={[styles.iconButton, styles.plus]}
            activeOpacity={0.6}
            underlayColor="#ffdd85"
            onPress={()=>navigation.navigate('Item', {collection: name})}
            iconName="add"
            size={43}
          />
        </View>
        
        <View style={styles.panel}>
            <ScrollView style={styles.scrollView}>
              {
                items.map((item) => (
                  <ItemBubble navigation={navigation} key={item.id} 
                  id={item.id} name={item.name} photo={item.photo} 
                  price={item.price} quantity={item.quantity} 
                  total={item.total}
                  />
                ))
              }
            </ScrollView>
        </View>
      </View>
      

      <Portal>
        <Dialog visible={visible} onDismiss={handleCancelDelete}>
          <Dialog.Title>Delete Collection - {name}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this collection?
            All items in this collection will be dissociated from this collection.</Paragraph>
            
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelDelete}>No</Button>
            <Button onPress={handleDelete}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButton: {
    borderRadius: 100,
    padding: 10,
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
  options: {
    flexDirection: 'row',
  },
  scrollView: {

  },
  plus: {
    width:54,
    position: 'absolute',
    right: 23,
    bottom: 10,
    alignItems: 'center',
    backgroundColor: '#fcca47',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 4,
    padding: 5,
  },
  
})