import React from 'react'
import { View } from 'react-native'
import { styles } from './style'
import { Text } from '@/components'
/**
 * 表单Sub Ttile
 * @param {String} title 名称
 * @returns
 */
export default ({ title }: { title: string }) => {
  return (
    <View style={styles.subFormTitle}>
      <Text styles={styles.subFormTitleContent}>{title}</Text>
    </View>
  )
}
