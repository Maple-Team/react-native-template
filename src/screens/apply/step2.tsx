import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useMemo } from 'react'
import { View, SafeAreaView, StatusBar } from 'react-native'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { Input, DatePicker, RadioInput, PhonePicker } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import { ApplyStep2 } from '@/typings/apply'
import { useLoction } from '@/hooks/useLocation'

type FormModel = Omit<ApplyStep2, 'applyId' | 'currentStep' | 'totalSteps'>
export const Step2 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
  })
  const initialValue = useMemo<FormModel>(() => ({ salaryDate: '' }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values)
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  const location = useLoction()
  console.log(location)

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
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
                  />
                  <DatePicker
                    field="date"
                    label="date"
                    value=""
                    placeholder="placeholder"
                    error=""
                    onChange={handleChange('phone')}
                    title={'select date'}
                  />
                  <RadioInput
                    value={1}
                    onChange={handleChange('phone')}
                    field={'11'}
                    label={'11'}
                  />
                  <PhonePicker
                    onChange={function (text: string): void {
                      console.log(text)
                    }}
                    title={'1'}
                    field={'1'}
                    label={'1'}
                    placeholder={'1'}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : undefined}
                    handleSubmit={handleSubmit}
                    // loading={state}
                  >
                    <Text styles={{ color: '#fff' }}>{t('submit')}</Text>
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
