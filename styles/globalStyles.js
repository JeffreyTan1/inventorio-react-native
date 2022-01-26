import { StyleSheet } from 'react-native'

const globalStyles = StyleSheet.create({
  headingText: {
    fontSize: 33,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  },
  halfOpacity: {
    opacity: 0.5
  },
  headingTextEdit: {
    borderWidth: 0.5,
    borderColor: 'grey', 
    borderRadius: 5, 
    marginRight: 15, 
    padding: 10, 
    fontSize: 33,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
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