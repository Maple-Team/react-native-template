import React from 'react'
import { Modal } from '@ant-design/react-native'
import {
  View,
  Image,
  type ImageSourcePropType,
  type ImageStyle,
  Pressable,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import Text from './Text'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Color } from '@/styles/color'
import { useTranslation } from 'react-i18next'

export function PermissionModal({
  icon,
  hint,
  visible,
  onPress,
  iconStyle,
}: {
  title?: string
  icon: ImageSourcePropType
  content?: string
  hint: string
  visible: boolean
  onPress: () => void
  iconStyle?: ImageStyle
  onDenyPrress?: () => void
}) {
  const { t } = useTranslation()
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
          <Text color="#181818" fontSize={16} styles={styles.hintText}>
            {hint}
          </Text>
        </View>
      </View>
      <View style={styles.btnWrap}>
        <Pressable style={styles.btn} onPress={onPress}>
          <Text fontSize={16} color="#fff" styles={styles.btnText}>
            {t('allow')}
          </Text>
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create<{
  bodyStyle: ViewStyle
  modalContainer: ViewStyle
  title: ViewStyle
  titleText: TextStyle
  content: ViewStyle
  iconView: ViewStyle
  icon: ImageStyle
  hint: ViewStyle
  hintText: TextStyle
  btnWrap: ViewStyle
  btn: ViewStyle
  btnText: TextStyle
}>({
  bodyStyle: {
    paddingHorizontal: 0,
    paddingVertical: 20,
  },
  modalContainer: {
    width: 340,
    borderRadius: 6,
    paddingTop: 0,
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
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  iconView: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 44,
    height: 44,
  },
  hint: {
    paddingRight: 5,
    marginLeft: 19,
  },
  hintText: {},
  btnWrap: {
    marginTop: 21,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btn: {
    borderRadius: 5,
    width: '70%',
    backgroundColor: Color.primary,
    alignItems: 'center',
    padding: 10,
  },
  btnText: {
    textTransform: 'uppercase',
  },
})
