import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomText from './CustomText'

export default function ItemInfoBubble({label, value}) {
  return (
    <View style={styles.container}>
      <CustomText style={styles.label}>{label}</CustomText>
      <CustomText style={styles.value}>{value}</CustomText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 13,
    padding: 10,
    backgroundColor: 'lightgrey',
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
  label: {

  },
  value: {
    fontSize: 24,
    fontFamily: 'Montserrat-bold'
  }
})