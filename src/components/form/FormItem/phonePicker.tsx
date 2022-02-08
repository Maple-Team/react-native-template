import React, { type RefObject, useCallback, useRef, useState } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { selectContactPhone } from 'react-native-select-contact'
import Contacts from 'react-native-contacts'
import { onRequestPermission } from '@/utils/permission'
import type { ScrollView } from 'react-native-gesture-handler'
import { UseFocusOnError } from '@/hooks'

interface Props {
  onChange: (text: string) => void
  value?: string
  error?: string
  field: string
  label: string
  placeholder: string
  scrollViewRef?: RefObject<ScrollView>
  keyboardType?: KeyboardTypeOptions
}

// https://github.com/henninghall/react-native-date-picker#example-1-modal
export function PhonePicker({
  onChange,
  value,
  field,
  label,
  placeholder,
  error,
  scrollViewRef,
}: Props) {
  const { t } = useTranslation()

  const onSelectContacts = useCallback(async () => {
    Contacts.getAll().then(contacts => {
      console.log({ contacts })
      // TODO UPLOAD ALL CONTACTS
    })
    const selection = await selectContactPhone()
    console.log({ selection })
    if (!selection) {
      return
    }

    const { selectedPhone } = selection
    const contactPhone = selectedPhone.number
    const _value = contactPhone.replace(/[\s-]/g, '') //TODO 正则替换
    onChange(_value)
  }, [onChange])

  const onRequestContactsPermission = useCallback(
    () =>
      onRequestPermission({
        blockedMessage: t('permission blocked'),
        unavailableMessage: t('permission unavailable'),
        permission: 'android.permission.READ_CONTACTS',
        onGranted: () => {
          onSelectContacts()
        },
      }),
    [onSelectContacts, t]
  )
  console.log({ field }, 'PhonePicker rendering')
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
            ref={fieldRef}
            editable={false}
            onLayout={() => {
              fieldRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
                setHeight(pageY - _height)
              })
            }}
            value={value}
            placeholder={placeholder}
            style={[formItemStyles.input, error ? { borderBottomColor: 'red' } : {}]}
          />
          <Pressable style={formItemStyles.suffixWrap} onPress={onRequestContactsPermission}>
            <Image
              style={formItemStyles.suffix}
              source={require('@assets/compressed/apply/contacts.webp')}
              resizeMode="cover"
            />
          </Pressable>
        </View>
        <ErrorMessage name={field}>
          {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
        </ErrorMessage>
      </View>
    </>
  )
}
