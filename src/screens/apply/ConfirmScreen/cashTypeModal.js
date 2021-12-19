import React from 'react'
import { Modal as AntModal } from '@ant-design/react-native'
import { View, Image, Platform } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from '../../../components'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function Modal({ visible, showOrgPay }) {
  return (
    <AntModal
      style={styles.modalContainer}
      visible={visible}
      transparent
      bodyStyle={styles.bodyStyle}
      maskClosable
      popup>
      <View style={styles.content}>
        <View style={styles.img}>
          <Image source={require('../../../assets/images/image/confirm-modal.png')} />
        </View>
        <Text style={styles.info}>
          For a higher chance of approval, we suggest choosing Bank Transfer.
        </Text>
        <View style={styles.btnWrap}>
          <TouchableOpacity onPress={() => showOrgPay(1)}>
            <View>
              <Text style={[styles.dark, styles.btnText]} onPress={() => showOrgPay(1)}>
                Cash pickup
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showOrgPay(0)}>
            <View style={styles.lightWrap}>
              <Text style={[styles.light, styles.btnText]} onPress={() => showOrgPay(0)}>
                Bank transfer
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </AntModal>
  )
}
const styles = StyleSheet.create({
  modalContainer: {
    width: 312,
    height: 245,
    borderRadius: 10,
    paddingTop: 0,
  },
  bodyStyle: {
    paddingHorizontal: 0,
  },
  content: {
    width: 312,
    height: 245,
    paddingTop: 15,
    backgroundColor: '#FBFFFD',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'android' ? 10 : 0,
  },
  img: {
    width: 185,
    height: 109.5,
  },
  info: {
    color: '#414141',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 14,
  },
  btnWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D7DDF1',
    width: 312,
    height: 50,
  },
  btnText: {
    width: 156,
    textAlign: 'center',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 16,
  },
  lightWrap: {
    height: 50,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#D7DDF1',
  },
  light: {
    color: '#00A24D',
  },
  dark: {
    color: '#A9A9A9',
  },
})
