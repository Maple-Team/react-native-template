import React, { useMemo, useReducer, useState } from 'react'
import { View, Image, SafeAreaView, TextInput, Pressable } from 'react-native'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { ErrorMessage, Formik } from 'formik'
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
import { RootStackParamList } from '@navigation/accountStack'

interface FormModel {
  phone: string
  password: string
}
interface FormModel2 {
  phone: string
  validateCode: string
}

export const SigninScreen = () => {
  const tabs = [{ title: 'Password login' }, { title: 'Verification code login' }]
  const tabPanels = [<PasswdTab />, <ValidTab />]
  const [index, setIndex] = useState<number>(0)
  return (
    <SafeAreaView style={styles.flex1}>
      <Image
        source={require('@/assets/images/account/bg.webp')}
        resizeMode="stretch"
        style={styles.bg}
      />
      <ScrollView style={styles.flex1}>
        <View style={styles.container}>
          <View style={styles.wrap}>
            <Logo />
            <View style={styles.tab}>
              {tabs.map((tab, i) => {
                return (
                  <Pressable
                    onPress={() => setIndex(i)}
                    style={[styles.tabBar, i === index ? styles.tabBarAct : {}]}>
                    <Text styles={styles.tabBarText}>{tab.title}</Text>
                  </Pressable>
                )
              })}
            </View>
            {tabPanels[index]}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
type SignInScreenProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>

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
  const initialValue = useMemo<FormModel>(() => ({ phone: '', password: '' }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values)
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  return (
    <Formik<FormModel> initialValues={initialValue} onSubmit={onSubmit} validationSchema={schema}>
      {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
        <View style={styles.formWrap}>
          <View style={styles.form}>
            <View style={styles.formItem}>
              <Text styles={styles.label}>{t('phone.label')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  onChangeText={handleChange('phone')}
                  maxLength={11}
                  value={values.phone}
                  placeholder={t('phone.placeholder')}
                  style={[styles.input]}
                />
                {values.phone ? (
                  errors.phone ? (
                    <Pressable onPress={() => setFieldValue('phone', '')}>
                      <Image
                        style={styles.suffix}
                        source={require('@/assets/images/common/clear.webp')}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ) : (
                    <Image
                      style={styles.suffix}
                      source={require('@/assets/images/common/correct.webp')}
                      resizeMode="cover"
                    />
                  )
                ) : (
                  <></>
                )}
              </View>
              <ErrorMessage name="phone">
                {msg => <Text styles={[styles.warn, styles.error]}>{msg}</Text>}
              </ErrorMessage>
            </View>

            <View style={styles.formItem}>
              <Text styles={styles.label}>{t('password.label')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  onChangeText={handleChange('password')}
                  maxLength={11}
                  value={values.password}
                  placeholder={t('password.placeholder')}
                  style={[styles.input]}
                  textContentType="password"
                />
                {values.password ? (
                  errors.password ? (
                    <Pressable onPress={() => setFieldValue('password', '')}>
                      <Image
                        style={styles.suffix}
                        source={require('@/assets/images/common/clear.webp')}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ) : (
                    <Image
                      style={styles.suffix}
                      source={require('@/assets/images/common/correct.webp')}
                      resizeMode="cover"
                    />
                  )
                ) : (
                  <></>
                )}
              </View>
              <ErrorMessage name="phone">
                {msg => <Text styles={[styles.warn, styles.error]}>{msg}</Text>}
              </ErrorMessage>
            </View>
          </View>
          <View style={styles.btnWrap}>
            <Button
              style={[styles.btn]}
              type="primary"
              loading={state.loading.effects.LOGIN}
              // @ts-ignore
              onPress={handleSubmit}>
              <Text>{t('signin')}</Text>
            </Button>
          </View>
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
  const initialValue = useMemo<FormModel2>(() => ({ phone: '', validateCode: '' }), [])
  const onSubmit = debounce(
    (values: FormModel2) => {
      console.log(values)
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  return (
    <Formik<FormModel2> initialValues={initialValue} onSubmit={onSubmit} validationSchema={schema}>
      {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
        <View style={styles.formWrap}>
          <View style={styles.form}>
            <View style={styles.formItem}>
              <Text styles={styles.label}>{t('phone.label')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  onChangeText={handleChange('phone')}
                  maxLength={11}
                  value={values.phone}
                  placeholder={t('phone.placeholder')}
                  style={[styles.input]}
                />
                {values.phone ? (
                  errors.phone ? (
                    <Pressable onPress={() => setFieldValue('phone', '')}>
                      <Image
                        style={styles.suffix}
                        source={require('@/assets/images/common/clear.webp')}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ) : (
                    <Image
                      style={styles.suffix}
                      source={require('@/assets/images/common/correct.webp')}
                      resizeMode="cover"
                    />
                  )
                ) : (
                  <></>
                )}
              </View>
              <ErrorMessage name="phone">
                {msg => <Text styles={[styles.warn, styles.error]}>{msg}</Text>}
              </ErrorMessage>
            </View>

            <View style={styles.formItem}>
              <Text styles={styles.label}>{t('validateCode.label')}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  onChangeText={handleChange('validateCode')}
                  maxLength={11}
                  value={values.validateCode}
                  placeholder={t('validateCode.placeholder')}
                  style={[styles.input]}
                />
                {values.validateCode ? (
                  errors.validateCode ? (
                    <Pressable onPress={() => setFieldValue('validateCode', '')}>
                      <Image
                        style={styles.suffix}
                        source={require('@/assets/images/common/clear.webp')}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ) : (
                    <Image
                      style={styles.suffix}
                      source={require('@/assets/images/common/correct.webp')}
                      resizeMode="cover"
                    />
                  )
                ) : (
                  <></>
                )}
              </View>
              <ErrorMessage name="validateCode">
                {msg => <Text styles={[styles.warn, styles.error]}>{msg}</Text>}
              </ErrorMessage>
            </View>
          </View>

          <View style={styles.btnWrap}>
            <Button
              style={[styles.btn]}
              type="primary"
              loading={state.loading.effects.LOGIN}
              // @ts-ignore
              onPress={handleSubmit}>
              <Text>{t('signin')}</Text>
            </Button>
          </View>
        </View>
      )}
    </Formik>
  )
}
