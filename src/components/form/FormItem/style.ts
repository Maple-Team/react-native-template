import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  label: TextStyle
  formItem: ViewStyle
  inputWrap: ViewStyle
  normal: ViewStyle | TextStyle
  warn: ViewStyle | TextStyle
  suffix: ImageStyle
  input: ViewStyle | TextStyle
  error: TextStyle
}>({
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
