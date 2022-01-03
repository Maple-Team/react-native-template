import { Color } from '@/styles/color'
import { ImageStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  flex1: ViewStyle
  container: ViewStyle
  wrap: ViewStyle
  form: ViewStyle
  signin: ViewStyle
  signup: ViewStyle
  btn: ViewStyle
  bg: ImageStyle
  formItem: ViewStyle
}>({
  flex1: { flex: 1 },
  container: {
    flex: 1,
  },
  wrap: {
    alignContent: 'space-around',
    paddingHorizontal: 10,
    flex: 1,
  },
  form: {
    marginTop: 75,
    backgroundColor: 'rgba(255,255,255, .5)',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingTop: 80,
    paddingBottom: 47.5,
  },
  signin: {
    backgroundColor: Color.primary,
  },
  signup: {
    backgroundColor: '#FFF',
    marginTop: 29,
  },
  btn: {
    borderRadius: 9,
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: -1,
    height: '100%',
  },
  formItem: {
    marginBottom: 20,
  },
})
