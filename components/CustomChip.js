import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import CustomText from './CustomText'

export default function CustomChip({children, onPress}) {
  return (
    <MotiView 
    from={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    transition={{
      type: 'timing',
      duration: 200
    }}
    >
      <View style={styles.chip} textStyle={styles.chipText}><CustomText style={styles.chipText}>{children}</CustomText></View>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    borderRadius: 16
  },
  chipText: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    padding: 3
  }
})