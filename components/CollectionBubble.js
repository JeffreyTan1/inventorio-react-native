import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import CustomText from './CustomText'
import { Platform } from 'react-native';

const TouchableOpacity = 
    Platform.OS === 'ios' ? require('react-native').TouchableOpacity : require('react-native-gesture-handler').TouchableOpacity;

export default function CollectionBubble({navigation}) {
  return (
    <TouchableOpacity
    // style={{borderWidth: 1, borderColor: 'yellow'}}
    activeOpacity={0.9}
    underlayColor="#DDDDDD"
    onPress={()=>navigation.navigate('Collection')}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('./../assets/gprox.png')}
        />
        <View style={styles.details}>
          <CustomText>Entertainment</CustomText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 210,
    width: 210,
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