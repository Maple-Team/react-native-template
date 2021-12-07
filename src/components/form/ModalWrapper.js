import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Modal as AntModal } from '@ant-design/react-native'
import dayjs from 'dayjs'
import { SafeAreaView } from 'react-navigation'
import { I18n } from '../../utils'
import { Text } from '../../components'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default function Modal(WrappedComponent) {
  return props => {
    const { onClose, onConfirm, title, value, name, type, visible, attr1, dataSource = [] } = props
    const _first = dataSource[0]
    return (
      <AntModal popup visible={visible} animationType="slide-up" onClose={onClose}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.left}>{I18n.t('common.close')}</Text>
            </TouchableOpacity>
            {type === 'date' ? (
              <Text style={styles.value}>
                {value ? dayjs(value).format('MM.DD.YYYY') : 'MM.DD.YYYY'}
              </Text>
            ) : (
              <Text style={styles.title}>{title}</Text>
            )}
            <TouchableOpacity
              onPress={() => {
                onClose()
                let _value
                if (type === 'date') {
                  _value = dayjs(value).toDate()
                } else {
                  if (value) {
                    _value = { name, code: value, attr1 }
                  } else {
                    if (!_first) {
                      return // Note 未加载到数据
                    }
                    _value = { name: _first.name, code: _first.code, attr1: _first.attr1 }
                  }
                }
                onConfirm(_value)
              }}>
              <Text style={styles.right}>{I18n.t('common.confirm')}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <WrappedComponent {...props} />
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
