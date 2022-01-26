import React, {useState, useEffect, useMemo} from 'react'
import { View, ScrollView, StyleSheet, TextInput, Alert } from 'react-native'
import globalStyles from '../styles/globalStyles'
import SortBy from '../components/SortBy'
import ItemBubble from '../components/ItemBubble'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import { getFromItems, updateCollection, createCollection, getItemsWithoutCollection, collectionDBSuccess, searchItems } from '../utils/DAO'
import { useIsFocused } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { numberWithCommas } from '../utils/utils'

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


export default function Search({route, navigation}) {
  // data from navigation
  const isFocused = useIsFocused();

  // data from database
  const [items, setItems] = useState(null)

  // to reload itembubbles on focus
  const [reload, setReload] = useState(0)

  // states for condition
  const [query, setQuery] = useState('')
  
  // calculated values
  const [itemsTotal, setItemsTotal] = useState(0)
  const [quantitiesTotal, setQuantitiesTotal] = useState(0)

  // sorting
  const [option, setOption] = useState('Date Created');

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
    if(isFocused) {
      searchItems(query, setItems)
      setReload((val) => val + 1)
    }
  }, [isFocused])

  useEffect(() => {
    searchItems(query, setItems)
  }, [query]);
  

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

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={globalStyles.navBar}>
        <View style={styles.navBarContent}>
          <IconButton
          style={styles.iconButton}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={()=>navigation.goBack()}
          iconName="arrow-back-ios"
          size={35}
          />
          <CustomText style={globalStyles.headingText}>Search Items</CustomText>
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput 
            style={styles.searchText} 
            value={query} 
            onChangeText={setQuery}
          />
          <Icon name='search' style={styles.searchIcon}/>
        </View>
        <CustomText style={styles.subHeadingText}>Search Results: {items?.length}</CustomText>
        <View style={styles.subHeadingContainer}>
          <CustomText style={[styles.mr]}>Total: ${numberWithCommas(itemsTotal)}</CustomText>
          <CustomText>Qty: {quantitiesTotal}</CustomText>
        </View>
      </View>

      


      <View style={styles.panel}>
        {
        items &&
        <View style={styles.container}>
          {
          items.length > 0 &&
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
          }
        </View>
        }
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
  navBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 7,
    borderColor: '#bababa',
    marginBottom: 10
  },
  searchBarContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  searchText: {
    fontSize: 30,
    fontFamily: 'Montserrat'
  },
  searchIcon: {
    position: 'absolute',
    fontSize: 30,
    right: 15,
    top: 12.5,
    color: '#c4c4c4'
  },
  panel: {
    flex: 1,
    backgroundColor: '#fcca47',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  subHeadingText: {
    fontSize: 20
  },
  mr:{
    marginRight: 10
  },
  subHeadingContainer: {
    flexDirection: 'row',
  },
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
