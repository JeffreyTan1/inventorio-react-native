import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'
import { getItemCollections } from '../utils/DAO'
import CustomChip from './CustomChip'
import { abbreviate, numberWithCommas } from '../utils/utils'
import { MotiView } from 'moti'

export default function ItemBubble({navigation, id, name, photo, price, quantity, total, reload}) {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getItemCollections(id, setCollections)
  }, [reload])

  return (
    <MotiView
    from={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{
      type: 'timing',
      duration: 175
    }}
    >

    <TouchableHighlight
    style={styles.pressableContainer}
    activeOpacity={0.95}
    underlayColor="#f2f2f2"
    onPress={()=>navigation.navigate('Item', {id: id})}>
      <View style={styles.container}>
        {
          photo === undefined ?
          <Image
            style={styles.image}
            source={require('./../assets/adaptive-icon.png')}
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
                <CustomChip chipStyle={styles.chip} chipTextStyle={styles.chipText} key={collection.collection_name}>{collection.collection_name}</CustomChip>
              )
              )
            }
          </View>
        </View>
        
      </View>
    </TouchableHighlight>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1
  },
  pressableContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    shadowColor: "#000",
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
    fontSize: 10,
    fontFamily: 'Montserrat',
    padding: 3
  }
})