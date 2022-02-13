import React from 'react'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux'

export default function IconButton({style, activeOpacity, underlayColor, onPress, iconName, size, color}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);

  return (
    <TouchableHighlight
    style={style}
    activeOpacity={activeOpacity}
    underlayColor={underlayColor ? underlayColor : colorState.underlayLight}
    onPress={onPress}
    >
      <Icon name={iconName} size={size} color={color ? color : colorState.text}/>
    </TouchableHighlight>
  )
}
