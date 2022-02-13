import React from 'react'
import { View } from 'react-native'
import CustomText from '../components/CustomText'
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux'

export default function SortBy({style, value, setValue, labels}) {
  const colorState = useSelector(state => state.theme.theme.value.colors);

  return (
    <View style={[styles.container, style]}>
      <CustomText style={styles.sortByText}>Sort by</CustomText>
      <RNPickerSelect
        textInputProps={{multiline: false}}
        pickerProps={{numberOfLines: 20}}
        style={{
          inputIOS:
          {
            fontSize: 15,
            color: colorState.text,
            paddingTop: 0,
            fontFamily: 'Montserrat'
          },
          inputIOSContainer: {
            paddingLeft: 15,
            paddingRight: 25,
            borderRadius: 4,
            borderWidth: 0.5,
            borderColor: '#00000000',
          },
      
          inputAndroid: {
            fontSize: 15,
            color: colorState.text,
            fontFamily: 'Montserrat'
          },
          inputAndroidContainer: {
            paddingLeft: 15,
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
            color: colorState.grey,
          },
        }}
        useNativeAndroidPickerStyle={false}
        onValueChange={setValue}
        Icon={() => {return <Icon name='arrow-drop-down' size={25} color={colorState.text}/>}}
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
    fontSize: 15
  },
}