import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useMemo, useState } from 'react'
import { View, SafeAreaView, StatusBar, Image } from 'react-native'
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

export const SignupScreen = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
    password: Yup.string().required(t('password.required')),
    comfirmPassword: Yup.string().required(t('password.required')),
    validateCode: Yup.string()
      .min(4, t('field.short', { field: 'Validate Code' }))
      .max(4, t('field.long', { field: 'Validate Code' }))
      .matches(REGEX_VALIDATE_CODE, t('validateCode.invalid'))
      .required(t('phone.required')),
  })
  const initialValue = useMemo<RegisterParameter>(
    () => ({
      phone: '',
      password: '',
      comfirmPassword: '',
      validateCode: '',
    }),
    []
  )
  const onSubmit = debounce(
    (values: RegisterParameter) => {
      register(values).then(res => {
        console.log(res, navigation)
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [showPwd, setShowPwd] = useState<boolean>(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<RegisterParameter>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
              <>
                <View style={PageStyles.form}>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                    }}>
                    <Image
                      source={require('@/assets/images/account/check.webp')}
                      resizeMode="cover"
                    />
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
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : 'ghost'}
                    handleSubmit={handleSubmit}
                    // loading={state}
                  >
                    <Text color={isValid ? '#fff' : '#000'}>{t('submit')}</Text>
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
