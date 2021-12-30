import React, { useState } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { WheelPicker } from './wheelPicker'
import { ModalWrap } from './modalWrap'
import type { Dict } from '@/typings/response'

interface PickerProps<T extends Dict> {
  onChange: (text: string) => void
  value?: string
  error?: string
  title: string
  field: string
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  dataSource: T[]
}

export function NormalPicker<T extends Dict>({
  onChange,
  value,
  field,
  label,
  title,
  placeholder,
  dataSource,
}: PickerProps<T>) {
  const [visible, setVisible] = useState<boolean>(false)
  const Picker = ModalWrap(WheelPicker)
  return (
    <>
      <View style={formItemStyles.formItem}>
        <Text styles={formItemStyles.label}>{label}</Text>
        <View style={formItemStyles.inputWrap}>
          <TextInput
            editable={false}
            value={value}
            placeholder={placeholder}
            style={[formItemStyles.input]}
            onPressIn={() => setVisible(true)}
          />
          <Pressable
            style={formItemStyles.suffixWrap}
            onPress={() => {
              console.log('pressed')
              setVisible(true)
            }}>
            <Image
              style={formItemStyles.suffix}
              source={require('@assets/images/common/right.webp')}
              resizeMode="cover"
            />
          </Pressable>
        </View>
        <ErrorMessage name={field}>
          {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
        </ErrorMessage>
      </View>
      <Picker
        dataSource={dataSource}
        visible={visible}
        onClose={() => setVisible(false)}
        onConfirm={code => onChange(code)}
        title={title}
        value={value}
      />
    </>
  )
}
