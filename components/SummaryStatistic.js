import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomText from '../components/CustomText'


export default function SummaryStatistic({title, value}) {
  return (
    <View style={styles.container}>
      <CustomText>{title}</CustomText>
      <View style={styles.chip}><CustomText>{value}</CustomText></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    borderRadius: 16,
    backgroundColor: '#C4C4C4',
    padding: 7,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center'
  }
})