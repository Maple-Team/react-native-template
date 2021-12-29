import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { View, Image, SafeAreaView, TextInput, Pressable } from 'react-native'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { ErrorMessage, Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { Logo } from '@/components/logo'
import Text from '@/components/Text'
import { initiateState, reducer } from '@/state'
import styles from './style'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import Behavior from '@/utils/behavior'
import { getStorageValue } from '@/utils/storage'
import type { BehaviorModel } from '@/typings/behavior'

interface FormModel {
  phone: string
}

export const EntryScreen = ({ navigation }: NativeStackHeaderProps) => {
  const [state] = useReducer(reducer, initiateState)
  const { t } = useTranslation()

  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
  })
  const initialValue = useMemo<FormModel>(() => ({ phone: '' }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values, behavior?.getCurrentModel())
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [behavior, setBehavior] = useState<Behavior<'P01'>>()

  useEffect(() => {
    async function _getBehavior() {
      const value = (await getStorageValue('p')) as BehaviorModel<'P01'>
      setBehavior(new Behavior(value))
    }
    _getBehavior()
  }, [])
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

            <View style={styles.form}>
              <Formik<FormModel>
                initialValues={initialValue}
                onSubmit={onSubmit}
                validationSchema={schema}>
                {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
                  <>
                    <View style={styles.formItem}>
                      <Text styles={styles.label}>{t('phone.label')}</Text>
                      <View style={styles.inputWrap}>
                        <TextInput
                          onChangeText={handleChange('phone')}
                          maxLength={11}
                          onBlur={() => {
                            console.log('onblur', values.phone)
                            behavior?.setEndModify('P01_C01_I_FIRSTNAME', values.phone)
                          }}
                          onFocus={() => {
                            console.log('onFocus', values.phone)
                            behavior?.setStartModify('P01_C01_I_FIRSTNAME', values.phone)
                          }}
                          value={values.phone}
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

                    <Button
                      style={[styles.signin, styles.btn]}
                      type="primary"
                      loading={state.loading.effects.LOGIN}
                      // @ts-ignore
                      onPress={handleSubmit}>
                      <Text>{t('signin')}</Text>
                    </Button>
                  </>
                )}
              </Formik>
              <Button
                style={[styles.signup, styles.btn]}
                loading={state.loading.effects.LOGIN}
                onPress={async () => {
                  navigation.navigate('SignUp')
                }}>
                <Text>{t('signup')}</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
