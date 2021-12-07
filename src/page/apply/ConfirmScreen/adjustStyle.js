import StyleSheet from 'react-native-adaptive-stylesheet'
import { Dimensions } from 'react-native'
import styles from '../HomeScreen/style'

export default StyleSheet.create({
  ...styles,
  container: {
    width: Dimensions.get('window').width - 20,
    // height: 409,
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 29,
    backgroundColor: '#F8F8F8',
  },
  titleView: {
    paddingHorizontal: 28,
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    color: '#333230',
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'ArialRoundedMTBold',
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderStyle: 'solid',
    borderWidth: 1,
    width: 150,
  },
  buttonStyleNegative: {
    color: '#999898',
    borderColor: '#999898',
  },
})
