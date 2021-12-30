import { TextStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  sav: ViewStyle
  scroll: ViewStyle
  container: ViewStyle
  btn: ViewStyle | TextStyle
}>({
  sav: { flex: 1 },
  scroll: { flex: 1, backgroundColor: '#E6F1F8', paddingHorizontal: 10, paddingVertical: 20 },
  container: {
    flex: 1,
    paddingHorizontal: 27.5,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 5,
  },
  btn: {
    borderRadius: 9,
  },
})
