import { ImageStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  header: ViewStyle
  headerLeft: ViewStyle
  headerRight: ViewStyle
  logo: ImageStyle
  moneyya: ImageStyle
  notice: ImageStyle
  help: ImageStyle
}>({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20.5,
    paddingVertical: 5,
  },
  logo: {},
  notice: {},
  help: {
    marginLeft: 26.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyya: {
    marginLeft: 10.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
