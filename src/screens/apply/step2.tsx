import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { RefObject, useContext, useEffect, useRef, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik, FormikErrors } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, TOTAL_STEPS, KEY_APPLYID } from '@/utils/constant'
import { Input, NormalPicker } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep2Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import type { Shape } from '@/typings/common'
import { fetchDict, submit } from '@/services/apply'
import type { Dict, DictField } from '@/typings/response'
import { default as MoneyyaContext } from '@/state'
import { MMKV } from '@/utils/storage'
import { filterArrayKey } from '@/utils/util'
import type { Behavior } from '@/utils'

export const Step2 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  // NOTE 顺序必需与下面的表单一致
  const schema = Yup.object<Shape<FormModel>>({
    industryCode: Yup.string().required(t('industryCode.required')),
    jobTypeCode: Yup.string().required(t('jobTypeCode.required')),
    monthlyIncome: Yup.string().required(t('monthlyIncome.required')),
    salaryType: Yup.string().required(t('salaryType.required')),
    salaryDate: Yup.string().when('salaryType', {
      is: 'MONTHLY' || 'WEEKLY',
      then: Yup.string().required(t('salaryDate.required')),
    }),
    company: Yup.string().max(100, t('company.invalid')).required(t('company.required')),
    companyPhone: Yup.string()
      .max(20, t('companyPhone.invalid'))
      .required(t('companyPhone.required')),
    companyAddrProvinceCode: Yup.string().required(t('companyAddrProvinceCode.required')),
    companyAddrCityCode: Yup.string().required(t('companyAddrCityCode.required')),
    companyAddrDetail: Yup.string()
      .max(200, t('companyAddrDetail.invalid'))
      .required(t('companyAddrDetail.required')),
    incumbency: Yup.string().required(t('incumbency.required')),
  })
  const initialValues: FormModel = {
    industryCode: '',
    industry: '',
    incumbency: '',
    company: '',
    companyAddrCity: '',
    companyAddrCityCode: '',
    companyAddrDetail: '',
    companyAddrProvince: '',
    companyAddrProvinceCode: '',
    companyPhone: '',
    jobTypeCode: '',
    jobType: '',
    salaryDate: '',
    salaryType: '',
    monthlyIncome: '',
  }

  const onSubmit = debounce(
    (values: FormModel) => {
      submit({
        ...(filterArrayKey(values) as FormModel),
        companyAddrCity: values.companyAddrCity,
        companyAddrProvince: values.companyAddrProvince,
        industry: values.industry,
        jobType: values.jobType,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 2,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        navigation.navigate('Step3')
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useLocation()

  const behavior = useBehavior<'P02'>('P02', 'P02_C00', 'P02_C99')
  const scrollViewRef = useRef<ScrollView>(null)
  const context = useContext(MoneyyaContext)
  console.log('context', context)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView
        style={PageStyles.scroll}
        // keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}>
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnBlur
            validateOnChange
            validationSchema={schema}>
            {({ handleSubmit, setFieldValue, errors, isValid, values }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    field="industryCode"
                    label={t('industryCode.label')}
                    onChange={record => {
                      setFieldValue('industryCode', record.code)
                      setFieldValue('industry', record.name)
                      behavior.setModify('P02_C01_S_INDUSTRYCODE', record.code, values.industryCode)
                    }}
                    value={values.industryCode}
                    placeholder={t('industryCode.placeholder')}
                    error={errors.industryCode}
                    scrollViewRef={scrollViewRef}
                    fieldStr="INDUSTRY"
                    title={t('industryCode.label')}
                    key="industryCode"
                  />
                  <NormalPicker
                    field="jobTypeCode"
                    key="jobTypeCode"
                    label={t('jobTypeCode.label')}
                    scrollViewRef={scrollViewRef}
                    onChange={record => {
                      setFieldValue('jobTypeCode', record.code)
                      setFieldValue('jobType', record.name)

                      behavior.setModify('P02_C02_S_JOBTYPECODE', record.code, values.jobTypeCode)
                    }}
                    value={values.jobTypeCode}
                    placeholder={t('jobTypeCode.placeholder')}
                    error={errors.jobTypeCode}
                    fieldStr="PROFESSION"
                    title={t('jobTypeCode.label')}
                  />
                  <NormalPicker
                    field="monthlyIncome"
                    key="monthlyIncome"
                    scrollViewRef={scrollViewRef}
                    label={t('monthlyIncome.label')}
                    onChange={record => {
                      setFieldValue('monthlyIncome', record.code)
                      behavior.setModify(
                        'P02_C03_S_MONTHLYINCOME',
                        record.code,
                        values.monthlyIncome
                      )
                    }}
                    value={values.monthlyIncome}
                    placeholder={t('monthlyIncome.placeholder')}
                    error={errors.monthlyIncome}
                    fieldStr="MONTHLY_INCOME"
                    title={t('monthlyIncome.label')}
                  />
                  <SalaryForm
                    scrollViewRef={scrollViewRef}
                    values={values}
                    setFieldValue={setFieldValue}
                    behavior={behavior}
                    errors={errors}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('company', text)
                    }}
                    onClear={() => {
                      setFieldValue('company', '')
                    }}
                    maxLength={100}
                    onFocus={() => {
                      behavior.setStartModify('P02_C01_I_COMPANY', values.company)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P02_C01_I_COMPANY', values.company)
                    }}
                    value={values.company}
                    field={'company'}
                    key={'company'}
                    label={t('company.label')}
                    error={errors.company}
                    placeholder={t('company.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('companyPhone', text)
                    }}
                    onClear={() => {
                      setFieldValue('companyPhone', '')
                    }}
                    maxLength={20}
                    onFocus={() => {
                      behavior.setStartModify('P02_C02_I_COMPANYPHONE', values.companyPhone)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P02_C02_I_COMPANYPHONE', values.companyPhone)
                    }}
                    value={values.companyPhone}
                    field={'companyPhone'}
                    key={'companyPhone'}
                    keyboardType="phone-pad"
                    error={errors.companyPhone}
                    label={t('companyPhone.label')}
                    placeholder={t('companyPhone.placeholder')}
                  />
                  <DistrictForm
                    scrollViewRef={scrollViewRef}
                    values={values}
                    setFieldValue={setFieldValue}
                    behavior={behavior}
                    errors={errors}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('companyAddrDetail', text)
                    }}
                    onClear={() => {
                      setFieldValue('companyAddrDetail', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify(
                        'P02_C03_I_COMPANYADDRDETAIL',
                        values.companyAddrDetail
                      )
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P02_C03_I_COMPANYADDRDETAIL', values.companyAddrDetail)
                    }}
                    value={values.companyAddrDetail}
                    field={'companyAddrDetail'}
                    key={'companyAddrDetail'}
                    label={t('companyAddrDetail.label')}
                    error={errors.companyAddrDetail}
                    maxLength={200}
                    placeholder={t('companyAddrDetail.placeholder')}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    field="incumbency"
                    key="incumbency"
                    label={t('incumbency.label')}
                    onChange={record => {
                      setFieldValue('incumbency', record.code)
                      behavior.setModify('P02_C08_S_INCUMBENCY', record.code, values.incumbency)
                    }}
                    value={values.incumbency}
                    placeholder={t('incumbency.placeholder')}
                    error={errors.incumbency}
                    fieldStr="INCUMBENCY"
                    title={t('incumbency.label')}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : 'ghost'}
                    onPress={handleSubmit}
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

type FormModel = Omit<ApplyStep2Parameter, keyof ApplyParameter>

const DistrictForm = ({
  scrollViewRef,
  values,
  setFieldValue,
  behavior,
  errors,
}: {
  scrollViewRef: RefObject<ScrollView>
  values: FormModel
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  behavior: Behavior<'P02'>
  errors: FormikErrors<FormModel>
}) => {
  const { t } = useTranslation()
  const [citys, setCitys] = useState<Dict[]>([])

  useEffect(() => {
    const queryCity = () => fetchDict(values.companyAddrProvinceCode as DictField)
    if (values.companyAddrProvinceCode) {
      queryCity().then(dicts => {
        setCitys(dicts)
      })
    }
  }, [values.companyAddrProvinceCode])

  return (
    <>
      <NormalPicker
        scrollViewRef={scrollViewRef}
        onChange={record => {
          setFieldValue('companyAddrProvinceCode', record.code)
          setFieldValue('companyAddrProvince', record.name)
          behavior.setModify('P02_C06_S_STATE', record.code, values.companyAddrProvinceCode)
        }}
        value={values.companyAddrProvinceCode}
        title={t('companyAddrProvinceCode.label')}
        field={'companyAddrProvinceCode'}
        key={'companyAddrProvinceCode'}
        label={t('companyAddrProvinceCode.label')}
        placeholder={t('companyAddrProvinceCode.placeholder')}
        fieldStr="DISTRICT"
        error={errors.companyAddrProvinceCode}
      />
      <NormalPicker
        scrollViewRef={scrollViewRef}
        onChange={record => {
          setFieldValue('companyAddrCityCode', record.code)
          setFieldValue('companyAddrCity', record.name)
          behavior.setModify('P02_C07_S_CITY', record.code, values.companyAddrCityCode)
        }}
        title={t('companyAddrCityCode.label')}
        field={'companyAddrCityCode'}
        key={'companyAddrCityCode'}
        value={values.companyAddrCityCode}
        label={t('companyAddrCityCode.label')}
        placeholder={t('companyAddrCityCode.placeholder')}
        dataSource={citys}
        error={errors.companyAddrCityCode}
      />
    </>
  )
}

const SalaryForm = ({
  scrollViewRef,
  values,
  setFieldValue,
  behavior,
  errors,
}: {
  scrollViewRef: RefObject<ScrollView>
  values: FormModel
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  behavior: Behavior<'P02'>
  errors: FormikErrors<FormModel>
}) => {
  const { t } = useTranslation()
  const [salaryType, setSalaryType] = useState<string | undefined>()
  const [salaryTypeArray, setSalaryTypeArray] = useState<Dict[]>([])
  useEffect(() => {
    if (salaryType && salaryType !== 'DAILY') {
      const query = (filed: 'MONTHLY' | 'WEEKLY') => fetchDict(filed)
      query(salaryType as 'MONTHLY' | 'WEEKLY').then(dicts => {
        setSalaryTypeArray(dicts)
      })
    }
  }, [salaryType])
  return (
    <>
      <NormalPicker
        field="salaryType"
        key="salaryType"
        scrollViewRef={scrollViewRef}
        label={t('salaryType.label')}
        onChange={record => {
          const code = record.code
          setFieldValue('salaryType', code)
          setSalaryType(code)
          behavior.setModify('P02_C04_S_SALARYTYPE', code, values.salaryType)
        }}
        value={values.salaryType}
        placeholder={t('salaryType.placeholder')}
        error={errors.salaryType}
        dataSource={[
          { name: 'DAILY', code: 'DAILY' },
          {
            name: 'WEEKLY',
            code: 'WEEKLY',
          },
          { name: 'MONTHLY', code: 'MONTHLY' },
        ]}
        title={t('salaryType.label')}
      />
      {salaryType !== 'DAILY' && (
        <NormalPicker
          scrollViewRef={scrollViewRef}
          field="salaryDate"
          key="salaryDate"
          label={t('salaryDate.label')}
          onChange={record => {
            setFieldValue('salaryDate', record.code)
            behavior.setModify('P02_C05_S_SALARYDATE', record.code, values.salaryDate)
          }}
          value={values.salaryDate}
          placeholder={t('salaryDate.placeholder')}
          error={errors.salaryDate}
          dataSource={salaryTypeArray}
          title={t('salaryDate.label')}
        />
      )}
    </>
  )
}
