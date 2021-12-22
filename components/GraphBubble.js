import React from 'react'
import { View, Text,StyleSheet } from 'react-native'
import CustomText from './CustomText'

export default function GraphBubble({stat}) {
  return (
    <View style={styles.container}>
      <CustomText>{stat}</CustomText>
      <View style={styles.graph}>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10
  },
  graph: {
    flex: 1,
    backgroundColor: 'lightgrey',
    borderRadius: 16,
  },
  
})