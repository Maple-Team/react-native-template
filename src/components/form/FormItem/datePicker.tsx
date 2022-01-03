import React, { useState } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

interface PickerProps {
  onChange: (text: string) => void
  value?: string
  error?: string
  title: string
  field: string
  label: string
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
  title,
  placeholder,
}: PickerProps) {
  const { t, i18n } = useTranslation()
  const [visible, setVisible] = useState<boolean>(false)
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
              source={require('@assets/images/apply/calendar.webp')}
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
          onChange(dayjs(date).format('YYYY-MM-DD'))
        }}
        onCancel={() => setVisible(false)}
        locale={i18n.language}
        confirmText={t('confirm')}
        cancelText={t('cancel')}
      />
    </>
  )
}
