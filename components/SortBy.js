import React, {useEffect, useState} from 'react'
import { View, StyleSheet } from 'react-native'
import CustomText from '../components/CustomText'
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SortBy({style, value, setValue, labels}) {
  
  return (
    <View style={[styles.container, style]}>
      <CustomText style={styles.sortByText}>Sort by</CustomText>
      <RNPickerSelect
        textInputProps={{multiline: false}}
        pickerProps={{numberOfLines: 20}}
        style={styles.pickerStyle}
        useNativeAndroidPickerStyle={false}
        onValueChange={setValue}
        Icon={() => {return <Icon name='arrow-drop-down' size={25}/>}}
        items={labels}
        value={value}
        placeholder={{}}
      />
    </View>
  )
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortByText: {
    marginRight: 19,
    fontSize: 20
  },

  pickerStyle: {
    inputIOS:
    {
      fontSize: 20,
      color: '#000',
      paddingTop: 0,
      fontFamily: 'Montserrat'
    },
    inputIOSContainer: {
      paddingLeft: 20,
      paddingRight: 25,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: '#00000000',
    },

    inputAndroid: {
      fontSize: 20,
      color: '#000',
      fontFamily: 'Montserrat'
    },
    inputAndroidContainer: {
      paddingLeft: 20,
      paddingRight: 25,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: '#00000000',
    },
    iconContainer:{
      top: 2,
      right: 0,
    },
    placeholder:{
      color: '#000000' + '50'
    },
  }
  
}