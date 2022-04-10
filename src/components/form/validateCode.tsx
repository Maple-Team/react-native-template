import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Pressable, TextInput, View, Image } from 'react-native'
import type { KeyboardTypeOptions } from 'react-native'
import { ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash.debounce'
import { useInterval } from 'usehooks-ts'

import { default as MoneyyaContext } from '@/state'
import type { ValidateCodeType } from '@/typings/request'
import styles from './style'
import Text from '@components/Text'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { getValidateCode } from '@/services/user'
import { REGEX_PHONE } from '@/utils/reg'

interface InputProps {
  onChangeText: (text: string) => void
  onClear: () => void
  value?: string
  error?: string
  field: string
  label: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  phone: string
  validateCodeType: ValidateCodeType
  /**
   * 达到最大短信验证次数
   */
  onMaxSMS?: () => void
}
// 后台数据动态处理
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
  onMaxSMS,
  validateCodeType,
}: InputProps) => {
  const { t } = useTranslation()
  const context = useContext(MoneyyaContext)
  const maxInterval = context.brand?.smsWaitInterval || 60
  const [interval, setInterval] = useState<number>(maxInterval)
  const maxTimes = context.brand?.codeValidatecount || 100
  const [times, setTimtes] = useState<number>(0)
  const [isPlaying, setPlaying] = useState<boolean>(false)
  const handlePress = debounce(
    () => {
      setPlaying(true)
      getValidateCode({ sendChannel: 'SMS', phone, type: validateCodeType }).then(code => {
        setTimtes(_ => _ + 1)
        console.log({ kaptcha: code.kaptcha })
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useEffect(() => {
    if (times > maxTimes) {
      onMaxSMS && onMaxSMS()
    }
  }, [maxTimes, onMaxSMS, times])
  useInterval(
    () => {
      let _count = interval - 1
      if (_count <= 0) {
        setPlaying(false)
        setInterval(maxInterval)
        if (times >= maxTimes && !value) {
          onMaxSMS && onMaxSMS()
        }
      } else {
        setInterval(_count)
      }
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? 1000 : null
  )

  const isPhoneValid = useMemo(() => REGEX_PHONE.test(phone), [phone])

  return (
    <View style={styles.formItem}>
      <Text styles={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          onChangeText={onChangeText}
          maxLength={4}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType || 'number-pad'}
          style={[styles.input, error ? { borderBottomColor: 'red' } : {}]}
          placeholderTextColor={'rgba(156, 171, 185, 1)'}
        />
        <View style={styles.suffixWrap}>
          {value ? (
            <>
              {error ? (
                <Pressable onPress={onClear}>
                  <Image
                    style={styles.suffix}
                    source={require('@assets/compressed/common/clear.webp')}
                    resizeMode="cover"
                  />
                </Pressable>
              ) : (
                <Image
                  style={styles.suffix}
                  source={require('@assets/compressed/common/correct.webp')}
                  resizeMode="cover"
                />
              )}
            </>
          ) : (
            <></>
          )}
          {interval !== maxInterval ? (
            <Pressable style={[styles.validBtnWrap, { backgroundColor: '#eee' }]}>
              <Text styles={[styles.validBtn]}>{t('validateCode.wait', { num: interval })}</Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={!isPhoneValid}
              style={[styles.validBtnWrap, !isPhoneValid ? styles.validBtnWrapDisabled : {}]}
              onPress={handlePress}>
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
