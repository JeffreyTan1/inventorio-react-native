import React, {useState, useEffect} from 'react'
import { View, ScrollView, StyleSheet, TextInput } from 'react-native'
import globalStyles from '../styles/globalStyles'
import SortBy from '../components/SortBy'
import ItemBubble from '../components/ItemBubble'
import CustomText from '../components/CustomText'
import IconButton from '../components/IconButton'
import { searchItems } from '../utils/DAO'
import { useIsFocused } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { abbreviate } from '../utils/utils'
import { getAllCollections } from '../utils/DAO'
import Dialog from 'react-native-dialog'
import CustomCheckBox from '../components/CustomCheckBox'
import { TouchableOpacity } from 'react-native-gesture-handler'

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
  const [allCollections, setAllCollections] = useState(null);
  const [selectedCollections, setSelectedCollections] = useState(null);
  const [collectionsDialogVis, setCollectionsDialogVis] = useState(false);

  const sortItems = (array) => {
    let tempItems = [...array]
    switch (option) {
      case 'A-Z':
        setItems(tempItems.sort(compareAlpha).reverse())
        break;
      case 'Z-A':
        setItems(tempItems.sort(compareAlpha))
        break;
      case 'Total Highest':
        setItems(tempItems.sort(compareTV).reverse())
        break;
      case 'Total Lowest':
        setItems(tempItems.sort(compareTV))
        break;
      case 'Last Modified':
        setItems(tempItems.sort(compareMod))
        break;
      case 'Price Highest':
        setItems(tempItems.sort(comparePrice).reverse())
        break;
      case 'Price Lowest':
        setItems(tempItems.sort(comparePrice))
        break;
      case 'Qty Highest':
        setItems(tempItems.sort(compareQty).reverse())
        break;
      case 'Qty Lowest':
        setItems(tempItems.sort(compareQty))
        break;
      case 'Date Created':
        setItems(tempItems.sort(compareCreated))
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if(items) {
      sortItems(items)
    }
  }, [option])

  useEffect(() => {
    if(isFocused) {
      runSearch()
      setReload((val) => val + 1)
    }
  }, [isFocused])

  useEffect(() => {
    getAllCollections(setAllCollections)
  }, [])

  useEffect(() => {
    if(allCollections) {
      const tempObj = {}
      allCollections.forEach((collection) => { tempObj[collection.name] = false })
      setSelectedCollections({...tempObj})
    }
  }, [allCollections])

  const handleSelectedCollectionsChange = (collection) => {
    const tempObj = {}
    tempObj[collection] = !selectedCollections[collection]
    setSelectedCollections({...selectedCollections, ...tempObj})
  }

  useEffect(() => {
    runSearch()
    setOption('Date Created')
  }, [query]);
  
  const runSearch = () => {
    if(query !== '') {
      const queryCollections = []
      Object.keys(selectedCollections).forEach((collection) => {
        if(selectedCollections[collection]) {
          queryCollections.push(collection)
        }
      })
      searchItems(query, setItems, queryCollections)
    }
  }

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
    <View style={[styles.container, {backgroundColor: '#fff'}]}>
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
        <View style={styles.searchActions}>
          <View style={styles.searchBar}>
            <TextInput 
              style={styles.searchText} 
              value={query} 
              onChangeText={setQuery}
            />
            <Icon name='search' style={styles.searchIcon}/>
          </View>
          <IconButton
            style={styles.filterButton}
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={()=>setCollectionsDialogVis(true)}
            iconName="filter-list"
            size={30}
          />
        </View>
        <View style={styles.infoGroup}>
          <CustomText style={[styles.infoText, styles.mr]}>Search Results: {items?.length ? abbreviate(items?.length) : 0}</CustomText>
          <CustomText style={[styles.mr, styles.infoText]}>Total: ${abbreviate(itemsTotal)}</CustomText>
          <CustomText style={styles.infoText}>Qty: {abbreviate(quantitiesTotal)}</CustomText>
        </View>
        <SortBy value={option} setValue={setOption} labels={sortingLabels}/>
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

        {
          selectedCollections &&
          <Dialog.Container visible={collectionsDialogVis} onBackdropPress={() => setCollectionsDialogVis(false)} contentStyle={{width: '90%', height: '85%'}}>
            <Dialog.Title>Collections</Dialog.Title>
              <ScrollView>
                { 
                  Object.keys(selectedCollections).map((collection) => {
                    if(selectedCollections[collection]){
                      return(
                        <CustomCheckBox key={collection} isChecked={true} onPress={() => handleSelectedCollectionsChange(collection)}>
                          {collection}
                        </CustomCheckBox>
                      )
                    } else {
                      return (
                        <CustomCheckBox key={collection} isChecked={false} onPress={() => handleSelectedCollectionsChange(collection)}>
                          {collection}
                        </CustomCheckBox>
                      )
                    }
                  })
                }
              </ScrollView>
            <Dialog.Button bold={true} color='#fcca47'  label="Done" onPress={() => setCollectionsDialogVis(false)}/>
          </Dialog.Container>
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
  filterButton: {
    borderRadius: 5 ,
    padding: 10,
  },
  navBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    borderWidth: 2,
    borderRadius: 5,
    padding: '1.5%',
    borderColor: '#bababa',
    flex: 1
  },
  searchBarContainer: {
    marginHorizontal: '5%',
    marginTop: '1%',
    marginBottom: '1%',
  },
  searchText: {
    fontSize: 25,
    fontFamily: 'Montserrat'
  },
  searchIcon: {
    position: 'absolute',
    fontSize: 30,
    right: '4%',
    top: '20%',
    color: '#c4c4c4'
  },
  panel: {
    flex: 1,
    backgroundColor: '#fcca47',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden'
  },
  subHeadingText: {
    fontSize: 16.5
  },
  infoText: {
    fontSize: 15,
  },
  mr:{
    marginRight: '2.5%'
  },
  infoGroup: {
    flexDirection: 'row',
  },
  searchActions: {
    flexDirection: 'row',
    marginBottom: '2.5%',
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
