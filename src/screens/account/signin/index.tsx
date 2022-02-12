import React, { useContext, useMemo, useState } from 'react'
import { View, Image, Pressable, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'
import type {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import { Logo } from '@/components/logo'
import Text from '@/components/Text'
import styles from './style'
import { REGEX_PHONE, REGEX_VALIDATE_CODE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS, KEY_DEVICEID, KEY_GPS } from '@/utils/constant'
import { StackActions, useNavigation } from '@react-navigation/native'
import type { AccountStackParams } from '@navigation/accountStack'
import { PasswordInput, ValidateCode, ApplyButton, MaskInput } from '@components/form/FormItem'
import { useTranslation } from 'react-i18next'
import { Color } from '@/styles/color'
import { login } from '@/services/user'
import emitter from '@/eventbus'
import type { LoginParameter } from '@/typings/request'
import { default as MoneyyaContext } from '@/state'
import { MMKV } from '@/utils'

export const SigninScreen = ({ route }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const { phone } =
    (route.params as { phone?: string }) ||
    ({ phone: __DEV__ ? '9868960898' : '' } as { phone?: string })
  const tabs = [{ title: t('password-login') }, { title: t('validation-code-login') }]
  const [signInPhone, setSignInPhone] = useState<string>('')
  const tabPanels = [
    <PasswdTab
      phone={phone}
      onPhoneChange={_phone => {
        setSignInPhone(_phone)
      }}
    />,
    <ValidTab
      phone={phone}
      onPhoneChange={_phone => {
        setSignInPhone(_phone)
      }}
    />,
  ]
  const [index, setIndex] = useState<number>(0)
  const navigation = useNavigation<SignInScreenProp>()
  emitter.on('UNREGISTER_USER', () => {
    navigation.dispatch(
      StackActions.replace('SignUp', {
        phone: signInPhone,
      })
    )
  })
  return (
    <SafeAreaView style={styles.flex1}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <Image
        source={require('@/assets/compressed/account/bg.webp')}
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
                onPress={() => {
                  navigation.dispatch(
                    StackActions.replace('SignUp', {
                      phone: signInPhone,
                    })
                  )
                }}>
                {t('signup')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
type SignInScreenProp = NativeStackNavigationProp<AccountStackParams, 'SignIn'>

const PasswdTab = ({
  phone,
  onPhoneChange,
}: {
  phone?: string
  onPhoneChange: (phone: string) => void
}) => {
  const context = useContext(MoneyyaContext)
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
    () => ({ phone: phone || '', password: '' }),
    [phone]
  )
  const onSubmit = debounce(
    (values: Pick<LoginParameter, 'password' | 'phone'>) => {
      onPhoneChange(values.phone)
      login({
        ...values,
        gps: MMKV.getString(KEY_GPS) || '',
        deviceId: MMKV.getString(KEY_DEVICEID) || '',
        loginType: 'PWD_LOGIN',
      }).then(res => {
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
            onPress={handleSubmit}
            loading={context.loading.effects.LOGIN}
            disabled={context.loading.effects.LOGIN}>
            <Text color={isValid ? '#fff' : '#aaa'}>{t('submit')}</Text>
          </ApplyButton>
        </View>
      )}
    </Formik>
  )
}

const ValidTab = ({
  phone,
  onPhoneChange,
}: {
  phone?: string
  onPhoneChange: (phone: string) => void
}) => {
  const context = useContext(MoneyyaContext)
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
    () => ({ phone: phone || '', code: '' }),
    [phone]
  )
  const onSubmit = debounce(
    (values: Pick<LoginParameter, 'code' | 'phone'>) => {
      onPhoneChange(values.phone)
      login({
        ...values,
        gps: context.header.gps,
        deviceId: context.header.deviceId,
        loginType: 'CODE_LOGIN',
      }).then(res => {
        console.log({ res, navigation })
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
            onPress={handleSubmit}
            loading={context.loading.effects.LOGIN}
            disabled={context.loading.effects.LOGIN}>
            <Text color={isValid ? '#fff' : '#aaa'}>{t('signin')}</Text>
          </ApplyButton>
        </View>
      )}
    </Formik>
  )
}
