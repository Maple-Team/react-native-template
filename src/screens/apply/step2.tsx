import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { Input, NormalPicker } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep2Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks/useLocation'
import type { Shape } from '@/typings/common'
import { dict } from '@/services/apply'
import { Dict, DictField } from '@/typings/response'
import { MoneyyaContext } from '@/state'

type FormModel = Omit<ApplyStep2Parameter, keyof ApplyParameter>
export const Step2 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object<Shape<FormModel>>({
    incumbency: Yup.string().required(t('incumbency.required')),
    industryCode: Yup.string().required(t('industryCode.required')),
    company: Yup.string().required(t('company.required')),
    companyAddrCityCode: Yup.string().required(t('companyAddrCityCode.required')),
    companyAddrDetail: Yup.string().required(t('companyAddrDetail.required')),
    companyAddrProvinceCode: Yup.string().required(t('companyAddrProvinceCode.required')),
    companyPhone: Yup.string().required(t('companyPhone.required')),
    jobTypeCode: Yup.string().required(t('jobTypeCode.required')),
    salaryDate: Yup.string().required(t('salaryDate.required')),
    salaryType: Yup.string().required(t('salaryType.required')),
    monthlyIncome: Yup.string().required(t('monthlyIncome.required')),
  })
  const context = useContext(MoneyyaContext)
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

  useLoction()

  const [provinces, setProvinces] = useState<Dict[]>([])
  const [citys, setCitys] = useState<Dict[]>([])
  const [incumbencys, setIncumbencys] = useState<Dict[]>([])
  const [monthlyIncomes, setMonthlyIncomes] = useState<Dict[]>([])
  const [industrys, setIndustrys] = useState<Dict[]>([])
  const [jobTypes, setJobTypes] = useState<Dict[]>([])

  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = [
        'INCUMBENCY',
        'MONTHLY_INCOME',
        'DISTRICT',
        'INDUSTRY',
        'PROFESSION',
      ]
      const [d1, d2, d3, d4, d5] = await Promise.all(dicts.map(dict))
      setProvinces(d3)
      setIncumbencys(d1)
      setMonthlyIncomes(d2)
      setIndustrys(d4)
      setJobTypes(d5)
    }
    queryDict()
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
    queryCity().then(res => {
      setCitys(res)
    })
  }, [province])
  const [salaryType, setSalaryType] = useState<string>()
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
                  <NormalPicker
                    field="industryCode"
                    label={t('industryCode.label')}
                    onChange={handleChange('industryCode')}
                    value={values.industryCode}
                    placeholder={t('industryCode.placeholder')}
                    error={errors.industryCode}
                    dataSource={industrys}
                    title={t('industryCode.label')}
                  />
                  <NormalPicker
                    field="jobTypeCode"
                    label={t('jobTypeCode.label')}
                    onChange={handleChange('jobTypeCode')}
                    value={values.jobTypeCode}
                    placeholder={t('jobTypeCode.placeholder')}
                    error={errors.jobTypeCode}
                    dataSource={jobTypes}
                    title={t('jobTypeCode.label')}
                  />
                  <NormalPicker
                    field="monthlyIncome"
                    label={t('monthlyIncome.label')}
                    onChange={handleChange('monthlyIncome')}
                    value={values.monthlyIncome}
                    placeholder={t('monthlyIncome.placeholder')}
                    error={errors.monthlyIncome}
                    dataSource={monthlyIncomes}
                    title={t('monthlyIncome.label')}
                  />
                  <NormalPicker
                    field="salaryType"
                    label={t('salaryType.label')}
                    onChange={text => {
                      console.log(text)
                      handleChange('salaryType')
                      setSalaryType(text)
                    }}
                    value={values.salaryType}
                    placeholder={t('salaryType.placeholder')}
                    error={errors.salaryType}
                    dataSource={[
                      { name: 'Monthy', code: 'MONTHLY' },
                      {
                        name: 'Weekly',
                        code: 'WEEKLY',
                      },
                    ]}
                    title={t('salaryType.label')}
                  />
                  <Input
                    onChangeText={text => {
                      console.log(text)
                    }}
                    onClear={() => {
                      setFieldValue('company', '')
                    }}
                    value={'company'}
                    field={'company'}
                    label={t('company.label')}
                    placeholder={t('company.placeholder')}
                  />
                  <Input
                    onChangeText={text => {
                      console.log(text)
                    }}
                    onClear={() => {
                      setFieldValue('companyPhone', '')
                    }}
                    value={values.companyPhone}
                    field={'companyPhone'}
                    label={t('companyPhone.label')}
                    placeholder={t('companyPhone.placeholder')}
                  />
                  <NormalPicker
                    onChange={text => {
                      setProvince(text)
                      console.log(text)
                      setFieldValue('companyAddrProvinceCode', text)
                    }}
                    title={t('companyAddrProvinceCode.label')}
                    field={'companyAddrProvinceCode'}
                    label={t('companyAddrProvinceCode.label')}
                    placeholder={t('companyAddrProvinceCode.placeholder')}
                    dataSource={provinces}
                    error={errors.companyAddrProvinceCode}
                  />
                  <NormalPicker
                    onChange={text => {
                      setCity(text)
                      setFieldValue('companyAddrCityCode', text)
                    }}
                    title={t('companyAddrCityCode.label')}
                    field={'companyAddrCityCode'}
                    label={t('companyAddrCityCode.label')}
                    placeholder={t('companyAddrCityCode.placeholder')}
                    dataSource={citys}
                    error={errors.companyAddrCityCode}
                  />
                  <Input
                    onChangeText={text => {
                      console.log(text)
                    }}
                    onClear={() => {
                      setFieldValue('companyAddrDetail', '')
                    }}
                    value={values.companyAddrDetail}
                    field={'companyAddrDetail'}
                    label={t('companyAddrDetail.label')}
                    placeholder={t('companyAddrDetail.placeholder')}
                  />
                  <NormalPicker
                    field="incumbency"
                    label={t('incumbency.label')}
                    onChange={handleChange('incumbency')}
                    value={values.incumbency}
                    placeholder={t('incumbency.placeholder')}
                    error={errors.incumbency}
                    dataSource={incumbencys}
                    title={t('incumbency.label')}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : 'ghost'}
                    handleSubmit={handleSubmit}
                    loading={context.loading.effects.apply}>
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
