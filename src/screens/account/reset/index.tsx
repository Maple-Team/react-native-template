import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useMemo, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { string, object, ref } from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PASSWORD, REGEX_PHONE, REGEX_VALIDATE_CODE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { MaskInput, PasswordInput, ValidateCode } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import { reset } from '@/services/user'
import type { ResetPwdParameter } from '@/typings/account'
import emitter from '@/eventbus'

export const ResetScreen = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
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
      .required(t('password.required'))
      .oneOf([ref('password'), null], t('comfirmPassword.notSame')),
    validateCode: string()
      .min(4, t('field.short', { field: 'Validate Code' }))
      .max(4, t('field.long', { field: 'Validate Code' }))
      .required(t('validateCode.required'))
      .matches(REGEX_VALIDATE_CODE, t('validateCode.invalid')),
  })
  const initialValue = useMemo<ResetPwdParameter>(
    () => ({
      phone: '',
      password: '',
      comfirmPassword: '',
      validateCode: '',
    }),
    []
  )
  const onSubmit = debounce(
    (values: ResetPwdParameter) => {
      reset(values).then(() => {
        emitter.emit('SHOW_MESSAGE', {
          type: 'success',
          message: t('resetpwd.success'),
        })
        navigation.navigate('SignIn')
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [showPwd, setShowPwd] = useState<boolean>(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<ResetPwdParameter>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
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
                  <ValidateCode
                    field="validateCode"
                    label={t('validateCode.label')}
                    onChangeText={handleChange('validateCode')}
                    value={values.validateCode}
                    onClear={() => setFieldValue('validateCode', '')}
                    placeholder={t('validateCode.placeholder')}
                    error={errors.validateCode}
                    validateCodeType="MODIFY_PASSWORD"
                    phone={values.phone}
                    keyboardType="number-pad"
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
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton type={isValid ? 'primary' : 'ghost'} onPress={handleSubmit}>
                    <Text color={isValid ? '#fff' : '#aaa'}>{t('submit')}</Text>
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
