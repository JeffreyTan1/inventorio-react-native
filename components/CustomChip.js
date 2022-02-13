import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import CustomText from './CustomText'

export default function CustomChip({children, onPress, chipStyle, chipTextStyle, numberOfLines}) {
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
      <View style={chipStyle} textStyle={styles.chipText}><CustomText style={chipTextStyle} numberOfLines={numberOfLines}>{children}</CustomText></View>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  chipText: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    padding: 3
  }
})