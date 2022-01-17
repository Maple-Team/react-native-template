import React, { useContext, useMemo, useState } from 'react'
import { View, StatusBar, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE, REGEX_VALIDATE_CODE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { Input, PasswordInput, ValidateCode } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import type { RegisterParameter } from '@/typings/request'
import { register } from '@/services/user'
import { useLocation } from '@/hooks'
import { MoneyyaContext } from '@/state'
import { useNavigation } from '@react-navigation/native'
import { useNetInfo } from '@react-native-community/netinfo'

export const SignupScreen = () => {
  const context = useContext(MoneyyaContext)
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
    password: Yup.string().required(t('password.required')),
    comfirmPassword: Yup.string()
      .required(t('comfirmPassword.required'))
      .oneOf([Yup.ref('password'), null], t('comfirmPassword.notSame')),
    validateCode: Yup.string()
      .min(4, t('field.short', { field: 'Validate Code' }))
      .max(4, t('field.long', { field: 'Validate Code' }))
      .matches(REGEX_VALIDATE_CODE, t('validateCode.invalid'))
      .required(t('validateCode.required')),
    hasAgree: Yup.string().required(t('hasAgree.required')),
  })
  type Model = RegisterParameter & {
    hasAgree?: boolean
  }
  const initialValue = useMemo<Model>(
    () => ({
      phone: __DEV__ ? '9868965897' : '',
      password: __DEV__ ? 'a123456' : '',
      comfirmPassword: __DEV__ ? 'a123456' : '',
      validateCode: '',
    }),
    []
  )
  const netInfo = useNetInfo()
  if (netInfo.isConnected) {
    //TODO 更新internalIP
    console.log(netInfo.details?.ipAddress)
  }

  const na = useNavigation()
  const onSubmit = debounce(
    (values: RegisterParameter) => {
      register(values)
        .then(res => {
          console.log('register res', res)
          const outerip = res.ip
          console.log(outerip) //TODO 更新outernalIP
          // @ts-ignore
          na.navigate('SignIn', { phone: values.phone })
        })
        .catch(res => {
          if (res) {
            // @ts-ignore
            na.navigate('SignIn', { phone: values.phone })
          }
        })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [showPwd, setShowPwd] = useState<boolean>(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false)

  useLocation()

  const [check, setCheck] = useState<boolean>(false)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<Model> initialValues={initialValue} onSubmit={onSubmit} validationSchema={schema}>
            {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <Input
                    field="phone"
                    label={t('phone.label')}
                    maxLength={10}
                    onChangeText={handleChange('phone')}
                    value={values.phone}
                    onClear={() => setFieldValue('phone', '')}
                    placeholder={t('phone.placeholder')}
                    error={errors.phone}
                    keyboardType="phone-pad"
                  />
                  <ValidateCode
                    field="validateCode"
                    label={t('validateCode.label')}
                    onChangeText={handleChange('validateCode')}
                    value={values.validateCode}
                    onClear={() => setFieldValue('validateCode', '')}
                    placeholder={t('validateCode.placeholder')}
                    error={errors.validateCode}
                    validateCodeType="REGISTER"
                    keyboardType="number-pad"
                    phone={values.phone}
                  />
                  <PasswordInput
                    field="password"
                    label={t('password.label')}
                    onChangeText={handleChange('password')}
                    value={values.password}
                    onClear={() => setFieldValue('password', '')}
                    placeholder={t('password.placeholder')}
                    error={errors.password}
                    showPwd={showPwd}
                    onToggle={() => setShowPwd(!showPwd)}
                  />
                  <PasswordInput
                    field="comfirmPassword"
                    label={t('comfirmPassword.label')}
                    onChangeText={handleChange('comfirmPassword')}
                    value={values.comfirmPassword}
                    onClear={() => setFieldValue('comfirmPassword', '')}
                    placeholder={t('comfirmPassword.placeholder')}
                    error={errors.comfirmPassword}
                    showPwd={showConfirmPwd}
                    onToggle={() => setShowConfirmPwd(!showConfirmPwd)}
                  />
                  <PermissionHint
                    onPress={() => {
                      const _check = check
                      setCheck(!_check)
                      setFieldValue('hasAgree', !_check ? true : undefined)
                    }}
                    check={values.hasAgree}
                  />
                  <View>
                    {errors.hasAgree && (
                      <Text
                        //@ts-ignore
                        styles={{ position: 'absolute' }}
                        color="red">
                        {errors.hasAgree}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : 'ghost'}
                    onPress={handleSubmit}
                    loading={context.loading.effects.REGISTER}>
                    <Text color={isValid ? '#fff' : '#aaa'}>{t('submit')}</Text>
                  </ApplyButton>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const PermissionHint = ({ onPress, check }: { onPress: () => void; check?: boolean }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      }}>
      <Pressable onPress={onPress}>
        <Image
          source={
            check
              ? require('@/assets/images/account/check.webp')
              : require('@/assets/images/account/uncheck.webp')
          }
          resizeMode="cover"
        />
      </Pressable>
      <Text fontSize={13} color="rgba(144, 146, 155, 1)">
        Agree with Moneyya{' '}
      </Text>
      <Text fontSize={13} color={Color.primary}>
        Terms of Service{' '}
      </Text>
      <Text fontSize={13} color="rgba(144, 146, 155, 1)">
        and{' '}
      </Text>
      <Text fontSize={13} color={Color.primary}>
        Privacy Policy
      </Text>
    </View>
  )
}
