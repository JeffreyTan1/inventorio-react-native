import React from 'react'
import { View, Text } from 'react-native'

export default function CustomText({children, style}) {
  return (
    <Text style={[{fontFamily: 'Montserrat'}, style]}>
      {children}
    </Text>
  )
}
