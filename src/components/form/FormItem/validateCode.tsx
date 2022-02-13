import React, {
  useContext,
  // useContext,
  useMemo,
  useState,
} from 'react'
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
  validateCodeType,
}: InputProps) => {
  const { t } = useTranslation()
  const context = useContext(MoneyyaContext)
  const maxCount = useMemo(
    () => context.brand?.smsWaitInterval || 60,
    [context.brand?.smsWaitInterval]
  )
  const [count, setCount] = useState<number>(maxCount)
  // FIXME
  const [times, setTimtes] = useState<number>(context.brand?.codeValidatecount || 5) // Brand info
  const [isPlaying, setPlaying] = useState<boolean>(false)
  console.log(times, setTimtes)
  const handlePress = debounce(
    () => {
      setPlaying(true)
      getValidateCode({ sendChannel: 'SMS', phone, type: validateCodeType }).then(code => {
        console.log({ kaptcha: code.kaptcha })
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  useInterval(
    () => {
      let _count = count - 1
      if (_count <= 0) {
        setPlaying(false)
        setCount(maxCount)
      } else {
        setCount(_count)
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
          keyboardType={keyboardType}
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
          {count !== maxCount ? (
            <Pressable style={[styles.validBtnWrap, { backgroundColor: '#eee' }]}>
              <Text styles={[styles.validBtn]}>{t('validateCode.wait', { num: count })}</Text>
            </Pressable>
          ) : (
            <Pressable
              disabled={!isPhoneValid}
              style={[styles.validBtnWrap, !isPhoneValid ? styles.validBtnWrapDisabled : {}]}
              android_disableSound={false}
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
