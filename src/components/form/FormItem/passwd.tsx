import React from 'react'
import { Pressable, TextInput, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import styles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'

interface InputProps {
  onChangeText: (text: string) => void
  onClear: () => void
  value: string
  error?: string
  onFocus?: () => void
  onBlur?: () => void
  onToggle: () => void
  field: string
  label: string
  showPwd: boolean
  placeholder: string
  keyboardType?: KeyboardTypeOptions
}
export const PasswordInput = ({
  onChangeText,
  value,
  field,
  onFocus,
  onBlur,
  onToggle,
  label,
  showPwd,
  placeholder,
  keyboardType,
}: InputProps) => {
  return (
    <View style={styles.formItem}>
      <Text styles={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          onChangeText={onChangeText}
          maxLength={11} // FIXME
          value={value}
          placeholder={placeholder}
          style={[styles.input]}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={showPwd}
        />
        {value ? (
          <View style={styles.suffixWrap}>
            <Pressable onPress={onToggle}>
              {!showPwd ? (
                <Image
                  style={styles.suffix}
                  source={require('@assets/images/common/open.webp')}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  style={styles.suffix}
                  source={require('@assets/images/common/hide.webp')}
                  resizeMode="cover"
                />
              )}
            </Pressable>
          </View>
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
