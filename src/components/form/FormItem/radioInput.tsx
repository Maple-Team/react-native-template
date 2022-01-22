import React from 'react'
import { View } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { RadioComponent } from './radio'
import type { Gender } from '@/typings/user'

interface Props {
  onChange: (text: Gender) => void
  value?: Gender
  error?: string
  field: string
  label: string
}
export function RadioInput({ onChange, value, field, label }: Props) {
  return (
    <View style={formItemStyles.formItem}>
      <Text styles={formItemStyles.label}>{label}</Text>
      <View style={formItemStyles.inputWrap}>
        <RadioComponent value={value} onChange={onChange} />
      </View>
      <ErrorMessage name={field}>
        {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
      </ErrorMessage>
    </View>
  )
}
