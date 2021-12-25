import React from 'react'
import { TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function IconButton({style, activeOpacity, underlayColor, onPress, iconName, size, color}) {
  return (
    <TouchableHighlight
    style={style}
    activeOpacity={activeOpacity}
    underlayColor={underlayColor}
    onPress={onPress}
    >
      <Icon name={iconName} size={size} color={color}/>
    </TouchableHighlight>
  )
}
