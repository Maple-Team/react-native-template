import React, { useEffect, useMemo, useState } from 'react'
import { View, StatusBar, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { object, string, ref, boolean } from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text, ToastLoading } from '@/components'
import { REGEX_PASSWORD, REGEX_PHONE, REGEX_VALIDATE_CODE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_INTERIP, KEY_OUTERIP } from '@/utils/constant'
import { MaskInput, PasswordInput, ValidateCode } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import type { RegisterParameter } from '@/typings/request'
import { register } from '@/services/user'
import { useLocation } from '@/hooks'
import { useNavigation } from '@react-navigation/native'
import { useNetInfo } from '@react-native-community/netinfo'
import { MMKV } from '@/utils'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AccountStackParams } from '@navigation/accountStack'
import { t } from 'i18next'
import { uploadJpush } from '@/services/misc'
import emitter from '@/eventbus'
import { queryBrand } from '@/services/apply'
import { Brand } from '@/typings/response'

type NaviType = NativeStackNavigationProp<AccountStackParams, 'SignUp'>

export const SignupScreen = ({ route }: { route: any }) => {
  const params = route.params || ({ phone: '' } as { phone?: string })
  const schema = object().shape({
    phone: string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
    password: string()
      .matches(REGEX_PASSWORD, t('password.invalid'))
      .required(t('password.required')),
    comfirmPassword: string()
      .matches(REGEX_PASSWORD, t('comfirmPassword.invalid'))
      .required(t('comfirmPassword.required'))
      .oneOf([ref('password'), null], t('comfirmPassword.notSame')),
    validateCode: string()
      .min(4, t('field.short', { field: 'Validate Code' }))
      .max(4, t('field.long', { field: 'Validate Code' }))
      .matches(REGEX_VALIDATE_CODE, t('validateCode.invalid'))
      .required(t('validateCode.required')),
    hasAgree: boolean().required(t('hasAgree.required')),
  })
  type Model = RegisterParameter & {
    hasAgree?: boolean
  }
  const initialValue = useMemo<Model>(
    () => ({
      phone: params?.phone,
      password: '',
      comfirmPassword: '',
      validateCode: '',
    }),
    [params?.phone]
  )
  const netInfo = useNetInfo()
  if (netInfo.isConnected) {
    //@ts-ignore
    MMKV.setString(KEY_INTERIP, netInfo.details?.ipAddress)
  }

  const na = useNavigation<NaviType>()
  const onSubmit = debounce(
    (values: RegisterParameter) => {
      register(values)
        .then(res => {
          MMKV.setString(KEY_OUTERIP, res.ip)
          // NOTE JPUSH register Success
          uploadJpush({
            phone: values.phone,
          })
          emitter.emit('LOGIN_SUCCESS', res)
        })
        .catch(res => {
          if (res) {
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
  const [, setCheck] = useState<boolean>(false)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<Model> initialValues={initialValue} onSubmit={onSubmit} validationSchema={schema}>
            {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => {
              emitter.on('AGREE_WITH_TERMS', () => {
                setFieldValue('hasAgree', true)
                setCheck(true)
              })
              return (
                <>
                  <View style={PageStyles.form}>
                    <MaskInput
                      field="phone"
                      label={t('phone.label')}
                      onChangeText={(formatted, extracted) => {
                        setFieldValue('phone', extracted)
                      }}
                      value={values.phone}
                      placeholder={t('phone.placeholder')}
                      error={errors.phone}
                      keyboardType="phone-pad"
                      mask={'[0000] [000] [000]'}
                      Prefix={<Text color={Color.primary}>+52</Text>}
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
                    <PermissionHint check={values.hasAgree} />
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
                    <ApplyButton type={isValid ? 'primary' : 'ghost'} onPress={handleSubmit}>
                      <Text color={isValid ? '#fff' : '#aaa'}>{t('submit')}</Text>
                    </ApplyButton>
                  </View>
                </>
              )
            }}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const PermissionHint = ({ check }: { check?: boolean }) => {
  const na = useNavigation()
  const [loading, setLoading] = useState<boolean>()
  const [brand, setBrand] = useState<Brand>()
  useEffect(() => {
    setLoading(true)
    queryBrand()
      .then(b => {
        setBrand(b)
        emitter.emit('UPDATE_BRAND', b)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  return (
    <>
      <ToastLoading animating={loading} />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}>
        {check ? (
          <Pressable style={{ marginRight: 5 }}>
            <Image source={require('@/assets/compressed/account/check.webp')} resizeMode="cover" />
          </Pressable>
        ) : (
          <Pressable
            style={{ marginRight: 5 }}
            onPress={() => {
              //@ts-ignore
              na.navigate('Terms', { url: brand?.channelInfo.serviceUrl })
            }}>
            <Image
              source={require('@/assets/compressed/account/uncheck.webp')}
              resizeMode="cover"
            />
          </Pressable>
        )}
        <Text fontSize={13} color="rgba(144, 146, 155, 1)">
          {t('agreeWithMoneyya')}{' '}
        </Text>
        <Pressable
          onPress={() => {
            //@ts-ignore
            na.navigate('Terms', { url: brand?.channelInfo.serviceUrl })
          }}>
          <Text fontSize={13} color={Color.primary}>
            {t('termsofService')}
          </Text>
        </Pressable>
      </View>
    </>
  )
}
