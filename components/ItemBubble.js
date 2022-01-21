import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'
import { getItemCollections } from '../utils/DAO'
import CustomChip from './CustomChip'

export default function ItemBubble({navigation, id, name, photo, price, quantity, total, reload}) {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getItemCollections(id, setCollections)
  }, [reload])
  

  return (
    <TouchableHighlight
    style={styles.pressableContainer}
    activeOpacity={0.95}
    underlayColor="#f2f2f2"
    onPress={()=>navigation.navigate('Item', {id: id})}>
      <View style={styles.container}>
        {
          photo === '' ?
          <Image
            style={styles.image}
            source={require('./../assets/4x3-placeholder.png')}
          />
          :
          <Image
            style={styles.image}
            source={{uri: photo}}
          />
        }
        <View 
          style={styles.details}
        >
          <View style={styles.title}>
            <CustomText style={styles.titleText}>
              {name}
            </CustomText>
            <CustomText style={[styles.titleText, globalStyles.halfOpacity]}>
              {quantity}
            </CustomText>
          </View>
          <View style={styles.iconInfo}>
            <Icon name="dollar-sign"/>
            <CustomText style={styles.ml}>
              {price}
            </CustomText>
          </View>
          <View style={styles.iconInfo}>
            <Icon name="money-bill-alt"/>
            <CustomText style={styles.ml}>
              {total}
            </CustomText>
          </View>
          <View style={styles.chipGroup}>
            {
              collections.map((collection) => (
                <CustomChip chipStyle={styles.chip} chipTextStyle={styles.chipText} key={collection.collection_name}>{collection.collection_name}</CustomChip>
              )
              )
            }
          </View>
        </View>
        
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1
  },
  pressableContainer: {
    minHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: '50%',
    height: '100%',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30
  },
  details: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight:21,
    width: '50%'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  titleText: {
    fontSize: 25,
    
  },
  iconInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  ml: {
    marginLeft: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    marginTop: 15,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#ebebeb',
    borderColor: 'black',
    paddingHorizontal: 3,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 5
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    padding: 3
  }
})