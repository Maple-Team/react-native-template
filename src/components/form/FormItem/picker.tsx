import React, { useRef, useState } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { WheelPicker } from './wheelPicker'
import { ModalWrap } from './modalWrap'
import type { Dict, PickerField } from '@/typings/response'
import { useFocusOnError } from '@/hooks'

interface PickerProps<T extends Dict, U extends PickerField> {
  onChange: (text: string) => void
  value?: string
  error?: string
  title: string
  field: U
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  dataSource: T[]
}

export function NormalPicker<T extends Dict, U extends PickerField>({
  onChange,
  value,
  field,
  label,
  title,
  error,
  placeholder,
  dataSource,
}: PickerProps<T, U>) {
  const [visible, setVisible] = useState<boolean>(false)
  const Picker = ModalWrap(WheelPicker)

  console.error(error)
  const fieldRef = useRef<TextInput>(null)
  // const [fieldProps] = useField(field)
  useFocusOnError({ fieldRef, name: field })
  return (
    <>
      <View style={formItemStyles.formItem}>
        <Text styles={formItemStyles.label}>{label}</Text>
        <View style={formItemStyles.inputWrap}>
          <TextInput
            editable={false}
            ref={fieldRef}
            value={dataSource.find(({ code }) => code === value)?.name}
            placeholder={placeholder}
            onPressIn={() => setVisible(true)}
            style={[formItemStyles.input, error ? { borderBottomColor: 'red' } : {}]}
            placeholderTextColor={'rgba(156, 171, 185, 1)'}
            // {...fieldProps}
          />
          <Pressable
            style={formItemStyles.suffixWrap}
            onPress={() => setVisible(true)}
            pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}>
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
