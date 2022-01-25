import React, {useState, useEffect} from 'react'
import { View, ScrollView, StyleSheet, TextInput, Alert } from 'react-native'
import globalStyles from '../styles/globalStyles'
import SortBy from '../components/SortBy'
import ItemBubble from '../components/ItemBubble'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import { getFromItems, deleteCollection, updateCollection, createCollection, getItemsWithoutCollection,
collectionDuplicateError, collectionDBSuccess } from '../utils/DAO'
import { useIsFocused } from '@react-navigation/native'
import { abbreviate, numberWithCommas } from '../utils/utils'

const reservedCollection = 'Items Without Collections'
const reservedCollectionError = 'Cannot use this reserved name!'
const emptyCollectionError = 'Cannot be empty!'

const sortingLabels = [
  {label: 'A-Z', value: 'A-Z'},
  {label: 'Z-A', value: 'Z-A'},
  {label: 'Total Highest', value: 'Total Highest'},
  {label: 'Total Lowest', value: 'Total Lowest'},
  {label: 'Last Modified', value: 'Last Modified'},
  {label: 'Price Highest', value: 'Price Highest'},
  {label: 'Price Lowest', value: 'Price Lowest'},
  {label: 'Qty Highest', value: 'Qty Highest'},
  {label: 'Qty Lowest', value: 'Qty Lowest'},
  {label: 'Date Created', value: 'Date Created'},
]


