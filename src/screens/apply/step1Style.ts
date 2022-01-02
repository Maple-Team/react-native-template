import { ImageStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  header: ViewStyle
  banner: ViewStyle
  scroll: ViewStyle
  headerLeft: ViewStyle
  headerRight: ViewStyle
  container: ViewStyle
  form: ViewStyle
  btnWrap: ViewStyle
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
  banner: {},
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
