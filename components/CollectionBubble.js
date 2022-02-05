import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import {TouchableHighlight} from 'react-native-gesture-handler'
import CustomText from './CustomText'
import { getCollectionInfo } from '../utils/DAO'
import { abbreviate } from '../utils/utils'

export default function CollectionBubble({navigation, name}) {
  const [collectionData, setCollectionData] = useState(null);
  
  useEffect(() => {
    getCollectionInfo(name, setCollectionData)
  }, []);
  
  return (
    collectionData &&
    <TouchableHighlight
    style={styles.pressableContainer}
    activeOpacity={0.9}
    underlayColor="#f2f2f2"
    onPress={()=>navigation.navigate('Collection', {collection: name})}>
      <View style={styles.container}>
        <CustomText style={styles.collectionText}>{name}</CustomText>
        <View style={styles.infoBubbleGroup}>
          <View style={styles.infoBubble}>
            <CustomText style={styles.infoBubbleLabel}>Items</CustomText>
            <CustomText style={styles.infoBubbleText}>{abbreviate(collectionData.items_count)}</CustomText>
          </View>
          <View style={styles.infoBubble}>
            <CustomText style={styles.infoBubbleLabel}>Total</CustomText>
            <CustomText style={styles.infoBubbleText}>{abbreviate(collectionData.items_total)}</CustomText>
          </View>
          <View style={styles.infoBubble}>
            <CustomText style={styles.infoBubbleLabel}>Qty</CustomText>
            <CustomText style={styles.infoBubbleText}>{abbreviate(collectionData.quantities_total)}</CustomText>
          </View>
        </View>
        
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  infoBubbleGroup: {
    flexDirection: 'row',
    flexBasis: '50%',
    justifyContent: 'space-between',
 
  },
  infoBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '6%'
  },
  infoBubbleLabel: {
    fontSize: 11
  },
  infoBubbleText: {

  },
  pressableContainer: {
    marginVertical: 7,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 3,
  },
  collectionText: {
    fontSize: 30,
    marginHorizontal: 10
  },

})