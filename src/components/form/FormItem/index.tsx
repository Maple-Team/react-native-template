import React from 'react'
import { Pressable, TextInput, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import styles from './style'
import Text from '@/components/Text'
import { ErrorMessage } from 'formik'

interface FormItemProps {
  onChangeText: (text: string) => void
  setFieldValue: (text: string, value: string | number) => void
  value: string
  error?: string
  field: string
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
}
export const FormItem = ({
  onChangeText,
  value,
  error,
  setFieldValue,
  field,
  label,
  placeholder,
  keyboardType,
}: FormItemProps) => {
  return (
    <View style={styles.formItem}>
      <Text styles={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          onChangeText={onChangeText}
          maxLength={11}
          value={value}
          placeholder={placeholder}
          style={[styles.input]}
          keyboardType={keyboardType}
        />
        {value ? (
          error ? (
            <Pressable onPress={() => setFieldValue(field, '')}>
              <Image
                style={styles.suffix}
                source={require('@/assets/images/common/clear.webp')}
                resizeMode="cover"
              />
            </Pressable>
          ) : (
            <Image
              style={styles.suffix}
              source={require('@/assets/images/common/correct.webp')}
              resizeMode="cover"
            />
          )
        ) : (
          <></>
        )}
      </View>
      <ErrorMessage name={field}>
        {msg => <Text styles={[styles.warn, styles.error]}>{msg}</Text>}
      </ErrorMessage>
    </View>
  )
}
