import React from 'react'
import { View, StyleSheet, TextInput } from 'react-native'
import CustomText from './CustomText'

export default function ItemInfoBubble({label, data, editing, value, onChangeText, keyboardType}) {
  return (
    <View style={styles.container}>
      <CustomText style={styles.label}>{label}</CustomText>
      {
        editing ? 
        <TextInput style={[styles.data, styles.edit]} value={value} onChangeText={onChangeText} keyboardType={keyboardType}/>
        :
        <CustomText style={styles.data}>{data}</CustomText>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flex: 1,
    borderRadius: 13,
    padding: 10,
    backgroundColor: '#fff',
    margin: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 2,
  },
  data: {
    fontSize: 24,
    fontFamily: 'Montserrat-bold'
  },
  edit: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  }
})