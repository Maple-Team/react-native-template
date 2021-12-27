import { AppRegistry } from 'react-native'
import 'intl-pluralrules'
// import App from './src/screens/splash'
import App from './src/App'
import { name as appName } from './app.json'
import StyleSheet from 'react-native-adaptive-stylesheet'
export default StyleSheet.create({
  container: {
    width: 375,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 18,
  },
})

AppRegistry.registerComponent(appName, () => App)
