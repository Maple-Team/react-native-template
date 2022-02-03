import React, { Ref, useCallback } from 'react'
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

interface Props {
  onChange: (text: string) => void
  value?: string
  error?: string
  field: string
  label: string
  placeholder: string
  scrollViewRef?: Ref<ScrollView>
  keyboardType?: KeyboardTypeOptions
}

// https://github.com/henninghall/react-native-date-picker#example-1-modal
export function PhonePicker({ onChange, value, field, label, placeholder }: Props) {
  const { t } = useTranslation()

  const onSelectContacts = useCallback(async () => {
    Contacts.getAll().then(contacts => {
      console.log(contacts)
    })
    const selection = await selectContactPhone()
    console.log(selection)
    if (!selection) {
      return
    }

    const { selectedPhone } = selection
    const contactPhone = selectedPhone.number
    const _value = contactPhone.replace(/[\s-]/g, '') //TODO 正则替换
    onChange(_value)
  }, [onChange])

  const onRequestContactsPermission = useCallback(() => {
    onRequestPermission({
      blockedMessage: t('permission blocked'),
      unavailableMessage: t('permission unavailable'),
      permission: 'android.permission.READ_CONTACTS',
      onGranted: () => {
        onSelectContacts()
      },
    })
  }, [onSelectContacts, t])
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
          />
          <Pressable style={formItemStyles.suffixWrap} onPress={onRequestContactsPermission}>
            <Image
              style={formItemStyles.suffix}
              source={require('@assets/images/apply/contacts.webp')}
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
