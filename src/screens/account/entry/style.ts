import { Color } from '@/styles/color'
import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
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
  label: TextStyle
  formItem: ViewStyle
  inputWrap: ViewStyle
  normal: ViewStyle | TextStyle
  warn: ViewStyle | TextStyle
  suffix: ImageStyle
  input: ViewStyle | TextStyle
  error: TextStyle
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
  label: {
    paddingLeft: 5,
    color: '#333230',
    fontSize: 18,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    borderBottomWidth: 1,
    height: 34,
    color: '#333230',
    fontSize: 15,
  },
  suffix: {
    width: 22,
    height: 22,
    position: 'absolute',
    right: 10,
    zIndex: 999,
    bottom: 6, //FIXME 垂直居中问题
  },
  normal: { borderBottomColor: '#B4CCE2' },
  warn: {
    borderBottomColor: '#ff0000',
    color: '#ff0000',
  },
  error: {
    position: 'absolute',
    bottom: -16,
  },
})
