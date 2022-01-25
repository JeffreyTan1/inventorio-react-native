import React from 'react'
import { View, StyleSheet } from 'react-native'
import CustomText from '../components/CustomText'
import { MotiPressable } from 'moti/interactions'

export default function SummaryStatistic({title, value, onPress, index}) {
  return (
    <View style={styles.container}>
      <MotiPressable 
        style={{alignItems: 'center', height: '100%', justifyContent: 'center'}}
        animate={({ hovered, pressed }) => {
          'worklet'
      
          return {
            scale: hovered || pressed ? 0.5 : 1,
          }
        }}
        onPress={()=>onPress(index, true)}
      >
        <CustomText style={styles.label}>{title}</CustomText>
        <CustomText style={styles.value}>{value}</CustomText>
      </MotiPressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 2.65,
    elevation: 4,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 33
  }
})