import React from 'react'
import { View, Text } from 'react-native'
import { styles } from './style'
/**
 * 表单Sub Ttile
 * @param {String} title 名称
 * @returns {React.Component} Component
 */
export default ({ title }: { title: string }) => {
  return (
    <View style={styles.subFormTitle}>
      <Text style={styles.subFormTitleContent}>{title}</Text>
    </View>
  )
}
