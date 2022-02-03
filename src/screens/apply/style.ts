import { Color } from '@/styles/color'
import { TextStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  scroll: ViewStyle
  container: ViewStyle
  loanInfo: ViewStyle
  btnWrap: ViewStyle
  ad: ViewStyle
  adTextWrap: ViewStyle
  sliderItem: ViewStyle
  sliderAd: ViewStyle
  sliderContent: ViewStyle
  numWrap: ViewStyle
  textWrap: ViewStyle
  sliderTitle: TextStyle
  sliderSubTitle: TextStyle
  cashWrap: ViewStyle
}>({
  scroll: {
    flex: 1,
    backgroundColor: '#E6F1F8',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  container: {
    backgroundColor: 'transparent',
    paddingBottom: 200 - 14 - 50,
    alignItems: 'center',
  },
  loanInfo: {
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    top: -40,
  },
  ad: {
    paddingHorizontal: 0,
    paddingTop: 24.5,
    marginBottom: 50,
  },
  adTextWrap: {
    alignItems: 'center',
    marginBottom: 15,
  },

  btnWrap: {
    alignItems: 'center',
    bottom: -40,
  },
  sliderItem: {
    width: 355,
    paddingTop: 26,
    borderRadius: 5,
    alignItems: 'center',
  },
  sliderAd: {
    backgroundColor: '#fff',
    width: 116 + 20.5 * 2,
    height: 116 + 20.5 * 2,
    borderRadius: (116 + 20.5 * 2) / 2,
    alignItems: 'center',
    top: -20,
    justifyContent: 'center',
  },
  sliderContent: {
    borderRadius: 15,
    borderColor: 'rgba(216, 222, 236, 1)',
    borderWidth: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 11,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  numWrap: {
    position: 'absolute',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    width: 100,
  },
  textWrap: {
    alignItems: 'center',
    top: -5,
  },
  sliderTitle: {
    color: Color.primary,
    marginBottom: 12.5,
    fontFamily: 'Aller',
  },
  sliderSubTitle: {
    color: 'rgba(123, 123, 123, 1)',
    fontFamily: 'Aller',
  },
  cashWrap: {
    bottom: 160 + 17,
    zIndex: 99,
    backgroundColor: '#fff',
    width: 63 + 9 * 2,
    height: 63 + 9 * 2,
    borderRadius: (63 + 9 * 2) / 2,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },
})
