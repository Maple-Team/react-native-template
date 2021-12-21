import React, { PureComponent } from 'react'
import { Image, View } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from '../components'
import { getMessageCount } from '../services/user'
import { errorCaptured } from '../utils'

export default class HeaderIcon extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      count: props.number || 0,
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.props.number) {
      this.setState({
        count: this.props.number,
      })
    }
  }
  componentDidMount() {
    // this.getCount()
  }
  async getCount() {
    const [err, res] = await errorCaptured(getMessageCount)
    if (err) {
      return
    }
    this.setState({
      count: res,
    })
  }
  render() {
    const { onPress, type } = this.props
    const { count } = this.state
    let source = null
    switch (type) {
      case 'notification':
        source = require('../assets/images/common/notification.png')
        break
      case 'customer':
        source = require('../assets/images/common/customer.png')
        break
      default:
        break
    }
    let _countText
    if (count > 0) {
      if (count > NUMBER) {
        _countText = `${NUMBER}+`
      } else {
        _countText = `${count}`
      }
    }
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.wrap}>
          <Image source={source} style={styles.img} />
          {count > 0 && (
            <View style={styles.numberView}>
              <Text style={styles.number}>{_countText}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }
}

const NUMBER = 99
const width = 15
const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 22,
    paddingRight: 4,
    paddingVertical: 8,
    position: 'relative',
  },
  img: {
    width: 22,
    height: 22,
  },
  numberView: {
    backgroundColor: '#FF1A1A',
    width: width,
    height: width,
    borderRadius: width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    top: 2,
    right: 0,
    position: 'absolute',
  },
  number: {
    color: '#ffffff',
    fontSize: 9,
  },
})
