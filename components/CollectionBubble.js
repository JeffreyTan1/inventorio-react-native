import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import {TouchableHighlight} from 'react-native-gesture-handler'
import CustomText from './CustomText'
import { getCollectionInfo } from '../utils/DAO'
import { abbreviate } from '../utils/utils'
import { useSelector } from 'react-redux'

export default function CollectionBubble({navigation, name}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);
  const [collectionData, setCollectionData] = useState(null);
  
  useEffect(() => {
    getCollectionInfo(name, setCollectionData)
  }, []);
  
  return (
    collectionData &&
    <TouchableHighlight
    style={[styles.pressableContainer, {backgroundColor: colorState.background,
    shadowColor: colorState.text}]}
    activeOpacity={0.9}
    underlayColor={colorState.underlayLight}
    onPress={()=>navigation.navigate('Collection', {collection: name})}>
      <View style={styles.container}>
        <CustomText style={styles.collectionText} numberOfLines={2}>{name}</CustomText>
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
    fontSize: 10
  },
  infoBubbleText: {

  },
  pressableContainer: {
    marginVertical: 7,
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 3,
  },
  collectionText: {
    fontSize: 25,
    marginHorizontal: 10
  },

})