import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useMemo, useState } from 'react'
import { View, SafeAreaView } from 'react-native'
import { Button } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import styles from './style'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { Input, PasswordInput, NormalPicker, ValidateCode } from '@components/form/FormItem'

interface FormModel {
  phone: string
  validateCode: string
  password: string
  confirmPassword: string
  confirmPassword2: string
}
export const SignupScreen = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
    password: Yup.string().required(t('password.required')),
    confirmPassword: Yup.string().required(t('password.required')),
    validateCode: Yup.string()
      .min(6, t('field.short', { field: 'Validate Code' }))
      .max(6, t('field.long', { field: 'Validate Code' }))
      .matches(REGEX_PHONE, t('validateCode.invalid'))
      .required(t('phone.required')),
  })
  const initialValue = useMemo<FormModel>(
    () => ({
      phone: '',
      password: '',
      confirmPassword: '',
      validateCode: '',
      confirmPassword2: '33',
    }),
    []
  )
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values)
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [showPwd, setShowPwd] = useState<boolean>(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState<boolean>(false)
  return (
    <SafeAreaView style={styles.sav}>
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Formik<FormModel>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
              <>
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
                  field="confirmPassword"
                  label={t('confirmPassword.label')}
                  onChangeText={handleChange('confirmPassword')}
                  value={values.confirmPassword}
                  onClear={() => setFieldValue('confirmPassword', '')}
                  placeholder={t('confirmPassword.placeholder')}
                  error={errors.confirmPassword}
                  showPwd={showConfirmPwd}
                  onToggle={() => setShowConfirmPwd(!showConfirmPwd)}
                />
                <NormalPicker
                  field="confirmPassword2"
                  label={t('confirmPassword.label') + '2'}
                  onChange={handleChange('confirmPassword2')}
                  value={values.confirmPassword2}
                  placeholder={t('confirmPassword.placeholder')}
                  error={errors.confirmPassword2}
                  title={'confirmPassword2'}
                  dataSource={[]}
                />
                <View>
                  <Button
                    type={isValid ? 'primary' : undefined}
                    // @ts-ignore
                    onPress={handleSubmit}>
                    {t('submit')}
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
