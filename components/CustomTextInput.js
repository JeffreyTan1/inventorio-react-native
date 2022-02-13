import { TextInput } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'

export default function CustomTextInput(props) {
  const colorState = useSelector(state => state.theme.theme.value.colors)
  return (
    <TextInput {...props} style={[props?.style, {fontFamily: 'Montserrat', color: colorState.text}]}/>
  )
}