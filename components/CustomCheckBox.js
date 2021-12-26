import React from 'react'
import CustomText from './CustomText'
import { StyleSheet, View } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function CustomCheckBox({isChecked, children, onPress}) {
  return (
    <View style={styles.container}>
        <BouncyCheckbox
          isChecked={isChecked}
          size={25}
          fillColor="#fcca47"
          unfillColor="#FFFFFF"
          text={children}
          iconStyle={{ borderColor: "#fcca47" }}
          textStyle={{ fontFamily: "Montserrat", textDecorationLine: "none", }}
          onPress={onPress}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 10
  }
})
