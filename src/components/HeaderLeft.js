import React, { PureComponent } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import NavigationUtil from '../navigation/NavigationUtil'

export default class HeaderLeft extends PureComponent {
  constructor(props) {
    super(props)
  }
  _navigate = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'))
    const { route, params } = this.props
    if (route) {
      NavigationUtil.goPage(route, params)
    } else {
      const { applyStatus } = user
      if (applyStatus === 'SETTLE' || applyStatus === 'CONTINUE_LOAN_CANCEL') {
        NavigationUtil.goPage('Index', params)
      } else {
        NavigationUtil.goPage('Image', params)
      }
    }
  }
  render() {
    return (
      <EvilIcons
        name="chevron-left"
        size={40}
        color="#00A24D"
        onPress={this._navigate.bind(this)}
      />
    )
  }
}
