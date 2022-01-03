import React, { useMemo, useReducer, useState } from 'react'
import { View, Image, SafeAreaView, Pressable, StatusBar } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { Logo } from '@/components/logo'
import Text from '@/components/Text'
import { initiateState, reducer } from '@/state'
import styles from './style'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import { useNavigation } from '@react-navigation/native'
import type { AccountStackParamList } from '@navigation/accountStack'
import { Input, PasswordInput, ValidateCode, ApplyButton } from '@components/form/FormItem'
import { useTranslation } from 'react-i18next'
import { Color } from '@/styles/color'

interface PwdFormModel {
  phone: string
  password: string
}
interface ValidateCodeFormModel {
  phone: string
  validateCode: string
}

export const SigninScreen = () => {
  const tabs = [{ title: 'Password login' }, { title: 'Verification code login' }]
  const tabPanels = [<PasswdTab />, <ValidTab />]
  const [index, setIndex] = useState<number>(0)
  const { t } = useTranslation()
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
  const [state] = useReducer(reducer, initiateState)
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
  const initialValue = useMemo<PwdFormModel>(() => ({ phone: '', password: '' }), [])
  const onSubmit = debounce(
    (values: PwdFormModel) => {
      console.log(values)
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [showPwd, setShowPwd] = useState<boolean>(false)
  return (
    <Formik<PwdFormModel>
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
            type={isValid ? 'primary' : undefined}
            handleSubmit={handleSubmit}
            // loading={state}
            disabled={state.loading.effects.LOGIN}>
            <Text>{t('submit')}</Text>
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
      .min(6, t('field.short', { field: 'Validate Code' }))
      .max(6, t('field.long', { field: 'Validate Code' }))
      .matches(REGEX_PHONE, t('validateCode.invalid'))
      .required(t('phone.required')),
  })
  const initialValue = useMemo<ValidateCodeFormModel>(() => ({ phone: '', validateCode: '' }), [])
  const onSubmit = debounce(
    (values: ValidateCodeFormModel) => {
      console.log(values)
      navigation.navigate('SignIn')
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  return (
    <Formik<ValidateCodeFormModel>
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
            />

            <ValidateCode
              field="validateCode"
              label={t('validateCode.label')}
              onChangeText={handleChange('validateCode')}
              value={values.validateCode}
              onClear={() => setFieldValue('validateCode', '')}
              placeholder={t('validateCode.placeholder')}
              error={errors.validateCode}
              validateCodeType="LOGIN"
              phone={values.phone}
            />
          </View>
          <ApplyButton
            type={isValid ? 'primary' : undefined}
            handleSubmit={handleSubmit}
            // loading={state}
            disabled={state.loading.effects.LOGIN}>
            <Text>{t('signin')}</Text>
          </ApplyButton>
        </View>
      )}
    </Formik>
  )
}