export default function Collection({route, navigation}) {
  // data from navigation
  const isFocused = useIsFocused();
  const [collection, setCollection] = useState(route.params?.collection);

  // data from database
  const [items, setItems] = useState(null)

  // to reload itembubbles on focus
  const [reload, setReload] = useState(0)

  // states for condition
  const [editing, setEditing] = useState(collection ? false : true)
  const [newName, setNewName] = useState(route.params?.collection ? route.params.collection : '')
  const [errorMsg, setErrorMsg] = useState(null);
  
  // calculated values
  const [itemsTotal, setItemsTotal] = useState(0)
  const [quantitiesTotal, setQuantitiesTotal] = useState(0)
  
  // sorting
  const [option, setOption] = useState('Date Created')

  useEffect(() => {
    if(items) {
      let tempItems = items
      switch (option) {
        case 'A-Z':
          setItems(tempItems.sort(compareAlpha))
          break;
        case 'Z-A':
          setItems(tempItems.sort(compareAlpha).reverse())
          break;
        case 'Total Highest':
          setItems(tempItems.sort(compareTV))
          break;
        case 'Total Lowest':
          setItems(tempItems.sort(compareTV).reverse())
          break;
        case 'Last Modified':
          setItems(tempItems.sort(compareMod))
          break;
        case 'Price Highest':
          setItems(tempItems.sort(comparePrice))
          break;
        case 'Price Lowest':
          setItems(tempItems.sort(comparePrice).reverse())
          break;
        case 'Qty Highest':
          setItems(tempItems.sort(compareQty))
          break;
        case 'Qty Lowest':
          setItems(tempItems.sort(compareQty).reverse())
          break;
        case 'Date Created':
          setItems(tempItems.sort(compareCreated))
          break;
        default:
          break;
      }
    }
  }, [option])

  

  useEffect(() => {
    if(isFocused && collection) {
      if(collection === reservedCollection) {
        getItemsWithoutCollection(setItems)
      }
      else {
        getFromItems(collection, setItems)
      }
      setReload((val) => val + 1)
    }
  }, [isFocused])


  useEffect(() => {
    if(items) {
      let tempItemsTotal = 0
      let tempQuantitiesTotal = 0
      items.forEach(item => {
        tempItemsTotal += item.total
        tempQuantitiesTotal += item.quantity
      });

      setItemsTotal(tempItemsTotal)
      setQuantitiesTotal(tempQuantitiesTotal)
    }
    
  }, [items])

  const handleDelete = () => {
    deleteCollection(collection)
    navigation.navigate('Main')
  }

  const handleCancelEdit = () => {
    if(collection) {
      setNewName('')
      setErrorMsg(null)
      setEditing(false)
    } else {
      navigation.goBack()
    }
  }

  const handleEdit = () => {
    if(newName === ''){
      setErrorMsg(emptyCollectionError)
    } else if (newName === reservedCollection) {
      setErrorMsg(reservedCollectionError)
    } else {
      const time = new Date()
      if(collection) {
        updateCollection(collection, newName, time.getTime(), setErrorMsg)
      } else {
        createCollection(newName, time.getTime(), time.getTime(), setErrorMsg)
        getFromItems(newName, setItems)
      }
    }
  }

  useEffect(() => {

    const isSuccess = errorMsg === collectionDBSuccess;
    if(isSuccess) {
      setReload((val) => val + 1)
      setCollection(newName)
      setEditing(false)
      setErrorMsg(null)
    }

  }, [errorMsg]);
  

  const deleteDialog = () => {
    Alert.alert(
      `Delete collection - ${collection}?`,
      `You cannot undo this action. All items will remain either in other collections or the 'no collections' collection.`,
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
          collection !== reservedCollection &&
          <View style={{flexDirection: 'row'}}>
            {
              collection &&
              <IconButton
                style={styles.iconButton}
                activeOpacity={0.6}
                underlayColor="#DDDDDD"
                onPress={()=>deleteDialog()}
                iconName="delete"
                size={35}
              />
            }
          
            {
              editing ?
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
              onPress={()=>{
                setNewName(collection)
                setEditing(true)
              }}
              iconName="edit"
              size={35}
              />
            }
          </View>
        }
        
      </View>

      {/* Name of collection */}
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          {editing ?
            <View style={styles.container}> 
              <TextInput style={[globalStyles.headingTextEdit]} value={newName} onChangeText={val => setNewName(val)}/>
              {
                errorMsg && errorMsg !== collectionDBSuccess &&
                <CustomText style={styles.errorText}>{errorMsg}</CustomText>
              }
            </View>
          :
            <View style={styles.titleQuantityContainer}>
              <CustomText style={globalStyles.headingText}>{collection}</CustomText>
              <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>{items && items.length}</CustomText>
            </View>
          }
        </View>
        
        <View style={styles.subHeadingContainer}>
          <CustomText style={[styles.subHeading, styles.mr]}>Total: ${numberWithCommas(itemsTotal)}</CustomText>
          <CustomText style={styles.subHeading}>Qty: {quantitiesTotal}</CustomText>
        </View>
        
        
      </View>

      {/* Sort and add item */}
      <View style={styles.options}>
          <SortBy style={{marginLeft:30}} value={option} setValue={setOption} labels={sortingLabels}/>
          {
            (!editing && collection !== reservedCollection) &&
            <IconButton
              style={[styles.iconButton, styles.plus]}
              activeOpacity={0.6}
              underlayColor="#ffdd85"
              onPress={()=>navigation.navigate('Item', {collection: collection})}
              iconName="add"
              size={43}
            />
          }
      </View>

      {/* Items */}
      <View style={styles.container}>
        <View style={styles.panel}>
          {
            items &&
            <View style={styles.container}>
              {
              items.length > 0 ?
              <ScrollView style={styles.scrollView}>
                {
                  items.map((item) => (
                    <ItemBubble navigation={navigation} key={item.id} 
                    id={item.id} name={item.name} photo={item.photos[0]} 
                    price={item.price} quantity={item.quantity} 
                    total={item.total} reload={reload}
                    />
                  ))
                }
              </ScrollView>
              :
              (!editing && collection !== reservedCollection) ?
              <View style={styles.callToActionWrapper}> 
                  <CustomText style={styles.callToActionEmoji}>☝🏼</CustomText>
                  <CustomText style={styles.callToAction}>Add an item!</CustomText>
              </View>
              :
              <View></View>
              }
          </View>
          }
          
          
        </View>
      </View>

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
  titleQuantityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
  },
  ml: {
    marginLeft: 10,
  },
  mr: {
    marginRight: 10,
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
    justifyContent: 'space-between'
  },
  scrollView: {

  },
  plus: {
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
    marginRight: 20,
    marginBottom: 10
  },
  callToActionWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  callToAction : {
    fontSize: 20,
    marginRight: 5, 
    marginLeft:5,
    textAlign: "center"

  },
  callToActionEmoji : {
    fontSize: 50,
    marginLeft: '5%',
    marginBottom: '5%',
    transform: [{ rotate: '45deg'}, { scaleX: -1 }]
  },
  errorText: {
    color: '#cf2c06',
    fontSize: 18,
    marginVertical: 5,
  }
  
})


const compareAlpha = (a,b) => {
  if(a.name > b.name) { return -1 }
  if(b.name > a.name) { return 1 }
  return 0
}

const comparePrice = (a,b) => {
  if(a.price > b.price) { return 1 }
  if(b.price > a.price) { return -1 }
  return 0
}

const compareQty = (a,b) => {
  if(a.quantity > b.quantity) { return 1 }
  if(b.quantity > a.quantity) { return -1 }
  return 0
}

const compareTV = (a,b) => {
  if(a.total > b.total) { return 1 }
  if(b.total > a.total) { return -1 }
  return 0
}

const compareCreated = (a,b) => {
  if(a.created > b.created) { return -1 }
  if(b.created > a.created) { return 1 }
  return 0
}

const compareMod = (a,b) => {
  if(a.modified > b.modified) { return -1 }
  if(b.modified > a.modified) { return 1 }
  return 0
}
