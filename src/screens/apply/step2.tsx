import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useReducer, useRef } from 'react'
import type { Reducer } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
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
import { MoneyyaContext } from '@/state'
import { MMKV } from '@/utils/storage'
import { filterArrayKey } from '@/utils'

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
    company: Yup.string().required(t('company.required')),
    companyPhone: Yup.string().required(t('companyPhone.required')),
    companyAddrProvinceCode: Yup.string().required(t('companyAddrProvinceCode.required')),
    companyAddrCityCode: Yup.string().required(t('companyAddrCityCode.required')),
    companyAddrDetail: Yup.string().required(t('companyAddrDetail.required')),
    incumbency: Yup.string().required(t('incumbency.required')),
  })

  const context = useContext(MoneyyaContext)
  const [state, dispatch] = useReducer<Reducer<Step2State, Step2Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'updateProvinces':
          return { ...s, provinceArray: value }
        case 'updateProvince':
          return { ...s, companyAddrProvinceCode: value.code, companyAddrProvince: value.name }
        case 'updateCities':
          return { ...s, cityArray: value }
        case 'updateCity':
          return { ...s, companyAddrCityCode: value.code, companyAddrCity: value.name }
        case 'updateIncumbencies':
          return { ...s, incumbencyArray: value }
        case 'updateIncumbency':
          return { ...s, incumbency: value }
        case 'updateMonthlyIncomes':
          return { ...s, monthlyIncomeArray: value }
        case 'updateMonthlyIncome':
          return { ...s, monthlyIncome: value }
        case 'salaryTypeArray':
          return { ...s, salaryDateArray: value }
        case 'updateSalaryType':
          return { ...s, salaryType: value }
        case 'updateSalaryDate':
          return { ...s, salaryDate: value }
        case 'updateIndustries':
          return { ...s, industryArray: value }
        case 'updateIndustry':
          return { ...s, industryCode: value.code, industry: value.name }
        case 'company':
          return { ...s, company: value }
        case 'companyPhone':
          return { ...s, companyPhone: value }
        case 'companyAddrDetail':
          return { ...s, companyAddrDetail: value }
        case 'jobType':
          return { ...s, jobType: value.name, jobTypeCode: value.code }
        case 'jobTypeArr':
          return { ...s, jobTypeArray: value }
        default:
          return { ...s }
      }
    },
    {
      provinceArray: [],
      cityArray: [],
      incumbencyArray: [],
      monthlyIncomeArray: [],
      jobTypeArray: [],
      industryArray: [],
      salaryDateArray: [],
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
  )
  const onSubmit = debounce(
    (values: FormModel) => {
      submit({
        ...(filterArrayKey(values) as FormModel),
        companyAddrCity: state.companyAddrCity,
        companyAddrProvince: state.companyAddrProvince,
        industry: state.industry,
        jobType: state.jobType,
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

  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = [
        'INCUMBENCY',
        'MONTHLY_INCOME',
        'DISTRICT',
        'INDUSTRY',
        'PROFESSION',
      ]
      dicts.forEach(field =>
        fetchDict(field)
          .then(value => {
            switch (field) {
              case 'INCUMBENCY':
                dispatch({ type: 'updateIncumbencies', value })
                break
              case 'MONTHLY_INCOME':
                dispatch({ type: 'updateMonthlyIncomes', value })
                break
              case 'DISTRICT':
                dispatch({ type: 'updateProvinces', value })
                break
              case 'INDUSTRY':
                dispatch({ type: 'updateIndustries', value })
                break
              case 'PROFESSION':
                dispatch({ type: 'jobTypeArr', value })
                break
              default:
                break
            }
          })
          .catch(console.log)
      )
    }
    queryDict()
  }, [])

  useEffect(() => {
    const queryCity = () => fetchDict(state.companyAddrProvinceCode as DictField)

    queryCity().then(values => {
      dispatch({ type: 'updateCities', value: values })
    })
  }, [state.companyAddrProvinceCode])

  useEffect(() => {
    if (state.salaryType !== 'DAILY') {
      const query = (filed: 'MONTHLY' | 'WEEKLY') => fetchDict(filed)
      query(state.salaryType as 'MONTHLY' | 'WEEKLY').then(values => {
        dispatch({ type: 'salaryTypeArray', value: values })
      })
    }
  }, [state.salaryType])

  const behavior = useBehavior<'P02'>('P02', 'P02_C00', 'P02_C99')
  const scrollViewRef = useRef<ScrollView>(null)

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
            initialValues={state}
            onSubmit={onSubmit}
            validateOnBlur
            validateOnChange
            validationSchema={schema}>
            {({ handleSubmit, setFieldValue, errors, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    field="industryCode"
                    label={t('industryCode.label')}
                    onChange={record => {
                      setFieldValue('industryCode', record.code)
                      dispatch({ type: 'updateIndustry', value: record })
                      behavior.setModify('P02_C01_S_INDUSTRYCODE', record.code, state.industryCode)
                    }}
                    value={state.industryCode}
                    placeholder={t('industryCode.placeholder')}
                    error={errors.industryCode}
                    scrollViewRef={scrollViewRef}
                    dataSource={state.industryArray}
                    title={t('industryCode.label')}
                  />
                  <NormalPicker
                    field="jobTypeCode"
                    label={t('jobTypeCode.label')}
                    scrollViewRef={scrollViewRef}
                    onChange={record => {
                      setFieldValue('jobTypeCode', record.code)
                      dispatch({ type: 'jobType', value: record })
                      behavior.setModify('P02_C02_S_JOBTYPECODE', record.code, state.jobTypeCode)
                    }}
                    value={state.jobTypeCode}
                    placeholder={t('jobTypeCode.placeholder')}
                    error={errors.jobTypeCode}
                    dataSource={state.jobTypeArray}
                    title={t('jobTypeCode.label')}
                  />
                  <NormalPicker
                    field="monthlyIncome"
                    scrollViewRef={scrollViewRef}
                    label={t('monthlyIncome.label')}
                    onChange={record => {
                      setFieldValue('monthlyIncome', record.code)
                      dispatch({ type: 'updateMonthlyIncome', value: record.code })
                      behavior.setModify(
                        'P02_C03_S_MONTHLYINCOME',
                        record.code,
                        state.monthlyIncome
                      )
                    }}
                    value={state.monthlyIncome}
                    placeholder={t('monthlyIncome.placeholder')}
                    error={errors.monthlyIncome}
                    dataSource={state.monthlyIncomeArray}
                    title={t('monthlyIncome.label')}
                  />
                  <NormalPicker
                    field="salaryType"
                    scrollViewRef={scrollViewRef}
                    label={t('salaryType.label')}
                    onChange={record => {
                      setFieldValue('salaryType', record.code)
                      dispatch({ type: 'updateSalaryType', value: record.code })
                      behavior.setModify('P02_C04_S_SALARYTYPE', record.code, state.salaryType)
                    }}
                    value={state.salaryType}
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
                  {state.salaryType !== 'DAILY' && (
                    <NormalPicker
                      scrollViewRef={scrollViewRef}
                      field="salaryDate"
                      label={t('salaryDate.label')}
                      onChange={record => {
                        setFieldValue('salaryDate', record.code)
                        dispatch({ type: 'updateSalaryDate', value: record.code })
                        behavior.setModify('P02_C05_S_SALARYDATE', record.code, state.salaryDate)
                      }}
                      value={state.salaryDate}
                      placeholder={t('salaryDate.placeholder')}
                      error={errors.salaryDate}
                      dataSource={state.salaryDateArray}
                      title={t('salaryDate.label')}
                    />
                  )}
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('company', text)
                      dispatch({ type: 'company', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('company', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P02_C01_I_COMPANY', state.company)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P02_C01_I_COMPANY', state.company)
                    }}
                    value={state.company}
                    field={'company'}
                    label={t('company.label')}
                    error={errors.company}
                    placeholder={t('company.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('companyPhone', text)
                      dispatch({ type: 'companyPhone', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('companyPhone', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P02_C02_I_COMPANYPHONE', state.companyPhone)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P02_C02_I_COMPANYPHONE', state.companyPhone)
                    }}
                    value={state.companyPhone}
                    field={'companyPhone'}
                    error={errors.companyPhone}
                    label={t('companyPhone.label')}
                    placeholder={t('companyPhone.placeholder')}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    onChange={record => {
                      setFieldValue('companyAddrProvinceCode', record.code)
                      dispatch({ type: 'updateProvince', value: record })
                      dispatch({ type: 'updateCity', value: { code: '', name: '' } })
                      behavior.setModify(
                        'P02_C06_S_STATE',
                        record.code,
                        state.companyAddrProvinceCode
                      )
                    }}
                    value={state.companyAddrProvinceCode}
                    title={t('companyAddrProvinceCode.label')}
                    field={'companyAddrProvinceCode'}
                    label={t('companyAddrProvinceCode.label')}
                    placeholder={t('companyAddrProvinceCode.placeholder')}
                    dataSource={state.provinceArray}
                    error={errors.companyAddrProvinceCode}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    onChange={record => {
                      setFieldValue('companyAddrCityCode', record.code)
                      dispatch({ type: 'updateCity', value: record })
                      behavior.setModify('P02_C07_S_CITY', record.code, state.companyAddrCityCode)
                    }}
                    title={t('companyAddrCityCode.label')}
                    field={'companyAddrCityCode'}
                    value={state.companyAddrCityCode}
                    label={t('companyAddrCityCode.label')}
                    placeholder={t('companyAddrCityCode.placeholder')}
                    dataSource={state.cityArray}
                    error={errors.companyAddrCityCode}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('companyAddrDetail', text)
                      dispatch({ type: 'companyAddrDetail', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('companyAddrDetail', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify(
                        'P02_C03_I_COMPANYADDRDETAIL',
                        state.companyAddrDetail
                      )
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P02_C03_I_COMPANYADDRDETAIL', state.companyAddrDetail)
                    }}
                    value={state.companyAddrDetail}
                    field={'companyAddrDetail'}
                    label={t('companyAddrDetail.label')}
                    error={errors.companyAddrDetail}
                    placeholder={t('companyAddrDetail.placeholder')}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    field="incumbency"
                    label={t('incumbency.label')}
                    onChange={record => {
                      setFieldValue('incumbency', record.code)
                      dispatch({ type: 'updateIncumbency', value: record.code })
                      behavior.setModify('P02_C08_S_INCUMBENCY', record.code, state.incumbency)
                    }}
                    value={state.incumbency}
                    placeholder={t('incumbency.placeholder')}
                    error={errors.incumbency}
                    dataSource={state.incumbencyArray}
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
interface Step2State extends FormModel {
  provinceArray: Dict[]
  cityArray: Dict[]
  incumbencyArray: Dict[]
  monthlyIncomeArray: Dict[]
  industryArray: Dict[]
  jobTypeArray: Dict[]
  salaryDateArray: Dict[]
}
type Step2Action =
  | {
      type: 'updateProvinces'
      value: Dict[]
    }
  | {
      type: 'updateProvince'
      value: Dict
    }
  | {
      type: 'updateCities'
      value: Dict[]
    }
  | {
      type: 'updateCity'
      value: Dict
    }
  | {
      type: 'updateSalaryType'
      value: string
    }
  | {
      type: 'updateMonthlyIncomes'
      value: Dict[]
    }
  | {
      type: 'updateMonthlyIncome'
      value: string
    }
  | {
      type: 'updateIncumbencies'
      value: Dict[]
    }
  | {
      type: 'updateIncumbency'
      value: string
    }
  | {
      type: 'salaryTypeArray'
      value: Dict[]
    }
  | {
      type: 'updateSalaryDate'
      value: string
    }
  | {
      type: 'updateIndustries'
      value: Dict[]
    }
  | {
      type: 'updateIndustry'
      value: Dict
    }
  | {
      type: 'company'
      value: string
    }
  | {
      type: 'companyPhone'
      value: string
    }
  | {
      type: 'companyAddrDetail'
      value: string
    }
  | {
      type: 'jobTypeArr'
      value: Dict[]
    }
  | {
      type: 'jobType'
      value: Dict
    }
