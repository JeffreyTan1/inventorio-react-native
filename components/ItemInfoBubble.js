import React from 'react'
import { View, StyleSheet } from 'react-native'
import CustomText from './CustomText'
import { numberWithCommas } from '../utils/utils'
import { useSelector } from 'react-redux'
import CustomTextInput from './CustomTextInput'

export default function ItemInfoBubble({label, data, editing, value, onChangeText, keyboardType, errorMsg}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);

  return (
    <View style={[styles.container, {backgroundColor: colorState.background}]}>
      <CustomText style={styles.label}>{label}</CustomText>
      {
        editing ? 
        <View>
          {
            errorMsg &&
            <CustomText style={styles.errorText}>{errorMsg}</CustomText>
          }
          <CustomTextInput style={[styles.data, styles.edit]} value={value} onChangeText={onChangeText} keyboardType={keyboardType}/>
        </View>
        :
        <CustomText style={styles.data}>{data && numberWithCommas(data)}</CustomText>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: 13,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 2,
  },
  data: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  edit: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1
  },
  errorText: {
    color: '#cf2c06',
    fontSize: 15,
    marginVertical: 5,
  }
})

