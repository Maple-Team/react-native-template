import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useMemo, useReducer } from 'react'
import { View, SafeAreaView, StatusBar, ImageBackground } from 'react-native'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { Logo } from '@/components/logo'
import Text from '@/components/Text'
import { initiateState, reducer } from '@/state'
import styles from './style'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import { Input } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { queryBrand } from '@/services/apply'

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
      console.log(values)
      navigation.navigate('SignIn')
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useEffect(() => {
    queryBrand().then(res => {
      console.log(res)
    })
  }, [])
  return (
    <SafeAreaView style={styles.flex1}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('@/assets/images/account/bg.webp')}
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
                  {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
                    <>
                      <View style={styles.formItem}>
                        <Input
                          field="phone"
                          label={t('phone.label')}
                          onChangeText={handleChange('phone')}
                          value={values.phone}
                          onClear={() => setFieldValue('phone', '')}
                          placeholder={t('phone.placeholder')}
                          error={errors.phone}
                        />
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
