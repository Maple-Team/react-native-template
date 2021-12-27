import { Dimensions } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  wrap: {
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 1,
  },
  form: {
    borderRadius: 15,
    backgroundColor: '#FFF',
    flex: 1,
    width: '100%',
  },
  signin: {},
  signup: { marginTop: 29 },
  btn: {
    borderRadius: 9,
  },
})
