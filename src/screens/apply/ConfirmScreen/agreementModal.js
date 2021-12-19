import React, { PureComponent } from 'react'
import { Modal as AntModal, Button } from '@ant-design/react-native'
import { View } from 'react-native'
import { I18n, Logger } from '../../../utils'
import { WebView } from 'react-native-webview'
import StyleSheet from 'react-native-adaptive-stylesheet'
export default class Modal extends PureComponent {
  state = {
    status: false,
    has2Bottom: false,
  }
  componentWillUnmount() {
    Logger.debug('agreement Modal componentWillUnmount')
  }
  render() {
    const { visible, uri, onDisagree, onAgree, canDirectSubmit } = this.props
    const { status, has2Bottom } = this.state
    return (
      <AntModal
        style={styles.modalContainer}
        maskClosable
        // eslint-disable-next-line react-native/no-inline-styles
        bodyStyle={{ paddingTop: 0 }}
        transparent
        visible={visible}
        popup>
        <View style={styles.content}>
          <WebView
            source={{ uri: uri }}
            onScroll={e => {
              if (has2Bottom) {
                return
              }
              const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
              const { y } = contentOffset
              let { height: _height } = layoutMeasurement
              let { height } = contentSize
              height = parseInt(height, 10)
              _height = parseInt(_height, 10)
              const delta = height - _height - y
              Logger.debug({ delta, height, _height })
              let _status = delta <= 1 && height !== _height && height !== 0
              this.setState({
                status: _status,
                has2Bottom: _status,
              })
            }}
          />
        </View>
        <View style={styles.operation}>
          <Button
            type="ghost"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ ...styles.btn, color: '#343434' }}
            onPress={() => {
              this.setState({
                has2Bottom: false, // 不同意，重置has2Bottom
              })
              onDisagree()
            }}>
            {I18n.t('common.disagree')}
          </Button>
          <Button
            type="primary"
            disabled={!status}
            style={styles.btn}
            onPress={() => onAgree(canDirectSubmit)}>
            {I18n.t('common.agree')}
          </Button>
        </View>
      </AntModal>
    )
  }
}
const styles = StyleSheet.create({
  modalContainer: {
    width: 350,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 9999,
  },
  content: {
    width: 310,
    height: 420,
  },
  operation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  btn: {
    width: 140,
    fontSize: 15,
  },
})
