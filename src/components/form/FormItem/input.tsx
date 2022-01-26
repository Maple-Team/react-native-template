import React, { RefObject, useRef, useState } from 'react'
import { Pressable, TextInput, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import styles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { UseFocusOnError } from '@/hooks'
import type { ScrollView } from 'react-native-gesture-handler'

interface InputProps {
  onChangeText: (text: string) => void
  onClear?: () => void
  onFocus?: () => void
  onBlur?: () => void
  value: string
  error?: string
  field: string
  textSize?: number
  label: string
  placeholder: string
  maxLength?: number
  keyboardType?: KeyboardTypeOptions
  scrollViewRef?: RefObject<ScrollView>
}
export const Input = ({
  onChangeText,
  value,
  error,
  onClear,
  onFocus,
  onBlur,
  maxLength,
  field,
  textSize,
  label,
  placeholder,
  keyboardType,
  scrollViewRef,
}: InputProps) => {
  const fieldRef = useRef<TextInput>(null)
  const [height, setHeight] = useState<number>(0)
  // useFocusOnError({ fieldRef, name: field, scrollViewRef, canFocus: true, offsetY: height })
  return (
    <>
      <UseFocusOnError
        fieldRef={fieldRef}
        name={field}
        scrollViewRef={scrollViewRef}
        offsetY={height}
        canFocus={true}
      />
      <View style={styles.formItem}>
        <Text styles={styles.label}>{label}</Text>
        <View style={styles.inputWrap}>
          <TextInput
            onChangeText={onChangeText}
            maxLength={maxLength}
            value={value}
            multiline={true}
            ref={fieldRef}
            onLayout={() => {
              fieldRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
                setHeight(pageY + _height)
              })
            }}
            placeholder={placeholder}
            style={[
              styles.input,
              { fontSize: textSize || 15 },
              error ? { borderBottomColor: 'red' } : {},
            ]}
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
    </>
  )
}
