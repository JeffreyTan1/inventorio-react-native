import { MotiView } from 'moti'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'

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
      <Chip onPress={onPress} style={styles.chip} textStyle={styles.chipText}>{children}</Chip>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'black',
  },
  chipText: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    padding: 3
  }
})