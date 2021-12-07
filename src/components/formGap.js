import React from 'react'
import { View } from 'react-native'
import Text from './Text'
import StyleSheet from 'react-native-adaptive-stylesheet'
/**
 * 表单Sub Ttile
 * @param {String} title 名称
 * @returns {React.Component} Component
 */
export default function FormGap({ title }) {
  return (
    <View style={style.subFormTitle}>
      <Text style={style.subFormTitleContent}>{title}</Text>
    </View>
  )
}

const style = StyleSheet.create({
  subFormTitle: {
    paddingVertical: 30,
  },
  subFormTitleContent: {
    color: '#1F2024',
    fontSize: 18,
    fontFamily: 'ArialRoundedMTBold',
  },
})
