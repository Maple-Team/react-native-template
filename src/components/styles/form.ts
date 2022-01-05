import { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  sav: ViewStyle
  scroll: ViewStyle
  container: ViewStyle
  form: ViewStyle
  btnWrap: ViewStyle
}>({
  sav: { flex: 1 },
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
  form: {
    flex: 1,
    paddingHorizontal: 27.5,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 15,
    width: '100%',
    paddingBottom: 120,
  },
  btnWrap: {
    alignItems: 'center',
    bottom: -40,
  },
})
