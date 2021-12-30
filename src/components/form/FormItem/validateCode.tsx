import React, { useMemo, useState } from 'react'
import { Pressable, TextInput, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import { ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'

import type { ValidateCodeType } from '@/typings/request'
import styles from './style'
import Text from '@components/Text'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { getValidateCode } from '@/services/user'
import { REGEX_PHONE } from '@/utils/reg'

interface InputProps {
  onChangeText: (text: string) => void
  onClear: () => void
  value: string
  error?: string
  field: string
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  phone: string
  validateCodeType: ValidateCodeType
}

export const ValidateCode = ({
  onChangeText,
  value,
  field,
  label,
  placeholder,
  keyboardType,
  error,
  phone,
  onClear,
  validateCodeType,
}: InputProps) => {
  const { t } = useTranslation()
  const [count, setCount] = useState<number>(60)
  const [times, setTimtes] = useState<number>(3)
  const handlePress = debounce(
    () => {
      const iid = setInterval(() => {
        const _count = count - 1
        if (_count <= 0) {
          setCount(60)
          clearInterval(iid)
        } else {
          setCount(_count)
        }
      }, 1000)
      getValidateCode({ sendChannel: 'SMS', phone, type: validateCodeType }).then(code => {
        setTimtes(times - 1)
        console.log(code.kaptcha)
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  ) // FIXME
  const isPhoneValid = useMemo(() => {
    return REGEX_PHONE.test(phone)
  }, [phone])
  return (
    <View style={styles.formItem}>
      <Text styles={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          onChangeText={onChangeText}
          maxLength={6}
          value={value}
          placeholder={placeholder}
          style={[styles.input]}
          keyboardType={keyboardType}
        />
        <View style={styles.suffixWrap}>
          {value ? (
            <>
              {error ? (
                <Pressable onPress={onClear}>
                  <Image
                    style={styles.suffix}
                    source={require('@assets/images/common/clear.webp')}
                    resizeMode="cover"
                  />
                </Pressable>
              ) : (
                <Image
                  style={styles.suffix}
                  source={require('@assets/images/common/correct.webp')}
                  resizeMode="cover"
                />
              )}
            </>
          ) : (
            <></>
          )}
          {count !== 60 ? (
            <>
              {times > 0 ? (
                <Pressable style={[styles.validBtnWrap, styles.validBtnWrapDisabled]}>
                  <Text styles={[styles.validBtn, styles.validBtnDisabled]}>
                    {t('validateCode.wait', { num: count })}
                  </Text>
                </Pressable>
              ) : (
                <Pressable style={[styles.validBtnWrap]}>
                  <Text styles={[styles.validBtn]}>{t('validateCode.maxTime')}</Text>
                </Pressable>
              )}
            </>
          ) : (
            <Pressable
              disabled={!isPhoneValid}
              style={[styles.validBtnWrap, !isPhoneValid ? styles.validBtnWrapDisabled : {}]}
              android_disableSound={false}
              onPress={handlePress}
              android_ripple={{ color: '#f00', borderless: false, radius: 60 }}>
              <Text styles={styles.validBtn}>{t('validateCode.get')}</Text>
            </Pressable>
          )}
        </View>
      </View>
      <ErrorMessage name={field}>
        {msg => <Text styles={[styles.warn, styles.error]}>{msg}</Text>}
      </ErrorMessage>
    </View>
  )
}