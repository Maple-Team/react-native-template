import React from 'react'
import { Modal as AntModal } from '@ant-design/react-native'
import { I18n, responsive } from '../../../utils'
import { View, Image, Dimensions, Platform } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from '../../../components'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

export default function Modal({ onClose, visible }) {
  return (
    <AntModal style={styles.modalContainer} bodyStyle={styles.bodyStyle} visible={visible} popup>
      <View style={styles.closeWrap}>
        <TouchableOpacity onPress={onClose}>
          {isAndroid ? (
            <AntDesign name="close" size={responsive(30)} color="#4EAD79" onPress={onClose} />
          ) : (
            <AntDesign name="closecircleo" size={responsive(30)} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.title}>
          <Text style={styles.titleContent}>{I18n.t('common.example')}</Text>
        </View>
        <View style={styles.exampleContainer}>
          <Image
            source={require('../../../assets/images/image/company-pic.png')}
            style={styles.exampleImg}
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.titleLayout}>
            <Text style={styles.infoTite} numberOfLines={3}>
              Make sure the company name, your name and your picture are all in the camera capture
              area, thank you!
            </Text>
          </View>
        </View>
      </ScrollView>
    </AntModal>
  )
}

const _width = 350
const baseHeight = 640 // Note 非小屏智能机高度基准
const isAndroid = Platform.OS === 'android'
const isSmall = Dimensions.get('window').height <= baseHeight
const styles = StyleSheet.create({
  bodyStyle: {
    paddingTop: 14.5,
    paddingBottom: 8.5,
    paddingHorizontal: 10,
  },
  modalContainer: {
    width: _width,
    position: 'relative',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    left: (375 - _width) / 2,
    top: isSmall ? 60 : 100, // !fixme 写死高度
    zIndex: 99,
  },
  closeWrap: isAndroid
    ? {
        height: 30,
        position: 'absolute',
        top: 0,
        left: 0,
        width: _width,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        zIndex: 999,
      }
    : {
        height: 30,
        position: 'absolute',
        top: -38,
        left: 0,
        width: _width,
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 999,
      },
  title: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  titleContent: {
    color: '#252525',
    fontSize: 17,
    fontFamily: 'ArialRoundedMTBold',
  },
  exampleContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    // paddingBottom: 29,
  },
  exampleImg: {
    width: 279,
    height: 222,
  },
  infoContainer: {
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  titleLayout: {
    flexDirection: 'row',
  },
  infoTite: {
    color: '#00A24D',
    fontSize: 12,
    textAlign: 'left',
    fontFamily: 'ArialMT',
  },
  infoText: {
    color: '#322929',
    fontSize: 11,
    fontFamily: 'ArialMT',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 23,
  },
})
