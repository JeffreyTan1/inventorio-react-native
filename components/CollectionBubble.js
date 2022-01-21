import React from 'react'
import { View, StyleSheet } from 'react-native'
import {TouchableHighlight} from 'react-native-gesture-handler'
import CustomText from './CustomText'

export default function CollectionBubble({navigation, name}) {
  return (
    <TouchableHighlight
    style={styles.pressableContainer}
    activeOpacity={0.9}
    underlayColor="#f2f2f2"
    onPress={()=>navigation.navigate('Collection', {collection: name})}>
      <View style={styles.container}>
        <View style={styles.details}>
          <CustomText style={styles.collectionText}>{name}</CustomText>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pressableContainer: {
    height: 155,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 4,
  },
  details: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  collectionText: {
    fontSize: 30,
    marginHorizontal: 10
  }
})