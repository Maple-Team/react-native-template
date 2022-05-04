import React, { type RefObject, useCallback, useRef } from 'react'
import { TextInput, View, Image, Pressable } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import formItemStyles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { selectContactPhone } from 'react-native-select-contact'
import { getAll as getAllContacts } from 'react-native-contacts'
import { onRequestPermission } from '@/utils/permission'
import type { ScrollView } from 'react-native-gesture-handler'
import { MMKV } from '@/utils'
import { KEY_CONTACTS } from '@/utils/constant'
import { Modal } from '@ant-design/react-native'
// import { UseFocusOnError } from '@/hooks'

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
}: // scrollViewRef,
Props) {
  const { t } = useTranslation()

  const onSelectContacts = useCallback(async () => {
    getAllContacts().then(contacts => {
      const data = contacts
        .map(contact => {
          return contact.phoneNumbers.map(phone => {
            return {
              contactCallCount: 0,
              contactLastCallTime: '',
              contactName:
                `${contact.givenName} ${contact.middleName} ${contact.familyName}`.trim(),
              contactPhone: phone.number.replace(/[\s-]/g, ''),
              contactRelation: 'default',
            }
          })
        })
        .reduce((prev, curr) => prev.concat(curr), [])
      MMKV.setArrayAsync(KEY_CONTACTS, data)
    })
    const selection = await selectContactPhone()
    if (!selection) {
      return
    }

    const {
      selectedPhone,
      contact: { phones },
    } = selection
    if (phones.length > 1) {
      Modal.operation(
        phones.map(({ number }) => {
          return {
            text: number,
            onPress: () => {
              const _phone = number.replace(/[\s-]/g, '')
              onChange(_phone)
            },
          }
        })
      )
    } else {
      const contactPhone = selectedPhone.number
      const _value = contactPhone.replace(/[\s-]/g, '')
      onChange(_value)
    }
  }, [onChange])

  const onRequestContactsPermission = useCallback(
    () =>
      onRequestPermission({
        blockedMessage: t('permission-blocked', { permission: t('permission.contact') }),
        unavailableMessage: t('permission-unavailable', { permission: t('permission.contact') }),
        permission: 'android.permission.READ_CONTACTS',
        onGranted: () => {
          onSelectContacts()
        },
      }),
    [onSelectContacts, t]
  )
  // console.log({ field }, 'PhonePicker rendering')
  const fieldRef = useRef<TextInput>(null)
  // const [height, setHeight] = useState<number>(0)
  return (
    <>
      {/* <UseFocusOnError
        fieldRef={fieldRef}
        name={field}
        scrollViewRef={scrollViewRef}
        offsetY={height}
      /> */}
      <View style={formItemStyles.formItem}>
        <Text styles={formItemStyles.label}>{label}</Text>
        <View style={formItemStyles.inputWrap}>
          <Pressable onPress={onRequestContactsPermission}>
            <TextInput
              ref={fieldRef}
              editable={false}
              onLayout={() => {
                // fieldRef.current?.measure((_x, _y, _width, _height, _pageX, pageY) => {
                //   setHeight(pageY - _height)
                // })
              }}
              value={value}
              placeholder={placeholder}
              style={[formItemStyles.input, error ? { borderBottomColor: 'red' } : {}]}
            />
          </Pressable>
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
