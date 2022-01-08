import React from 'react'
import { Pressable, TextInput, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import styles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'

interface InputProps {
  onChangeText: (text: string) => void
  onClear: () => void
  onFocus?: () => void
  onBlur?: () => void
  value: string
  error?: string
  field: string
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
}
export const Input = ({
  onChangeText,
  value,
  error,
  onClear,
  onFocus,
  onBlur,
  field,
  label,
  placeholder,
  keyboardType,
}: InputProps) => {
  return (
    <View style={styles.formItem}>
      <Text styles={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          onChangeText={onChangeText}
          maxLength={11}
          value={value}
          placeholder={placeholder}
          style={[styles.input, error ? { borderBottomColor: 'red' } : {}]}
          keyboardType={keyboardType}
          onFocus={onFocus}
          placeholderTextColor={'rgba(156, 171, 185, 1)'}
          onBlur={onBlur}
        />
        {value ? (
          <View style={styles.suffixWrap}>
            {error ? (
              <Pressable
                onPress={onClear}
                android_disableSound={true}
                focusable
                hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
                <Image
                  style={styles.suffix}
                  source={require('@assets/images/common/clear.webp')}
                  resizeMode="cover"
                />
              </Pressable>
            ) : (
              <Image
                style={styles.suffix}
                source={require('@assets/images/common/correct.webp')}
                resizeMode="cover"
              />
            )}
          </View>
        ) : (
          <></>
        )}
      </View>
      <ErrorMessage name={field}>
        {msg => (
          <Text color="red" styles={[styles.warn, styles.error]}>
            {msg}
          </Text>
        )}
      </ErrorMessage>
    </View>
  )
}
