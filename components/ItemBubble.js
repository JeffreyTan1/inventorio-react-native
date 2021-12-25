import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import globalStyles from '../styles/globalStyles'
import CustomText from '../components/CustomText'

export default function ItemBubble({navigation, id, name, photo, price, quantity, total}) {
  return (
    <TouchableOpacity
    activeOpacity={0.95}
    underlayColor="#DDDDDD"
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
            <Icon name="money-bill-alt"/>
            <CustomText>
              {price}
            </CustomText>
          </View>
          <View style={styles.iconInfo}>
            <Icon name="dollar-sign"/>
            <CustomText>
              {total}
            </CustomText>
          </View>
          <View>

          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 150,
    flexDirection: 'row',
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
    justifyContent: 'space-between'
  },
  titleText: {
    fontSize: 25,
    
  },
  iconInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    
  }
})