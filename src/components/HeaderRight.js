import React, { PureComponent } from 'react'
import { Text } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import NavigationUtil from '../navigation/NavigationUtil'
import { I18n } from '../utils'

export default class HeaderRight extends PureComponent {
  state = {
    isLogin: false,
  }
  componentDidMount() {
    this._getState()
  }
  _getState = async () => {
    const isLogin = await AsyncStorage.getItem('accessToken')
    this.setState({ isLogin })
  }

  render() {
    return (
      !this.state.isLogin && (
        <Text
          onPress={() => NavigationUtil.goPage('Login')}
          style={{
            paddingRight: 17,
            color: '#fff',
            fontSize: 14,
            textTransform: 'capitalize',
          }}>
          {I18n.t('common.login')}
        </Text>
      )
    )
  }
}
