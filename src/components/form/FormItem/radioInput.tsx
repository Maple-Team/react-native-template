import React from 'react'
import { View } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { RadioComponent } from './radio'

interface Props {
  onChange: (text: string) => void
  value?: number
  error?: string
  field: string
  label: string
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
}
export function RadioInput({ onChange, value, field, label }: Props) {
  return (
    <>
      <View style={formItemStyles.formItem}>
        <Text styles={formItemStyles.label}>{label}</Text>
        <View style={formItemStyles.inputWrap}>
          <RadioComponent value={value} onChange={onChange} />
        </View>
        <ErrorMessage name={field}>
          {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
        </ErrorMessage>
      </View>
    </>
  )
}
