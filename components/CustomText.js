import React, {useEffect} from 'react'
import { Text } from 'react-native'
import { useSelector } from 'react-redux'

export default function CustomText({children, style, numberOfLines}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);
  
  return (
    <Text style={[{fontFamily: 'Montserrat', color: colorState.text}, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}
