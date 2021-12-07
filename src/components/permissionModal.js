import React from 'react'
import { Modal, Button } from '@ant-design/react-native'
import { View, Image } from 'react-native'
import Text from './Text'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Logger } from '../utils'
export default function PermissionModal({
  title,
  icon,
  content,
  hint,
  visible,
  onPress,
  iconStyle,
  onDenyPress,
}) {
  Logger.debug('PermissionModal', { title, visible }, new Date())
  return (
    <Modal
      style={styles.modalContainer}
      bodyStyle={styles.bodyStyle}
      visible={visible}
      transparent
      maskClosable
      popup>
      <View style={styles.content}>
        <View style={styles.iconView}>
          <Image style={[styles.icon, iconStyle]} source={icon} />
        </View>
        <View style={styles.hint}>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      </View>
      <View style={styles.btnWrap}>
        <Button style={styles.btn} type="primary" onPress={onPress}>
          ALLOW
        </Button>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  bodyStyle: {
    paddingHorizontal: 0,
  },
  modalContainer: {
    width: 340,
    borderRadius: 6,
    paddingVertical: 27,
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
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconView: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  hint: {
    marginLeft: 19,
  },
  hintText: {
    color: '#181818',
    fontSize: 16,
  },
  btnWrap: {
    marginTop: 21,
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
