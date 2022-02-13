import React from 'react'
import CustomText from './CustomText'
import { StyleSheet, View } from 'react-native'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from 'react-redux';

export default function CustomCheckBox({isChecked, children, onPress}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);
  return (
    <View style={styles.container}>
        <BouncyCheckbox
          isChecked={isChecked}
          size={25}
          fillColor={colorState.primary}
          unfillColor={colorState.background}
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
