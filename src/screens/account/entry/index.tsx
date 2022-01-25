import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useMemo } from 'react'
import { View, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { Logo } from '@/components/logo'
import Text from '@/components/Text'
import { default as MoneyyaContext } from '@/state'
import styles from './style'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import { MaskInput } from '@components/form/FormItem'
import { Color } from '@/styles/color'

interface FormModel {
  phone: string
}

export const EntryScreen = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid')),
  })
  const initialValue = useMemo<FormModel>(() => ({ phone: '' }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      navigation.navigate('SignIn', { phone: values.phone })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  const context = useContext(MoneyyaContext)

  return (
    <SafeAreaView style={styles.flex1}>
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
                  {({ handleSubmit, values, setFieldValue, errors }) => (
                    <>
                      <View style={styles.formItem}>
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
                          mask={'[0000] [0000] [00]'}
                        />
                      </View>
                      <Button
                        style={[styles.signin, styles.btn]}
                        type="primary"
                        loading={context.loading.effects.LOGIN}
                        // @ts-ignore
                        onPress={handleSubmit}>
                        <Text>{t('signin')}</Text>
                      </Button>
                    </>
                  )}
                </Formik>
                <Button
                  style={[styles.signup, styles.btn]}
                  loading={context.loading.effects.LOGIN}
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
