import React from 'react'
import { Modal, Button } from '@ant-design/react-native'
import { View, Image } from 'react-native'
import Text from './Text'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default function OpenSettingModal({ onPress }) {
  return (
    <Modal
      style={styles.modalContainer}
      bodyStyle={styles.bodyStyle}
      visible={true}
      transparent
      maskClosable
      popup>
      <View style={styles.content}>
        <View style={styles.iconView}>
          <Image
            style={styles.icon}
            source={require('../assets/images/common/block_permission.png')}
          />
        </View>
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Sorry, you enabled the 'Never ask again' function in your device, please go to setting
            and turn on relevant authorization function again.
          </Text>
        </View>
      </View>
      <View style={styles.btnWrap}>
        <Button style={styles.btn} type="primary" onPress={onPress}>
          OK
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  bodyStyle: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  modalContainer: {
    width: 298,
    borderRadius: 5,
    paddingTop: 12.5,
    paddingBottom: 27,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  title: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    color: '#181818',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8.5,
  },
  icon: {
    width: 78.5,
    height: 68,
  },
  hint: {},
  hintText: {
    color: '#212121',
    fontSize: 15,
  },
  btnWrap: {
    marginTop: 13.5,
    justifyContent: 'center',
    flexDirection: 'row',
    // paddingHorizontal: 19,
  },
  btn: {
    borderRadius: 5,
    width: 140,
    fontSize: 16,
    textTransform: 'uppercase',
  },
})
