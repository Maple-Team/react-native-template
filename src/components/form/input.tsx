// Formik x React Native example
import React from 'react'
import { TextInput } from 'react-native'
interface TextProps {
  inputType?: 'masked'
  onChangeText: () => void
  onBlur: () => void
  onFocus: () => void
  value?: string
}
export const MoneeyyaTextInput = ({
  inputType,
  value,
  onChangeText,
  onBlur,
  onFocus,
}: TextProps) => {
  if (inputType === 'masked') {
  } else {
    return <TextInput onChangeText={onChangeText} onFocus={onFocus} onBlur={onBlur} value={value} />
  }
}
