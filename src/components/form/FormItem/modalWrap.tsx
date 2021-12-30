import React, { ReactElement } from 'react'
import { View, SafeAreaView, Pressable } from 'react-native'
import { Modal as AntModal } from '@ant-design/react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import Text from '@components/Text'
import { useTranslation } from 'react-i18next'
import { Dict } from '@/typings/response'

interface Props<T extends Dict> {
  dataSource: T[]
  visible: boolean
  onClose: () => void
  onConfirm: (value: Partial<T>) => void
  title: string
  value?: string
}
export function ModalWrap<T extends Dict>(Component: ReactElement) {
  const { t } = useTranslation()
  return (props: Props<T>) => {
    const { onClose, onConfirm, title, value, visible, dataSource = [] } = props
    return (
      <AntModal popup visible={visible} animationType="slide-up" onClose={onClose}>
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text styles={styles.left}>{t('close')}</Text>
            </Pressable>
            <Text styles={styles.title}>{title}</Text>
            <Pressable
              onPress={() => {
                let _value: Partial<T>
                const first = dataSource[0]
                if (value) {
                  _value = { code: value } as Partial<T>
                } else {
                  if (!first) {
                    return
                  }
                  _value = first
                }
                onConfirm(_value)
                onClose()
              }}>
              <Text styles={styles.right}>{t('confirm')}</Text>
            </Pressable>
          </View>
          <View>
            <Component dataSource={dataSource} selected={value} onChange={onConfirm} />
          </View>
        </SafeAreaView>
      </AntModal>
    )
  }
}
const styles = StyleSheet.create({
  header: {
    height: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
  },
  left: {
    color: '#b2b2b2',
    textTransform: 'capitalize',
  },
  right: {
    color: '#00a24d',
    textTransform: 'capitalize',
  },
  value: {
    color: '#00a24d',
  },
  title: {
    color: '#00a24d',
    textTransform: 'capitalize',
  },
})
