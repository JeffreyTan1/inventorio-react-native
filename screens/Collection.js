import React, {useState, useEffect} from 'react'
import { View, ScrollView, StyleSheet, TextInput } from 'react-native'
import globalStyles from '../styles/globalStyles'
import SortBy from '../components/SortBy'
import ItemBubble from '../components/ItemBubble'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import Dialog from 'react-native-dialog'
import { getFromItems, deleteCollection, updateCollection, createCollection } from '../utils/DAO'
import { useIsFocused } from '@react-navigation/native'

const sortingLabels = [
  {label: 'A-Z', value: 'A-Z'},
  {label: 'Z-A', value: 'Z-A'},
  {label: 'Price Highest', value: 'Price Highest'},
  {label: 'Price Lowest', value: 'Price Lowest'},
  {label: 'Qty Highest', value: 'Qty Highest'},
  {label: 'Qty Lowest', value: 'Qty Lowest'},
  {label: 'Total Value Highest', value: 'Total Value Highest'},
  {label: 'Total Value Lowest', value: 'Total Value Lowest'},
]

export default function Collection({route, navigation}) {
  // data from navigation
  const isFocused = useIsFocused();
  const [collection, setCollection] = useState(route.params?.collection);

  // data from database
  const [items, setItems] = useState([])

  // states for conditional rendering
  const [editing, setEditing] = useState(collection ? false : true)
  const [newName, setNewName] = useState('')
  const [delDialogVis, setDelDialogVis] = useState(false)
  
  // calculated values
  const [itemsTotal, setItemsTotal] = useState(0)
  const [quantitiesTotal, setQuantitiesTotal] = useState(0)

  // sorting
  const [option, setOption] = useState('A-Z')
  useEffect(() => {
    let tempItems = items
    switch (option) {
      case 'A-Z':
        setItems(tempItems.sort(compareAlpha))
        break;
      case 'Z-A':
        setItems(tempItems.sort(compareAlpha).reverse())
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
      case 'Total Value Highest':
        setItems(tempItems.sort(compareTV))
        break;
      case 'Total Value Lowest':
        setItems(tempItems.sort(compareTV).reverse())
        break;
      default:
        break;
    }
  }, [option])

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

  useEffect(() => {
    if(isFocused && collection) {
      getFromItems(collection, setItems)
    }
  }, [isFocused])

  useEffect(() => {
    let tempItemsTotal = 0
    let tempQuantitiesTotal = 0
    items.forEach(item => {
      tempItemsTotal += item.total
      tempQuantitiesTotal += item.quantity
    });

    setItemsTotal(tempItemsTotal)
    setQuantitiesTotal(tempQuantitiesTotal)
  }, [items])

  const handleDelete = () => {
    deleteCollection(collection)
    setDelDialogVis(false)
    navigation.navigate('Main')
  }

  const handleCancelEdit = () => {
    if(collection) {
      setNewName('')
      setEditing(false)
    } else {
      navigation.goBack()
    }
  }

  const handleEdit = () => {
    if(newName !== '') {
      if(collection) {
        updateCollection(collection, newName)
      } else {
        createCollection(newName)
      }
      setCollection(newName)
    }
    setEditing(false)
  }

  return (
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
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

        <View style={{flexDirection: 'row'}}>
          {
            collection &&
            <IconButton
              style={styles.iconButton}
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              onPress={()=>setDelDialogVis(true)}
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
            onPress={()=>setEditing(true)}
            iconName="edit"
            size={35}
            />
          }
          
        </View>
      </View>

      {/* Name of collection */}
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          {editing ?
            <TextInput style={[globalStyles.headingTextEdit, styles.container]} value={newName} onChangeText={val => setNewName(val)}/>
          :
            <CustomText style={globalStyles.headingText}>{collection}</CustomText>
          }
          <CustomText style={[globalStyles.headingText, globalStyles.halfOpacity]}>{items.length}</CustomText>
        </View>
        <View style={styles.subHeadingContainer}>
          <CustomText style={styles.subHeading}>Total: ${itemsTotal}</CustomText>
          <CustomText style={[styles.subHeading, styles.ml]}>Qty: {quantitiesTotal }</CustomText>
        </View>
      </View>

      {/* Sort and add item */}
      <View style={styles.options}>
          <SortBy style={{marginLeft:30}} value={option} setValue={setOption} labels={sortingLabels}/>
          {
            !editing &&
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
      
      <Dialog.Container visible={delDialogVis} onBackdropPress={() => setDelDialogVis(false)}>
        <Dialog.Title>Delete collection - {collection}?</Dialog.Title>
        <Dialog.Description>
          Do you want to delete this collection? You cannot undo this action.
          All items will remain either in other collections or the 'no collections' collection.
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDelDialogVis(false)}/>
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
    marginBottom: 10,
    marginLeft: 28
  },
  
})