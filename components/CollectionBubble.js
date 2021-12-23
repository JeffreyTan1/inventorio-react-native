import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import CustomText from './CustomText'
import { Platform } from 'react-native';

const TouchableOpacity = 
    Platform.OS === 'ios' ? require('react-native').TouchableOpacity : require('react-native-gesture-handler').TouchableOpacity;

export default function CollectionBubble({navigation, name, image}) {
  return (
    <TouchableOpacity
    activeOpacity={0.9}
    underlayColor="#DDDDDD"
    onPress={()=>navigation.navigate('Collection', {name: name})}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('./../assets/gprox.png')}
        />
        <View style={styles.details}>
          <CustomText>{name}</CustomText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 10,
    flexDirection: 'column',
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