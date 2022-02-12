import { View, StyleSheet, Image, ScrollView, TextInput, ImageBackground, Alert, Dimensions} from 'react-native'
import React, {useEffect, useState} from 'react'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import ItemInfoBubble from '../components/ItemInfoBubble'
import CustomChip from '../components/CustomChip'
import Dialog from 'react-native-dialog'
import { createItem, deleteItem, getAllCollections, getItem, getItemCollections, updateItem } from '../utils/DAO'
import CustomCheckBox from '../components/CustomCheckBox'
import * as ImagePicker from 'expo-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import ImageView from 'react-native-image-viewing'
import { TouchableHighlight } from 'react-native-gesture-handler'
import placeholder from './../assets/plus-placeholder.png'
import * as FileSystem from 'expo-file-system';

const placeholderUri = Image.resolveAssetSource(placeholder).uri
const priceError = 'Must only contain numbers, an optional decimal point, and two numbers after the decimal point.'
const quantityError = 'Must only contain numbers.'

export default function Item({route, navigation}) {
  // data from navigation
  const [id, setId] = useState(route.params?.id)
  const collection = route.params?.collection
  const returnUri = route.params?.uri
  const [newItem] = useState(!route.params?.id)

  // used to reload after an update
  const [reload, setReload] = useState(0)

  // data from database
  const [itemData, setItemData] = useState(null)
  const [collectionsIn, setCollectionsIn] = useState(null)
  const [allCollections, setAllCollections] = useState(null)

  // states for conditional rendering
  const [editing, setEditing] = useState(id ? false : true) // default to edit if new item
  const [collectionsDialogVis, setCollectionsDialogVis] = useState(false)
  const [imageViewerVis, setImageViewerVis] = useState(false)

  // store values of edits
  const [name, setName] = useState('')
  const [photos, setPhotos] = useState([])
  const [price, setPrice] = useState('0')
  const [quantity, setQuantity] = useState('0')
  const [total, setTotal] = useState('0')
  const [notes, setNotes] = useState('')
  const [collectionsEdit, setCollectionsEdit] = useState({})

  const [priceErrorMsg, setPriceErrorMsg] = useState(null);
  const [quantityErrorMsg, setQuantityErrorMsg] = useState(null);

  // set photos after camera has taken it
  useEffect(() => {
    if(returnUri) {
      const tempPhotos = [...photos]
      tempPhotos.push(returnUri)
      setPhotos(JSON.parse(JSON.stringify(tempPhotos)));  // cannot explain why
    }
  }, [route.params.uri])

  // get data
  useEffect(() => {
    if(id){
      getItem(id, setItemData)
      getItemCollections(id, setCollectionsIn)
    }
    getAllCollections(setAllCollections)
  }, [id, reload])  

  // set edit data to begin at the database data
  useEffect(() => {
    if(itemData){
      setEditData(itemData)
    }
  }, [itemData]);

  const setEditData = (data) => {
    setName(data.name); setPhotos([...data.photos]); setPrice(data.price.toString()); 
    setQuantity(data.quantity.toString());setTotal(data.total.toString()); setNotes(data.notes);
  }
  
   // handle camera vs image picker dialog
  const handleImageChoice = (choice) => {
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
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const tempPhotos = [...photos]
      tempPhotos.push(result.uri)
      setPhotos(JSON.parse(JSON.stringify(tempPhotos)));  // cannot explain why
    }
  };

  const copyPhoto = async(uri) => {
    try {
      const lastSlash = uri.lastIndexOf('/')
      const fileName = FileSystem.documentDirectory + 'images/' + uri.substring(lastSlash + 1)
      await FileSystem.copyAsync({from: uri, to: fileName})
      // console.log(uri, 'copied to', fileName)
      return fileName
    } catch (error) {
      throw error
    }
  }

  const deletePhoto = async(uri) => {
    try {
      await FileSystem.deleteAsync(uri)
    } catch (error) {
      throw error
    }
  }

  const getNewPhotosArray = async () => {
    const savedFiles = []
    if(!id){
      const copyingArray = [...photos]
      for (const f of copyingArray) {
        const fileName = await copyPhoto(f)
        savedFiles.push(fileName)
      }
      return savedFiles
    } else {
      const deletingArray = itemData.photos.filter(x => !photos.includes(x))
      const copyingArray = photos.filter(x => !itemData.photos.includes(x))
      for(const f of deletingArray) {
        deletePhoto(f)
      }
      for (const f of copyingArray) {
        const fileName = await copyPhoto(f)
        savedFiles.push(fileName)
      }
      return itemData.photos.filter(x => photos.includes(x)).concat(savedFiles)
    }
  }

   // creates item, otherwise updates it if already exists
   const handleSave = () => {
    const {assocCollections, dissocCollections} = getCollectionsLists()
    getNewPhotosArray().then(
      (newPhotos) => {
        const time = new Date()
        if(id){
          setEditing(false)
          updateItem(name, newPhotos, price, quantity, total, notes, id, assocCollections, dissocCollections, time.getTime(), setReload)
        } else {  
          createItem(name, newPhotos, price, quantity, total, notes, assocCollections, time.getTime(), time.getTime(), setId)
          setEditing(false)
        }
      }
    )
  }

  const handleRemovePhoto = (uri) => {
    const tempArray = [...photos]
    const index = tempArray.indexOf(uri)
    tempArray.splice(index, 1)
    setPhotos(JSON.parse(JSON.stringify(tempArray))) // cannot explain why
  }




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


  // modify total when price & qty change
  useEffect(() => {
    setTotal((parseFloat(price) * parseInt(quantity)).toFixed(2).toString());
  }, [price, quantity]);

  // handle delete dialog
  const handleDelete = () => {
    deleteItem(id)
    navigation.navigate('Collection', {action: 'delete', deletedId: id})
  }

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

  const validateInputs = () => {
    const priceValid = /^\d+(\d{3})*(\.\d{1,2})?$/.test(price)
    const quantityValid = /^[0-9]*$/.test(quantity)

    if(!priceValid) {
      setPriceErrorMsg(priceError)
    }
    if(!quantityValid) {
      setQuantityErrorMsg(quantityError)
    }

    const result = priceValid && quantityValid
    if(result) {
      setPriceErrorMsg(null)
      setQuantityErrorMsg(null)
    }

    return result
  }

  // onchange handler for editing collections
  const handleCollectionsEditChange = (collection) => {
    const tempObj = {}
    tempObj[collection] = !collectionsEdit[collection]
    setCollectionsEdit({...collectionsEdit, ...tempObj})
  }

  const deleteDialog = () => {
    Alert.alert(
      `Delete item ${itemData?.name}?`,
      `Are you sure? All collections with this item will lose this item.`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => handleDelete() }
      ]
    );
  }

  const imageChoiceDialog = () => {
    Alert.alert(
      `Choose one`,
      null,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Camera", onPress: () => handleImageChoice('camera') },
        { text: "Gallery", onPress: () => handleImageChoice('image-picker') }
      ]
    );
  }

  const handleGoBack = () => {
    if(itemData) {
      navigation.navigate('Collection', {action: newItem ? 'create' : 'update', itemData: itemData})
    } else if(newItem && editing) {
      navigation.navigate('Collection', {action: 'cancelCreate'})
    }
  }
  

  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
      {/* Navbar */}
      <View style={globalStyles.navBar}>
        <IconButton
          style={styles.iconButton}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={()=>handleGoBack()}
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
            onPress={()=>{
              if(JSON.stringify(collectionsEdit) !== JSON.stringify({})) {
                handleSave()
              }
            }}
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
            onPress={()=>deleteDialog()}
            iconName="delete"
            size={35}
            />
            <IconButton
            style={styles.iconButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>{
              if(itemData) {
                setEditData(itemData)
                setPriceErrorMsg(null)
                setQuantityErrorMsg(null)
                setEditing(true)
              }
              }}
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
            onPress={()=>{
              if(validateInputs() && JSON.stringify(collectionsEdit) !== JSON.stringify({})) {
                handleSave()
              }
              else {
                console.log('Failed validation')
              }
              
            }}
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
        <CustomText style={[globalStyles.headingText, styles.textContainer]}>{itemData?.name}</CustomText>
      }
      <ScrollView>
        {/* Image */}
        <View style={styles.imageHeader}>
          {
            editing ?
            <Carousel
            style={{height: 280}}
            width={450}
            data={
              photos &&
              photos.map((photo, index) => ({img: photo, index: index})).concat({img: placeholderUri, index: null})
            }
            renderItem={({ item}) => {
              return (
                <View
                  style={[styles.imagePressableContainer, styles.bubble]}
                >    
                  {
                    item.img != placeholderUri ?
                    <ImageBackground 
                      style={[styles.image, {flexDirection: 'row', alignItems: 'flex-start', padding: 10, justifyContent: 'space-between',}]} 
                      imageStyle={styles.bubble}
                      source={{uri: item.img}} 
                    >
                      <View style={styles.indexTextContainer}>
                        <CustomText style={styles.indexText}>{item.index + 1}/{photos?.length}</CustomText>
                      </View>
                      <IconButton 
                        style={styles.removeImageButton} 
                        activeOpacity={0.5} 
                        underlayColor='#ed7777' 
                        onPress={() => handleRemovePhoto(item.img)} 
                        iconName='remove' size={25} 
                        color='#fff'
                      />
                    </ImageBackground>
                    :
                    <TouchableHighlight
                      style={styles.bubble}
                      onPress={() => {
                          imageChoiceDialog()
                      }}
                      activeOpacity={0.95}
                    >
                      <Image style={styles.image} 
                      source={require('./../assets/plus-placeholder.png')}
                      />
                    </TouchableHighlight>
                  }
                </View>
              );
            }} />
            :
            itemData?.photos?.length > 0 ?
            <Carousel
            autoPlay={false}
            style={{height: 280}}
            width={450}
            data={
              itemData &&
              itemData.photos?.map((photo, index) => ({img: photo, index: index}))
            }
            renderItem={({ item }) => {
              return (
                <View
                  style={[styles.imagePressableContainer, styles.bubble]}
                >    
                  <TouchableHighlight
                      style={styles.bubble}
                      onPress={() => {
                        setImageViewerVis(true)
                      }}
                      activeOpacity={0.95}
                    >
                      <ImageBackground 
                      style={[styles.image, {flexDirection: 'row', padding: 10}]} 
                      imageStyle={styles.bubble}
                      source={{uri: item.img}} 
                      >
                        <View style={styles.indexTextContainer}>
                          <CustomText style={styles.indexText}>{item.index + 1}/{itemData?.photos?.length}</CustomText>
                        </View>
                      </ImageBackground>
                    </TouchableHighlight>
                </View>
              );
            }} />
            :
            <View style={styles.noImagesWrapper}>
              {
                itemData &&
                <CustomText style={styles.noImagesText}>No Images</CustomText>
              }
            </View>
          }
          
        </View>

        {/* Yellow panel */}
        <View style={{flex: 1, overflow: 'hidden', borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
          <View style={styles.panel}>
            <CustomText style={[styles.subHeading, styles.subHeadingText]}>Details</CustomText>
              {
                editing ? 
                <View style={styles.itemInfoBubbleGroup}>
                  <ItemInfoBubble label='Price' value={price} editing={true} onChangeText={(val) => setPrice(val)} keyboardType="numeric" errorMsg={priceErrorMsg}/>
                  <ItemInfoBubble label='Qty' value={quantity} editing={true} onChangeText={(val) => setQuantity(val)} keyboardType="numeric" errorMsg={quantityErrorMsg}/>
                  <ItemInfoBubble label='Total' data={total} editing={false}/>
                </View>
                :
                <View style={styles.itemInfoBubbleGroup}>
                  <ItemInfoBubble label='Price' data={itemData?.price} editing={false}/>
                  <ItemInfoBubble label='Qty' data={itemData?.quantity} editing={false}/>
                  <ItemInfoBubble label='Total' data={itemData?.total} editing={false}/>
                </View>
              }
            <CustomText style={[styles.subHeading, styles.subHeadingText]}>Notes</CustomText>
            <View style={{overflow: 'hidden'}}>
              <ScrollView style={styles.notesPanel}>
                {
                  editing ? 
                  <TextInput multiline={true} style={styles.notesText} value={notes} onChangeText={(val) => setNotes(val)}/>
                  :
                  <CustomText style={styles.notesText}>{itemData?.notes === '' ? 'No notes...' : itemData?.notes}</CustomText>
                }
              </ScrollView>
            </View>

            <CustomText style={[styles.subHeading, styles.subHeadingText]}>Collections</CustomText>
            {
              editing ? 
              <View style={styles.labelsGroup}>
                {Object.keys(collectionsEdit).map((collection) => {
                  if(collectionsEdit[collection]){
                    return(
                      <CustomChip chipStyle={styles.chip} chipTextStyle={styles.chipText} key={collection}>{collection}</CustomChip>
                    )
                  }
                })}
                <IconButton 
                  style={[styles.plus]} 
                  iconName='add' 
                  size={25} 
                  onPress={()=>setCollectionsDialogVis(true)}
                  activeOpacity={0.6}
                  underlayColor="#DDDDDD"
                />
              </View>
              :
              <View style={styles.labelsGroup}>
                {collectionsIn?.map((collection) => (
                  <CustomChip chipStyle={styles.chip} chipTextStyle={styles.chipText} key={collection.collection_name}>{collection.collection_name}</CustomChip>
                ))}
              </View>
              }
          </View>
        </View>

      </ScrollView>

      <Dialog.Container visible={collectionsDialogVis} onBackdropPress={() => setCollectionsDialogVis(false)} contentStyle={{width: '90%', height: '85%'}}>
        <Dialog.Title>Labels</Dialog.Title>
        <ScrollView>
          {
            Object.keys(collectionsEdit).map((collection) => {
              if(collectionsEdit[collection]){
                return(
                  <CustomCheckBox key={collection} isChecked={true} onPress={() => handleCollectionsEditChange(collection)}>
                    {collection}
                  </CustomCheckBox>
                )
              } else {
                return (
                  <CustomCheckBox key={collection} isChecked={false} onPress={() => handleCollectionsEditChange(collection)}>
                    {collection}
                  </CustomCheckBox>
                )
              }
            })
          }
        </ScrollView>
        <Dialog.Button bold={true} color='#fcca47'  label="Done" onPress={() => setCollectionsDialogVis(false)}/>
      </Dialog.Container>

      <ImageView
        images={itemData?.photos?.map((photo) => ({uri: photo}))}
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
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageHeader: {
    width: '100%',
    alignItems: 'center',
  },
  imagePressableContainer: {
    marginLeft: 50,
    marginRight: 50,
    marginTop: 10,
  },
  bubble: {
    borderRadius: 30,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 30,
  },
  panel: {
    paddingBottom: '30%',
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
    marginLeft: 25,
    marginRight: 25
  },
  notesText: {
    margin: 10,
    fontSize: 20,
    fontFamily: 'Montserrat'
  },
  plus: {
    marginTop: 9,
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
    borderRadius: 100,
  },
  noImagesWrapper: {
    height: 250,
    width: 450,
    justifyContent:'center',
    alignItems: 'center'
  },
  noImagesText: {
    fontSize: 35
  },

  removeImageButton: {
    backgroundColor: '#ff0505',
    width: 35,
    height: 35,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  indexTextContainer: {
    backgroundColor: '#fff',
    padding: 6,
    height: '20%',
    borderRadius: 30,
    opacity: 0.9
  },
  indexText: {
    fontSize: 25,
    color: '#000',
  },
  chip: {
    margin: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    borderRadius: 16
  },
  chipText: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    padding: 3
  },
  itemInfoBubbleGroup: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20, 

    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsGroup: {
    flexDirection: 'row',
    marginLeft: 20, 
    marginRight: 20, 
    marginBottom: 60, 
    flexWrap: 'wrap'
  }

})