import { View, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import ItemInfoBubble from '../components/ItemInfoBubble'
import CustomChip from '../components/CustomChip'
import { Portal, Button, Dialog, Paragraph, Checkbox } from 'react-native-paper'
import { createItem, deleteItem, getAllCollections, getItem, getItemCollections, updateItem } from '../utils/DAO'
import CustomCheckBox from '../components/CustomCheckBox'
import * as ImagePicker from 'expo-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import ImageView from 'react-native-image-viewing'

export default function Item({route, navigation}) {
  // data from navigation
  const [id, setId] = useState(route.params?.id)
  const collection = route.params?.collection
  const returnUri = route.params?.uri

  // data from database
  const [item, setItem] = useState(null)
  const [collectionsIn, setCollectionsIn] = useState(null)
  const [allCollections, setAllCollections] = useState(null)

  // states for conditional rendering
  const [editing, setEditing] = useState(id ? false : true) // default to edit if new item
  const [delDialogVis, setDelDialogVis] = useState(false)
  const [collectionsDialogVis, setCollectionsDialogVis] = useState(false)
  const [imageChoiceVis, setImageChoiceVis] = useState(false)
  const [imageViewerVis, setImageViewerVis] = useState(false)

  // store values of edits
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [price, setPrice] = useState('0')
  const [quantity, setQuantity] = useState('0')
  const [total, setTotal] = useState('0')
  const [notes, setNotes] = useState('')
  const [collectionsEdit, setCollectionsEdit] = useState({})

  // set photo after camera has taken it
  useEffect(() => {
    if(returnUri) {
      setPhoto(returnUri)
    }
  }, [route.params.uri])

  // get data
  useEffect(() => {
    if(id){
      getItem(id, setItem)
      getItemCollections(id, setCollectionsIn)
    }
    getAllCollections(setAllCollections)
  }, [id])

  // set collections that are selected by chips
  useEffect(() => {
    if(allCollections) {
      const tempAllCollections = {}
      allCollections.forEach(e => {
        const cn = e.name
        tempAllCollections[cn] = false
      })
      if(collectionsIn) {
        const tempCollectionsIn = {}
        collectionsIn.forEach(e => {
          const cn = e.collection_name
          tempCollectionsIn[cn] = true
        })
        setCollectionsEdit({...tempAllCollections, ...tempCollectionsIn})
      } else {
        const currCollection = collection;
        const tempObj = {}
        tempObj[currCollection] = true
        setCollectionsEdit({...tempAllCollections, ...tempObj})
      }
    }
  }, [collectionsIn, allCollections])

  // set edit data to begin at the database data
  useEffect(() => {
    if(item){
      setName(item.name); setPhoto(item.photo); setPrice(item.price.toString()); 
      setQuantity(item.quantity.toString());setTotal(item.total.toString()); setNotes(item.notes);
    }
  }, [item]);

  // modify total when price & qty change
  useEffect(() => {
    setTotal((parseFloat(price) * parseFloat(quantity)).toString());
  }, [price, quantity]);

  // handle delete dialog
  const handleDelete = () => {
    setDelDialogVis(false)
    deleteItem(id)
    navigation.goBack()
  }
  
  // handle camera vs image picker dialog
  const handleImageChoice = (choice) => {
    setImageChoiceVis(false)
    if(choice === 'camera') {
      navigation.navigate('CameraModule')
    } else if (choice === 'image-picker') {
      pickImage()
    }
  }

  const pickImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission denied!')
      return
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  // returns list of collections to associate and to dissociate from/to item
  const getCollectionsLists = () => {
    const assocCollections=[]
    const dissocCollections=[]

    if(!id) {
      Object.keys(collectionsEdit).forEach(collection => {
        if(collectionsEdit[collection]) {
          assocCollections.push(collection)
        }
      });
    }
    else {
      const tempCollectionsIn = {}
      collectionsIn.forEach(e => {
        const cn = e.collection_name
        tempCollectionsIn[cn] = true
      })

      Object.keys(collectionsEdit).forEach(collection => {
        if(!collectionsEdit[collection] && tempCollectionsIn[collection]){
          dissocCollections.push(collection)
        } else if (collectionsEdit[collection] && !tempCollectionsIn[collection]) {
          assocCollections.push(collection)
        }
      });
    }

    return {assocCollections, dissocCollections}
  }

  // creates item, otherwise updates it if already exists
  const handleSave = () => {
    const {assocCollections, dissocCollections} = getCollectionsLists()

    if(id){
      setEditing(false)
      updateItem(name, photo, price, quantity, total, notes, id, assocCollections, dissocCollections) 
      setItem({name, photo, price, quantity, total, notes, id})
      // TODO: logic for setCollectionsIn()
    } else {
      createItem(name, photo, price, quantity, total, notes, assocCollections, setId)
      // TODO: logic for setCollectionsIn()
      setEditing(false)
    }
  }

  // onchange handler for editing collections
  const handleCollectionsEditChange = (collection) => {
    const tempObj = {}
    tempObj[collection] = !collectionsEdit[collection]
    setCollectionsEdit({...collectionsEdit, ...tempObj})
  }

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={globalStyles.navBar}>
        <IconButton
          style={styles.iconButton}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={()=>navigation.goBack()}
          iconName="arrow-back-ios"
          size={35}
        />
        {
          !id ?
          <View style={{flexDirection:'row'}}>
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>handleSave()}
            iconName="save"
            size={35}
            />
          </View>
          :
          id && !editing ?
          <View style={{flexDirection: 'row'}}>
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>setDelDialogVis(true)}
            iconName="delete"
            size={35}
            />
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>setEditing(true)}
            iconName="edit"
            size={35}
            />
          </View>
          :
          <View style={{flexDirection:'row'}}>
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>setEditing(false)}
            iconName="cancel"
            size={35}
            />
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>handleSave()}
            iconName="save"
            size={35}
            />
          </View>
        }
      </View>

      {/* Name of item */}
      {
        editing ? 
        <TextInput style={[globalStyles.headingTextEdit, styles.textContainer]} value={name} onChangeText={(val) => setName(val)}/>
        : 
        <CustomText style={[globalStyles.headingText, styles.textContainer]}>{item?.name}</CustomText>
      }

      {/* Image */}
      <View style={styles.imageHeader}>
        {/* <Carousel
          style={{height: 250}}
          width={450}
          data={[{img: photo}]}
          renderItem={({ img }) => {
            return (
              <TouchableOpacity
                onPress={() => setImageChoiceVis(true)}
                activeOpacity={0.8}
              >
                <Image style={styles.image} 
                  source={{uri: img}} 
                />
              </TouchableOpacity>
            );
        }} /> */}

       
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => {
            if(editing) {setImageChoiceVis(true)}
            else {setImageViewerVis(true)}
          }}
          activeOpacity={0.8}
        >    
          {
            photo ?
            <Image style={styles.image} 
              source={{uri: photo}} 
            />
            :
            <Image style={styles.image} 
              source={require('./../assets/4x3-placeholder.png')}
            />
          }
          
        </TouchableOpacity>
      </View>
        
      </View>

      {/* Yellow panel */}
      <View style={{flex: 1, overflow: 'hidden', borderTopLeftRadius: 25, borderTopRightRadius: 25,}}>
        <ScrollView style={styles.panel}>
          <CustomText style={[styles.subHeading, styles.subHeadingText]}>Details</CustomText>
            {
              editing ? 
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
                <ItemInfoBubble label='Price' value={price} editing={true} onChangeText={(val) => setPrice(val)} keyboardType="numeric"/>
                <ItemInfoBubble label='Qty' value={quantity} editing={true} onChangeText={(val) => setQuantity(val)} keyboardType="numeric"/>
                <ItemInfoBubble label='Total' data={total} editing={false}/>
              </View>
              :
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, marginRight: 20}}>
                <ItemInfoBubble label='Price' data={item?.price} editing={false}/>
                <ItemInfoBubble label='Qty' data={item?.quantity} editing={false}/>
                <ItemInfoBubble label='Total' data={item?.total} editing={false}/>
              </View>
            }
          <CustomText style={[styles.subHeading, styles.subHeadingText]}>Notes</CustomText>
          <View style={{overflow: 'hidden'}}>
            <ScrollView style={styles.notesPanel}>
              {
                editing ? 
                <TextInput multiline={true} style={styles.notesText} value={notes} onChangeText={(val) => setNotes(val)}/>
                :
                <CustomText style={styles.notesText}>{item?.notes}</CustomText>
              }
            </ScrollView>
          </View>

          <CustomText style={[styles.subHeading, styles.subHeadingText]}>Collections</CustomText>
          {
            editing ? 
            <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 60, flexWrap: 'wrap'}}>
              {Object.keys(collectionsEdit).map((collection) => {
                if(collectionsEdit[collection]){
                  return(
                    <CustomChip key={collection}>{collection}</CustomChip>
                  )
                }
              })}
              <IconButton 
                style={[styles.iconButton, styles.plus]} 
                iconName='add' 
                size={25} 
                onPress={()=>setCollectionsDialogVis(true)}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
              />
            </View>
            :
            <View style={{flexDirection: 'row', marginLeft: 20, marginRight: 20, marginBottom: 60, flexWrap: 'wrap'}}>
              {collectionsIn?.map((collection) => (
                <CustomChip key={collection.collection_name}>{collection.collection_name}</CustomChip>
              ))}
            </View>
            }
        </ScrollView>
      </View>



      <Portal>
        <Dialog visible={delDialogVis} onDismiss={()=>setDelDialogVis(false)}>
          <Dialog.Title>Delete Item - {item?.name}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this item? All collections
              with this item will lose this item.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>setDelDialogVis(false)}>No</Button>
            <Button onPress={()=>handleDelete()}>Yes</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={collectionsDialogVis} onDismiss={()=>setCollectionsDialogVis(false)}>
          <Dialog.Title>Choose collections</Dialog.Title>
          <Dialog.Content>
            {
              Object.keys(collectionsEdit).map((collection) => {
                if(collectionsEdit[collection]){
                  return(
                    <CustomCheckBox key={collection} status='checked' onPress={() => handleCollectionsEditChange(collection)}>
                      {collection}
                    </CustomCheckBox>
                  )
                } else {
                  return (
                    <CustomCheckBox key={collection} status='unchecked' onPress={() => handleCollectionsEditChange(collection)}>
                      {collection}
                    </CustomCheckBox>
                  )
                }
              })
            }
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>setCollectionsDialogVis(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={imageChoiceVis} onDismiss={()=>setImageChoiceVis(false)}>
          <Dialog.Title>Choose One</Dialog.Title>
          <Dialog.Content>
            <Paragraph></Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>handleImageChoice('camera')}>Take a Photo</Button>
            <Button onPress={()=>handleImageChoice('image-picker')}>Choose from Gallery</Button>
          </Dialog.Actions>
        </Dialog>


      </Portal>

      <ImageView
        images={[{uri: item?.photo}]}
        imageIndex={0}
        visible={imageViewerVis}
        onRequestClose={() => setImageViewerVis(false)}
      />

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
  imageHeader: {
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
    height: 250,
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
  textContainer: {
    marginLeft: 25,
    marginRight: 25,
  },
  subHeading: {
    marginTop: 10,
    marginLeft: 25,
  },
  subHeadingText: {
    fontSize: 25
  },
  notesPanel: {
    borderRadius: 16,
    backgroundColor: '#fff',
    minHeight: '15%',
    marginLeft: 25,
    marginRight: 25
  },
  notesText: {
    margin: 10,
    fontSize: 20,
    fontFamily: 'Montserrat'
  },
  plus: {
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 1,
  },

})