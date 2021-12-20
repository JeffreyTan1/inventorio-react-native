import React from 'react'
import { View, StyleSheet, TouchableHighlight, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../components/CustomText';
import globalStyles from '../styles/globalStyles';


export default function Settings({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableHighlight
        style={styles.iconButton}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={()=>navigation.goBack()}
        >
          <Icon name="arrow-back-ios" size={35}/>
        </TouchableHighlight>
      </View>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <CustomText style={globalStyles.headingText}>Settings</CustomText>
        </View>
      </View>
      
      <ScrollView style={styles.panel}>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  iconButton: {
    borderRadius: 100,
    padding: 10
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  header: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 5,
    height: '9%'
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subHeadingContainer: {
    flexDirection: 'row',
  },
  subHeading: {
    
    fontSize: 20,
  },
  ml: {
    marginLeft: 10,
  },
  panel: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#fcca47',
    flex: 1
  },
  sortPanel: {
    borderRadius: 16,
  },
  scrollView: {
    flex: 1,
  }
})