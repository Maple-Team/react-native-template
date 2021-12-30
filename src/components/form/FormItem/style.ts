import { Color } from '@/styles/color'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  formItem: ViewStyle
  label: TextStyle
  inputWrap: ViewStyle
  input: ViewStyle | TextStyle
  suffixWrap: ViewStyle
  suffix: ImageStyle
  validBtnWrapDisabled: ViewStyle
  validBtnWrap: ViewStyle
  validBtn: TextStyle
  validBtnDisabled: TextStyle
  normal: ViewStyle | TextStyle
  warn: ViewStyle | TextStyle
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
  suffixWrap: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    height: '100%',
    backgroundColor: '#ff9501',
  },
  suffix: {
    width: 22,
    height: 22,
    marginRight: 11.5,
  },
  validBtnWrap: {
    backgroundColor: Color.primary,
    borderRadius: 6,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: '90%',
    marginRight: 5,
  },
  validBtnWrapDisabled: {
    backgroundColor: '#eee',
  },
  validBtn: {
    fontSize: 14,
    color: '#FFF',
  },
  validBtnDisabled: {
    color: '#eee',
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
