import React from 'react'
import { Modal, Button } from '@ant-design/react-native'
import { View } from 'react-native'
import Text from './Text'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default function NotificationModal({ onPress, content }) {
  return (
    <Modal
      style={styles.modalContainer}
      bodyStyle={styles.bodyStyle}
      visible={true}
      transparent
      maskClosable
      popup>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Notice</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      </View>
      <View style={styles.btnWrap}>
        <Button style={styles.btn} type="primary" onPress={onPress}>
          CONFIRM
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
    width: 320,
    borderRadius: 10,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 10,
  },
  title: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#00A24D',
    borderBottomWidth: 1,
    paddingTop: 19,
    paddingBottom: 14,
  },
  titleText: {
    color: '#1C1C1C',
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'ArialRoundedMTBold',
  },
  content: {
    paddingHorizontal: 15.5,
    paddingTop: 28,
    paddingBottom: 25,
  },
  contentText: {
    color: '#1C1C1C',
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
    width: 320,
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    textTransform: 'uppercase',
  },
})
