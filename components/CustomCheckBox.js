import React from 'react'
import { Checkbox } from 'react-native-paper'
import CustomText from './CustomText'
import { StyleSheet, View } from 'react-native'

export default function CustomCheckBox({status, children, onPress}) {
  return (
    <View style={styles.container}>
      <Checkbox status={status} onPress={onPress} />
      <CustomText>{children}</CustomText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
})
