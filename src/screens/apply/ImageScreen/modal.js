import React from 'react'
import { Modal as AntModal } from '@ant-design/react-native'
import { I18n, responsive } from '../../../utils'
import { View, Image, Dimensions, Platform } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from '../../../components'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

export default function Modal({ onClose, visible, livenessStatus }) {
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
      <ScrollView style={{ height: 500 }}>
        <View style={styles.title}>
          <Text style={styles.titleContent}>{I18n.t('common.example')}</Text>
        </View>
        <View style={styles.exampleContainer}>
          <Image
            source={require('../../../assets/images/image/sample1.png')}
            style={styles.exampleImg}
          />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.titleLayout}>
            <EvilIcons name="exclamation" size={20} color="#D91B16" />
            <Text style={styles.infoTite} numberOfLines={3}>
              Make sure above mentioned ID images are provided, otherwise application will be
              rejected;
            </Text>
          </View>
          <View>
            <Text style={styles.infoText}>
              1. Make sure the ID document submiited is original document;
            </Text>
            <Text style={styles.infoText}>2. Make sure the image taken is complete and clear;</Text>
            <Text style={styles.infoText}>
              3. If image is not clear or not complete, will be rejected.
            </Text>
          </View>
          {livenessStatus === 'N' ? (
            <>
              <View style={styles.infoBanner}>
                <Image
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ width: 280, height: 180 }}
                  source={require('../../../assets/images/image/sample2.png')}
                />
              </View>
              <View style={styles.titleLayout}>
                <EvilIcons name="exclamation" size={20} color="#D91B16" />
                <Text style={styles.infoTite}>
                  Please make sure your selfie is provided, otherwise the application will be
                  rejected.
                </Text>
              </View>
              <View>
                <Text style={styles.infoText}>
                  Make sure selfie provided is of yourself and is clear.
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoBanner}>
                <Image
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ width: 280, height: 180 }}
                  source={require('../../../assets/images/image/live_sample.png')}
                />
              </View>
              <View style={styles.titleLayout}>
                <EvilIcons name="exclamation" size={20} color="#D91B16" />
                <Text style={(styles.infoTite, { textAlign: 'center' })}>
                  Like this , image must be clear
                </Text>
              </View>
              <View>
                <Text style={styles.infoText}>
                  1. Please make sure it is done by yourself, and it will be compared with your
                  picture on your ID, meanwhile, you only have two times for this varification.
                </Text>
                <Text style={styles.infoText}>
                  2. Please make sure during the recognition, your face is complete and clear with
                  the capture area.
                </Text>
              </View>
            </>
          )}
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
    height: 550,
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
    color: '#00A24D',
    fontSize: 12,
    fontFamily: 'ArialMT',
  },
  exampleContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 29,
  },
  exampleImg: {
    width: 234,
    height: 150,
  },
  infoContainer: {},
  titleLayout: {
    flexDirection: 'row',
  },
  infoTite: {
    color: '#D91B16',
    fontSize: 13,
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
