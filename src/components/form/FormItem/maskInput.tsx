import React, { RefObject, useRef, useState } from 'react'
import { Pressable, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import styles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
import { useFocusOnError } from '@/hooks'
import type { ScrollView } from 'react-native-gesture-handler'
import TextInputMask from 'react-native-text-input-mask'

interface InputProps {
  onChangeText: (formatted: string, extracted?: string) => void
  onClear?: () => void
  onFocus?: () => void
  onBlur?: () => void
  value: string
  error?: string
  field: string
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  scrollViewRef?: RefObject<ScrollView>
  mask: string
}
export const MaskInput = ({
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
  mask,
  scrollViewRef,
}: InputProps) => {
  let fieldRef = useRef<any>(null)
  let wrapperRef = useRef<View>(null)
  const [height, setHeight] = useState<number>(0)
  useFocusOnError({ fieldRef, name: field, scrollViewRef, canFocus: true, height })
  return (
    <View style={styles.formItem}>
      <Text styles={styles.label}>{label}</Text>
      <View
        style={styles.inputWrap}
        ref={wrapperRef}
        onLayout={() => {
          wrapperRef.current?.measure(
            (_x: any, _y: any, _width: any, _height: number, _pageX: any, pageY: number) => {
              setHeight(pageY - _height)
            }
          )
        }}>
        <TextInputMask
          onChangeText={onChangeText}
          value={value}
          mask={mask}
          placeholder={placeholder}
          style={[styles.input, error ? { borderBottomColor: 'red' } : {}]}
          keyboardType={keyboardType}
          onFocus={onFocus}
          ref={fieldRef}
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
