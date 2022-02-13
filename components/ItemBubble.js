import React, {useEffect, useState} from 'react'
import { View, StyleSheet, Image, TouchableHighlight } from 'react-native'
import CustomText from '../components/CustomText'
import { getItemCollections } from '../utils/DAO'
import CustomChip from './CustomChip'
import { abbreviate } from '../utils/utils'
import { useSelector } from 'react-redux'
import Bag from './Bag'

export default function ItemBubble({navigation, id, name, photo, price, quantity, total, reload}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getItemCollections(id, setCollections)
  }, [reload])

  return (


    <TouchableHighlight
    style={[styles.pressableContainer, {backgroundColor: colorState.background,
    shadowColor: colorState.text}]}
    activeOpacity={0.95}
    underlayColor={colorState.underlayLight}
    onPress={()=>navigation.navigate('Item', {id: id})}>
      <View style={styles.container}>
        {
          photo === undefined ?
          <Bag/>
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
            <CustomText style={styles.titleText} numberOfLines={2}>
              {name}
            </CustomText>
          </View>
          <View style={styles.iconInfoContainer}>
            <View style={styles.iconInfo}>
              <CustomText>Qty</CustomText>
              <CustomText style={styles.ml}>
                {abbreviate(quantity)}
              </CustomText>
            </View>
            <View style={styles.iconInfo}>
              <CustomText>Total</CustomText>
              <CustomText style={styles.ml}>
                {abbreviate(total)}
              </CustomText>
            </View>
          </View>
          
          <View style={styles.chipGroup}>
            {
              collections.map((collection) => (
                <CustomChip chipStyle={[styles.chip, {backgroundColor: colorState.grey}]} chipTextStyle={styles.chipText} key={collection.collection_name} numberOfLines={1}>{collection.collection_name}</CustomChip>
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
    flex: 1,
  },
  pressableContainer: {
    borderRadius: 15,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 4,
  },
  image: {
    width: '50%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15
  },
  details: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 8,
    width: '50%',
    minHeight: 80
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  titleText: {
    flex: 1,
    fontSize: 20,
  },
  iconInfoContainer: {
    flexDirection: 'row',
  },
  iconInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ml: {
    marginLeft: 10,
  },
  chipGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
    maxHeight: 30,
    overflow: 'hidden',
  },
  chip: {
    borderColor: 'black',
    paddingHorizontal: 3,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 5
  },
  chipText: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    padding: 3
  }
})