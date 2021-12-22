import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Chip } from 'react-native-paper'

export default function CustomChip({children, onPress}) {
  return (
    <Chip onPress={onPress} style={styles.chip}>{children}</Chip>
  )
}

const styles = StyleSheet.create({
  chip: {
    margin: 5
  }
})