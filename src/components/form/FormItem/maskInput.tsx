import React, { type RefObject, useRef, useState, type ReactNode } from 'react'
import { Pressable, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import styles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
import { UseFocusOnError } from '@/hooks'
import type { ScrollView } from 'react-native-gesture-handler'
import TextInputMask from 'react-native-text-input-mask'

interface InputProps {
  onChangeText?: (formatted: string, extracted?: string) => void
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
  Prefix?: ReactNode
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
  Prefix,
}: InputProps) => {
  let fieldRef = useRef<any>(null)
  let wrapperRef = useRef<View>(null)
  const [offsetY, setOffsetY] = useState<number>(0)
  // console.log({ field }, 'MaskInput rendering')
  return (
    <>
      <UseFocusOnError
        fieldRef={fieldRef}
        name={field}
        scrollViewRef={scrollViewRef}
        offsetY={offsetY}
        canFocus={true}
      />
      <View style={styles.formItem}>
        <Text styles={styles.label}>{label}</Text>
        <View
          style={styles.inputWrap}
          ref={wrapperRef}
          onLayout={() => {
            // TextInputMask未暴露出访问其内部textInput元素的方法，故使用其父组件的维度
            wrapperRef.current?.measure(
              (
                x: number,
                _y: number,
                width: number,
                height: number,
                pageX: number,
                pageY: number
              ) => {
                setOffsetY(pageY - height)
              }
            )
          }}>
          {Prefix && <View style={styles.prefixWrap}>{Prefix}</View>}
          <TextInputMask
            onChangeText={onChangeText}
            value={value}
            mask={mask}
            autoskip={true}
            placeholder={placeholder}
            style={[
              styles.input,
              error ? { borderBottomColor: 'red' } : {},
              Prefix ? { paddingLeft: 34 } : {}, //NOTE 前缀位置
            ]}
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
                    source={require('@assets/compressed/common/clear.webp')}
                    resizeMode="cover"
                  />
                </Pressable>
              ) : (
                <Image
                  style={styles.suffix}
                  source={require('@assets/compressed/common/correct.webp')}
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
