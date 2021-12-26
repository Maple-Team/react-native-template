import { Dimensions } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create({
  container: {
    backgroundColor: '#CCECDB',
    paddingHorizontal: 10,
    alignItems: 'center',
    flex: 1,
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  logoWrapper: {
    marginTop: 100,
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
  },
  moneyya: {
    marginTop: 18.5,
  },
})
