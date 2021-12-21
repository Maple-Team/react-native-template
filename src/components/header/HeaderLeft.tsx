import React, { PureComponent } from 'react'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

export default class HeaderLeft extends PureComponent {
  constructor(props) {
    super(props)
  }
  _navigate = async () => {}
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
