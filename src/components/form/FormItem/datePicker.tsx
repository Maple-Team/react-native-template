import React, { type RefObject, useState, useRef } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import type { ScrollView } from 'react-native-gesture-handler'
import { UseFocusOnError } from '@/hooks'

interface PickerProps {
  onChange: (text: string) => void
  value?: string
  error?: string
  title: string
  field: string
  label: string
  scrollViewRef?: RefObject<ScrollView>
  placeholder: string
  keyboardType?: KeyboardTypeOptions
}
const initDate = dayjs().subtract(30, 'year')
// https://github.com/henninghall/react-native-date-picker#example-1-modal
export function NormalDatePicker({
  onChange,
  value,
  field,
  label,
  scrollViewRef,
  error,
  title,
  placeholder,
}: PickerProps) {
  const { t, i18n } = useTranslation()
  const [visible, setVisible] = useState<boolean>(false)
  const fieldRef = useRef<TextInput>(null)
  const [height, setHeight] = useState<number>(0)
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
            value={value}
            ref={fieldRef}
            onLayout={() => {
              fieldRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
                setHeight(pageY - _height)
              })
            }}
            placeholder={placeholder}
            onPressIn={() => setVisible(true)}
            style={[formItemStyles.input, error ? { borderBottomColor: 'red' } : {}]}
            placeholderTextColor={'rgba(156, 171, 185, 1)'}
          />
          <Pressable
            style={formItemStyles.suffixWrap}
            onPress={() => {
              setVisible(true)
            }}>
            <Image
              style={formItemStyles.suffix}
              source={require('@assets/compressed/apply/calendar.webp')}
              resizeMode="cover"
            />
          </Pressable>
        </View>
        <ErrorMessage name={field}>
          {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
        </ErrorMessage>
      </View>
      <DatePicker
        title={title}
        modal={true}
        open={visible}
        androidVariant="iosClone"
        date={dayjs(value || initDate).toDate()}
        mode="date"
        onConfirm={(date: Date) => {
          setVisible(false)
          onChange(dayjs(date).format('DD-MM-YYYY'))
        }}
        onCancel={() => setVisible(false)}
        locale={i18n.language}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
      />
    </>
  )
}
