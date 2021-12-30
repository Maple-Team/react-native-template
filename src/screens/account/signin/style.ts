import { Color } from '@/styles/color'
import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{
  flex1: ViewStyle
  tab: ViewStyle
  tabBar: ViewStyle
  tabBarAct: ViewStyle
  tabBarText: TextStyle
  tabBarTextAct: TextStyle
  container: ViewStyle
  wrap: ViewStyle
  formWrap: ViewStyle
  form: ViewStyle
  btn: ViewStyle
  btnText: TextStyle
  btnWrap: ViewStyle
  bg: ImageStyle
  jump: ViewStyle
  jumpText: TextStyle
  jumpLink: TextStyle
}>({
  flex1: { flex: 1 },
  tab: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  tabBar: {
    width: '50%',
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
  },
  tabBarAct: {
    backgroundColor: 'rgba(255,255,255, .78)',
  },
  tabBarText: {
    color: '#333230',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  tabBarTextAct: {},
  container: {
    flex: 1,
  },
  wrap: {
    paddingHorizontal: 10,
    flex: 1,
  },
  form: {
    width: '100%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: 'rgba(255,255,255, 1)',
    paddingBottom: 200 - 14 - 50,
  },
  formWrap: {
    alignItems: 'center',
    paddingBottom: 30,
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
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: -1,
    height: '100%',
  },
  jump: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  jumpLink: {
    color: '#FFEA00',
    textDecorationLine: 'underline',
  },
  jumpText: {
    color: '#fff',
  },
})