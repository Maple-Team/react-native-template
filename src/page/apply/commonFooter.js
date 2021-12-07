import React, { PureComponent } from 'react'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from '../../components'

export default class FooterMessage extends PureComponent {
  render() {
    return (
      <Text style={styles.footerMessage}>
        SURITY CASH LENDING INVESTORS CORP. Company Registration No.CS201910185 Certificate of
        Authority No.3013
      </Text>
    )
  }
}
const styles = StyleSheet.create({
  footerMessage: {
    color: '#1A1A1A',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    paddingBottom: 32,
    paddingHorizontal: 18,
  },
})
