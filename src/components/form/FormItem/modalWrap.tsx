import React from 'react'
import { View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal as AntModal } from '@ant-design/react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import Text from '@components/Text'
import { useTranslation } from 'react-i18next'
import { Dict } from '@/typings/response'
import { WheelPickerProps } from './wheelPicker'

interface Props<T extends Dict> {
  dataSource: T[]
  visible: boolean
  onClose: () => void
  onConfirm: (value: T) => void
  title: string
  value?: string
}

export function ModalWrap<T extends Dict, P extends Props<T>>(
  Component: React.ComponentType<WheelPickerProps<T>>
): React.FC<P> {
  const { t } = useTranslation()

  return (props: Props<T>) => {
    const { onClose, onConfirm, title, value, visible, dataSource = [] } = props
    let pos: number | undefined
    const componentProps: WheelPickerProps<T> = {
      dataSource,
      selected: value,
      onChange: (position: number) => {
        pos = position
      },
    }
    return (
      <AntModal popup visible={visible} animationType="slide-up" onClose={onClose}>
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable
              onPress={onClose}
              style={{
                height: '100%',
                justifyContent: 'center',
              }}
              pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}>
              <Text styles={styles.left}>{t('close')}</Text>
            </Pressable>
            <Text styles={styles.title}>{title}</Text>
            <Pressable
              style={{
                height: '100%',
                justifyContent: 'center',
              }}
              onPress={() => {
                let _value: T
                if (value) {
                  _value = dataSource.find(({ code }) => code === value)! // 初始值
                } else {
                  const first = dataSource[0]
                  if (!first) {
                    return
                  }
                  _value = first
                }
                onConfirm(pos ? dataSource[pos] : _value)
                onClose()
              }}
              pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}>
              <Text styles={styles.right}>{t('confirm')}</Text>
            </Pressable>
          </View>
          <View>
            <Component {...componentProps} />
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
