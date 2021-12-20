import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function ActionButton({icon}) {
  return (
    <TouchableHighlight
    activeOpacity={0.9}
    underlayColor="#DDDDDD"
    style={styles.button}
    onPress={() => console.log('actionbutton')}
    >
      <Icon name={icon} size={45}/>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    backgroundColor: '#fff',
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  }
})