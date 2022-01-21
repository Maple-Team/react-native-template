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
  btnWrap: ViewStyle
  btn: ViewStyle
  btnInvalid: ViewStyle
  btnText: TextStyle
}>({
  formItem: {
    marginBottom: 20,
  },
  label: {
    paddingLeft: 5,
    color: 'rgba(51, 50, 48, 1)',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    borderBottomWidth: 1,
    color: 'rgba(51, 50, 48, 1)',
    borderBottomColor: 'rgba(180, 204, 226, 1)',
    fontSize: 15,
    paddingVertical: 10, //FIXME 与UI确认
    paddingLeft: 6.5,
    flexWrap: 'wrap',
    paddingRight: 34,
  },
  suffixWrap: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    height: '100%',
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
  btnWrap: {
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    zIndex: 999,
    width: 103 + 28,
    height: 103 + 28,
    borderRadius: (103 + 28) / 2,
    backgroundColor: 'rgba(255,255,255, 1)',
  },
  btn: {
    backgroundColor: Color.primary,
    width: 103,
    height: 103,
    borderRadius: 103 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Color.primary,
  },
  btnInvalid: {
    backgroundColor: '#eee',
    borderColor: '#eee',
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
  },
})
