import React, {useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import CustomText from '../components/CustomText'

export default function SortBy({style, value, setValue, labels}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(labels);

  return (
    <View style={[styles.container, style]}>
      <CustomText>Sort by</CustomText>
      <DropDownPicker
        style={{backgroundColor: 'transparent', borderWidth: 0}}
        containerStyle={{width: 200, marginLeft: 10}}
        textStyle={{fontSize: 15, fontFamily: 'Montserrat'}}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})