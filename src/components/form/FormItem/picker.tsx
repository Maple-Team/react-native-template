import React, { RefObject, useRef, useState } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { WheelPicker } from './wheelPicker'
import { ModalWrap } from './modalWrap'
import type { Dict, PickerField } from '@/typings/response'
import { UseFocusOnError } from '@/hooks'
import type { ScrollView } from 'react-native-gesture-handler'
import dayjs from 'dayjs'

interface PickerProps<T extends Dict, U extends PickerField> {
  onChange: (text: Dict) => void
  value: string
  error?: string
  title: string
  field: U
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  dataSource: T[]
  scrollViewRef?: RefObject<ScrollView>
  textSize?: number
}

export function NormalPicker<T extends Dict, U extends PickerField>({
  onChange,
  value,
  field,
  label,
  title,
  error,
  scrollViewRef,
  placeholder,
  dataSource,
  textSize,
}: PickerProps<T, U>) {
  const [visible, setVisible] = useState<boolean>(false)
  const Picker = ModalWrap(WheelPicker)
  const fieldRef = useRef<TextInput>(null)
  const [height, setHeight] = useState<number>(0)
  console.log(
    'field: ',
    field,
    ', PhotoPicker rendering: ',
    dayjs().format('YYYY-MM-DD HH::mm::ss')
  )
  // useFocusOnError({ fieldRef, name: field, scrollViewRef, offsetY: height })
  return (
    <>
      <UseFocusOnError
        fieldRef={fieldRef}
        name={field}
        scrollViewRef={scrollViewRef}
        offsetY={height}
      />
      <View style={formItemStyles.formItem}>
        <Text styles={formItemStyles.label}>{label}</Text>
        <View style={formItemStyles.inputWrap}>
          <TextInput
            editable={false}
            ref={fieldRef}
            onLayout={() => {
              fieldRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
                setHeight(pageY + _height)
              })
            }}
            value={dataSource.find(({ code }) => code === value)?.name}
            placeholder={placeholder}
            style={[formItemStyles.input, error ? { borderBottomColor: 'red' } : {}]}
            placeholderTextColor={'rgba(156, 171, 185, 1)'}
          />
          <Pressable
            style={formItemStyles.suffixWrap}
            onPress={() => {
              setVisible(true)
            }}
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
        onConfirm={onChange}
        title={title}
        value={value}
        textSize={textSize}
      />
    </>
  )
}
