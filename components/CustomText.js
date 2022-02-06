import React from 'react'
import { View, Text } from 'react-native'

export default function CustomText({children, style, numberOfLines}) {
  return (
    <Text style={[{fontFamily: 'Montserrat'}, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}
