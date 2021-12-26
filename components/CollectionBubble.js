import React from 'react'
import { View, StyleSheet, Image, TouchableHighlight } from 'react-native'
import CustomText from './CustomText'
export default function CollectionBubble({navigation, name, image}) {
  return (
    <TouchableHighlight
    style={styles.pressableContainer}
    activeOpacity={0.9}
    underlayColor="#f2f2f2"
    onPress={()=>navigation.navigate('Collection', {collection: name})}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('./../assets/4x3-placeholder.png')}
        />
        <View style={styles.details}>
          <CustomText>{name}</CustomText>
        </View>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  pressableContainer: {
    height: 150,
    width: 150,
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
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  details: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})