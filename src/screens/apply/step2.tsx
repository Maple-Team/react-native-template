import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useMemo, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { Input, DatePicker, RadioInput, NormalPicker } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep2Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks/useLocation'
import type { Shape } from '@/typings/common'
import { dict } from '@/services/apply'
import { Dict, DictField } from '@/typings/response'

type FormModel = Omit<ApplyStep2Parameter, keyof ApplyParameter>
export const Step2 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object<Shape<FormModel>>({
    incumbency: Yup.string().required(t('incumbency.required')),
    industryCode: Yup.string().required(t('incumbency.required')),
    company: Yup.string().required(t('incumbency.required')),
    companyAddrCityCode: Yup.string().required(t('incumbency.required')),
    companyAddrDetail: Yup.string().required(t('incumbency.required')),
    companyAddrProvinceCode: Yup.string().required(t('incumbency.required')),
    companyPhone: Yup.string().required(t('incumbency.required')),
    jobTypeCode: Yup.string().required(t('incumbency.required')),
    salaryDate: Yup.string().required(t('incumbency.required')),
    salaryType: Yup.string().required(t('incumbency.required')),
    monthlyIncome: Yup.string().required(t('incumbency.required')),
  })

  const [city, setCity] = useState<string>('')

  const initialValue = useMemo<FormModel>(
    () => ({
      industryCode: '',
      incumbency: '',
      company: '',
      companyAddrCityCode: city,
      companyAddrDetail: '',
      companyAddrProvinceCode: '',
      companyPhone: '',
      jobTypeCode: '',
      salaryDate: '',
      salaryType: '',
      monthlyIncome: '',
      industry: '',
      jobType: '',
      companyAddrCity: '',
      companyAddrProvince: '',
    }),
    [city]
  )
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values)
      navigation.navigate('Step3')
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  const location = useLoction()
  console.log(location)

  const [provinces, setProvinces] = useState<Dict[]>()
  const [incumbencys, setIncumbencys] = useState<Dict[]>()
  const [monthlyIncomes, setMonthlyIncomes] = useState<Dict[]>()

  useEffect(() => {
    ;(async () => {
      const dicts: DictField[] = ['INCUMBENCY', 'MONTHLY_INCOME', 'DISTRICT']
      const [d1, d2, d3] = await Promise.all(dicts.map(dict))
      setProvinces(d3)
      setIncumbencys(d1)
      setMonthlyIncomes(d2)
    })()
  }, [])

  const [province, setProvince] = useState<string>()

  useEffect(() => {
    const queryCity = () => {
      // response to province change
      setCity('')
      return dict('DISTRICT', {
        priviceID: province,
      })
    }
    queryCity()
  }, [province])

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
                    field="incumbency"
                    label={t('incumbency.label')}
                    onChangeText={handleChange('incumbency')}
                    value={values.incumbency}
                    onClear={() => setFieldValue('incumbency', '')}
                    placeholder={t('incumbency.placeholder')}
                    error={errors.incumbency}
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
                  <NormalPicker
                    onChange={text => {
                      setProvince(text)
                      setFieldValue('companyAddrProvinceCode', text)
                    }}
                    title={t('companyAddrProvinceCode.title')}
                    field={'companyAddrProvinceCode'}
                    label={t('companyAddrProvinceCode.label')}
                    placeholder={t('companyAddrProvinceCode.placeholder')}
                    dataSource={[]}
                  />
                  <NormalPicker
                    onChange={text => {
                      setCity(text)
                      setFieldValue('companyAddrCityCode', text)
                    }}
                    title={t('companyAddrProvinceCode.title')}
                    field={'companyAddrCityCode'}
                    label={t('companyAddrProvinceCode.label')}
                    placeholder={t('companyAddrProvinceCode.placeholder')}
                    dataSource={[]}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : 'ghost'}
                    handleSubmit={handleSubmit}
                    // loading={state}
                  >
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
