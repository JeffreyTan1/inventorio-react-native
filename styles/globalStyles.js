import { StyleSheet } from 'react-native'

const globalStyles = StyleSheet.create({
  headingText: {
    fontSize: 38,
    fontFamily: 'Montserrat'
  },
  halfOpacity: {
    opacity: 0.5
  },
  headingTextEdit: {
    borderWidth: 1,
    borderColor: 'grey', 
    borderRadius: 15, 
    marginRight: 15, 
    padding: 10, 
    fontSize: 25,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
})

export default globalStyles;