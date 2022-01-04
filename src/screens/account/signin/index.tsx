import React, { useMemo, useReducer, useState } from 'react'
import { View, Image, SafeAreaView, Pressable, StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { Logo } from '@/components/logo'
import Text from '@/components/Text'
import { initiateState, reducer, UPDATE_TOKEN } from '@/state'
import styles from './style'
import { REGEX_PHONE, REGEX_VALIDATE_CODE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import { useNavigation } from '@react-navigation/native'
import type { AccountStackParamList } from '@navigation/accountStack'
import { Input, PasswordInput, ValidateCode, ApplyButton } from '@components/form/FormItem'
import { useTranslation } from 'react-i18next'
import { Color } from '@/styles/color'
import { login } from '@/services/user'
import emitter from '@/eventbus'
import { LoginParameter } from '@/typings/request'

export const SigninScreen = () => {
  const { t } = useTranslation()
  const tabs = [{ title: t('Password.login') }, { title: t('Verification.code.login') }]
  const tabPanels = [<PasswdTab />, <ValidTab />]
  const [index, setIndex] = useState<number>(0)
  const navigation = useNavigation<SignInScreenProp>()

  return (
    <SafeAreaView style={styles.flex1}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <Image
        source={require('@/assets/images/account/bg.webp')}
        resizeMode="stretch"
        style={styles.bg}
      />
      <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.wrap}>
            <Logo />
            <View style={styles.tab}>
              {tabs.map((tab, i) => {
                return (
                  <Pressable
                    key={tab.title}
                    onPress={() => setIndex(i)}
                    style={[styles.tabBar, i === index ? styles.tabBarAct : {}]}>
                    <Text styles={styles.tabBarText}>{tab.title}</Text>
                  </Pressable>
                )
              })}
            </View>
            {tabPanels[index]}
            <View style={styles.jump}>
              <Text fontSize={19} color="#fff">
                Don't have an account ?{' '}
              </Text>
              <Text
                fontSize={19}
                color="rgba(255, 234, 0, 1)"
                styles={styles.jumpLink}
                onPress={() => navigation.navigate('SignUp')}>
                {t('signup')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
type SignInScreenProp = NativeStackNavigationProp<AccountStackParamList, 'SignIn'>

const PasswdTab = () => {
  const [state, dispatch] = useReducer(reducer, initiateState)
  const navigation = useNavigation<SignInScreenProp>()
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
    password: Yup.string().required(t('password.required')),
  })
  const initialValue = useMemo<Pick<LoginParameter, 'password' | 'phone'>>(
    () => ({ phone: '9868965898', password: '' }),
    []
  )
  const onSubmit = debounce(
    (values: Pick<LoginParameter, 'password' | 'phone'>) => {
      login({
        ...values,
        gps: state.header.gps,
        deviceId: state.header.deviceId,
        loginType: 'PWD_LOGIN',
      }).then(res => {
        dispatch({
          type: UPDATE_TOKEN,
          token: res.accessToken,
        })
        emitter.emit('LOGIN_SUCCESS', res)
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [showPwd, setShowPwd] = useState<boolean>(false)
  return (
    <Formik<Pick<LoginParameter, 'phone' | 'password'>>
      initialValues={initialValue}
      onSubmit={onSubmit}
      validationSchema={schema}>
      {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
        <View style={styles.formWrap}>
          <View style={styles.form}>
            <Input
              field="phone"
              label={t('phone.label')}
              onChangeText={handleChange('phone')}
              value={values.phone}
              onClear={() => setFieldValue('phone', '')}
              placeholder={t('phone.placeholder')}
              error={errors.phone}
              keyboardType="phone-pad"
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
            <Pressable
              style={{ alignItems: 'flex-end' }}
              onPress={() => {
                navigation.navigate('Reset')
              }}>
              <Text color="rgba(51, 50, 48, 1)" fontSize={15}>
                {t('forget-password')}
              </Text>
            </Pressable>
          </View>
          <ApplyButton
            type={isValid ? 'primary' : 'ghost'}
            handleSubmit={handleSubmit}
            // loading={state}
            disabled={state.loading.effects.LOGIN}>
            <Text color={isValid ? '#fff' : '#aaa'}>{t('submit')}</Text>
          </ApplyButton>
        </View>
      )}
    </Formik>
  )
}

const ValidTab = () => {
  const [state] = useReducer(reducer, initiateState)
  const navigation = useNavigation<SignInScreenProp>()
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
    validateCode: Yup.string()
      .min(4, t('field.short', { field: 'Validate Code' }))
      .max(4, t('field.long', { field: 'Validate Code' }))
      .required(t('validateCode.required'))
      .matches(REGEX_VALIDATE_CODE, t('validateCode.invalid')),
  })
  const initialValue = useMemo<Pick<LoginParameter, 'phone' | 'code'>>(
    () => ({ phone: '9868965898', code: '' }),
    []
  )
  const onSubmit = debounce(
    (values: Pick<LoginParameter, 'code' | 'phone'>) => {
      login({
        ...values,
        gps: state.header.gps,
        deviceId: state.header.deviceId,
        loginType: 'CODE_LOGIN',
      }).then(res => {
        console.log(res, navigation)
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  return (
    <Formik<Pick<LoginParameter, 'phone' | 'code'>>
      initialValues={initialValue}
      onSubmit={onSubmit}
      validationSchema={schema}>
      {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
        <View style={styles.formWrap}>
          <View style={styles.form}>
            <Input
              field="phone"
              label={t('phone.label')}
              onChangeText={handleChange('phone')}
              value={values.phone}
              onClear={() => setFieldValue('phone', '')}
              placeholder={t('phone.placeholder')}
              error={errors.phone}
              keyboardType="phone-pad"
            />
            <ValidateCode
              field="code"
              label={t('validateCode.label')}
              onChangeText={handleChange('code')}
              value={values.code}
              onClear={() => setFieldValue('code', '')}
              placeholder={t('validateCode.placeholder')}
              error={errors.code}
              validateCodeType="LOGIN"
              phone={values.phone}
              keyboardType="number-pad"
            />
          </View>
          <ApplyButton
            type={isValid ? 'primary' : undefined}
            handleSubmit={handleSubmit}
            // loading={state}
            disabled={state.loading.effects.LOGIN}>
            <Text color={isValid ? '#fff' : '#aaa'}>{t('signin')}</Text>
          </ApplyButton>
        </View>
      )}
    </Formik>
  )
}
