import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { View, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { object, string } from 'yup'
import debounce from 'lodash.debounce'

import { Logo } from '@/components/logo'
import { Text } from '@/components'
import styles from './style'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS, KEY_BRAND, KEY_USER_AGENT } from '@/utils/constant'
import { MaskInput } from '@components/form'
import { Color } from '@/styles/color'
import emitter from '@/eventbus'
import { queryBrand } from '@/services/apply'
import { MMKV } from '@/utils'
import { StackActions } from '@react-navigation/native'

import DeviceInfo from 'react-native-device-info'
interface FormModel {
  phone: string
}
export const EntryScreen = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = object().shape({
    phone: string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid')),
  })
  const initialValue: FormModel = { phone: '' }
  const [phone, setPhone] = useState<string>()
  const onSubmit = debounce(
    (values: FormModel) => {
      navigation.dispatch(StackActions.replace('SignIn', { phone: values.phone }))
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  useEffect(() => {
    DeviceInfo.getUserAgent()
      .then(res => {
        MMKV.setString(KEY_USER_AGENT, res)
      })
      .catch(console.error)
    queryBrand().then(brand => {
      emitter.emit('UPDATE_BRAND', brand)
      MMKV.setMap(KEY_BRAND, brand)
    })
  }, [])
  return (
    <SafeAreaView style={styles.flex1}>
      <ImageBackground
        source={require('@/assets/compressed/account/bg.webp')}
        resizeMode="cover"
        style={styles.bg}>
        <ScrollView style={styles.flex1}>
          <View style={styles.container}>
            <View style={styles.wrap}>
              <Logo />
              <View style={styles.form}>
                <Formik<FormModel>
                  initialValues={initialValue}
                  onSubmit={onSubmit}
                  validationSchema={schema}>
                  {({ handleSubmit, values, setFieldValue, errors }) => (
                    <>
                      <View style={styles.formItem}>
                        <MaskInput
                          field="phone"
                          label={t('phone.label')}
                          onChangeText={(formatted, extracted) => {
                            setFieldValue('phone', extracted)
                            setPhone(extracted)
                          }}
                          value={values.phone}
                          placeholder={t('phone.label')}
                          error={errors.phone}
                          keyboardType="phone-pad"
                          mask={'[0000] [000] [000]'}
                          Prefix={<Text color={Color.primary}>+52</Text>}
                        />
                      </View>
                      <Button
                        style={[styles.signin, styles.btn]}
                        type="primary"
                        // @ts-ignore
                        onPress={handleSubmit}>
                        <Text>{t('signin')}</Text>
                      </Button>
                    </>
                  )}
                </Formik>
                <Button
                  style={[styles.signup, styles.btn]}
                  onPress={async () => {
                    navigation.dispatch(
                      StackActions.replace('SignUp', {
                        phone,
                      })
                    )
                  }}>
                  <Text color={Color.primary}>{t('signup')}</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}
