import React from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { onRequestPermission } from '@/utils/permission'

interface Props {
  onChange: (text: string) => void
  value?: string
  error?: string
  title: string
  field: string
  label: string
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
}

export function PhotoPicker({ onChange, value, field, label, placeholder }: Props) {
  const { t } = useTranslation()

  return (
    <>
      <View
        style={{
          paddingTop: 37,
        }}>
        <Text>Make sure you are operating by yourself</Text>
        <View
          style={{
            paddingTop: 36.5,
            paddingBottom: 47.5,
          }}>
          <TextInput
            editable={false}
            value={value}
            placeholder={placeholder}
            style={{ position: 'absolute', zIndex: -1 }}
            onPressIn={() => {}}
          />
          <Pressable
            // style={{ width: 282, height: 185 }}
            onPress={() => {
              console.log('pressed')
            }}>
            <Image source={require('@assets/images/apply/liveness.webp')} resizeMode="cover" />
          </Pressable>
        </View>
        <ErrorMessage name={field}>
          {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
        </ErrorMessage>
        <View>
          <Text>
            Keep face clear,expose completely and without obstructions,Avoid blurring
            casedinsufficient light.
          </Text>
        </View>
      </View>
    </>
  )
}

import { ImageStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{}>({})
