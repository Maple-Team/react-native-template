import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useEffect, useReducer, useRef } from 'react'
import type { Reducer } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { object, string } from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, TOTAL_STEPS, KEY_APPLYID } from '@/utils/constant'
import { Input, NormalPicker } from '@components/form'
import { ApplyButton } from '@components/form/applyButton'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep2Parameter } from '@/typings/apply'
import { useBehavior, useCustomBack, useLocation } from '@/hooks'
import type { Shape } from '@/typings/common'
import { fetchDict, submit } from '@/services/apply'
import type { Dict, DictField } from '@/typings/response'
import { MMKV } from '@/utils/storage'
import { filterArrayKey } from '@/utils/util'
import analytics from '@react-native-firebase/analytics'
import { AppEventsLogger } from 'react-native-fbsdk-next'

export const Step2 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  useCustomBack(() => {
    //@ts-ignore
    navigation.navigate('BottomTab')
  })
  const schema = object<Shape<FormModel>>({
    industryCode: string().required(t('industryCode.required')),
    jobTypeCode: string().required(t('jobTypeCode.required')),
    monthlyIncome: string().required(t('monthlyIncome.required')),
    salaryType: string().required(t('salaryType.required')),
    salaryDate: string().when('salaryType', {
      is: 'MONTHLY' || 'WEEKLY',
      then: string().required(t('salaryDate.required')),
    }),
    company: string().max(100, t('company.invalid')).required(t('company.required')),
    companyPhone: string().max(20, t('companyPhone.invalid')).required(t('companyPhone.required')),
    companyAddrProvinceCode: string().required(t('companyAddrProvinceCode.required')),
    companyAddrCityCode: string().required(t('companyAddrCityCode.required')),
    companyAddrDetail: string()
      .max(200, t('companyAddrDetail.invalid'))
      .required(t('companyAddrDetail.required')),
    incumbency: string().required(t('incumbency.required')),
  })
  const step2Data = (MMKV.getMap('step2Data') as Partial<Step2State>) || {}
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
      industryCode: step2Data.industryCode || '',
      industry: step2Data.industry || '',
      incumbency: step2Data.incumbency || '',
      company: step2Data.company || '',
      companyAddrCity: step2Data.companyAddrCity || '',
      companyAddrCityCode: step2Data.companyAddrCityCode || '',
      companyAddrDetail: step2Data.companyAddrDetail || '',
      companyAddrProvince: step2Data.companyAddrProvince || '',
      companyAddrProvinceCode: step2Data.companyAddrProvinceCode || '',
      companyPhone: step2Data.companyPhone || '',
      jobTypeCode: step2Data.jobTypeCode || '',
      jobType: step2Data.jobType || '',
      salaryDate: step2Data.salaryDate || '',
      salaryType: step2Data.salaryType || '',
      monthlyIncome: step2Data.monthlyIncome || '',
    }
  )
  const onSubmit = debounce(
    (values: FormModel) => {
      const data = {
        ...(filterArrayKey(values) as FormModel),
        companyAddrCity: state.companyAddrCity,
        companyAddrProvince: state.companyAddrProvince,
        industry: state.industry,
        jobType: state.jobType,
      }
      submit<'2'>({
        ...data,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 2,
        totalSteps: TOTAL_STEPS,
      }).then(async () => {
        await analytics().logEvent('steps_jobauth')
        AppEventsLogger.logEvent('steps_jobauth')
        MMKV.setMapAsync('step2Data', data)
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
          .catch(console.error)
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
            validationSchema={schema}>
            {({ handleSubmit, setFieldValue, errors, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    field="industryCode"
                    label={t('industryCode.label')}
                    onChange={({ code, name }) => {
                      setFieldValue('industryCode', code)
                      dispatch({ type: 'updateIndustry', value: { code, name } })
                      behavior.setModify('P02_C01_S_INDUSTRYCODE', code, state.industryCode)
                    }}
                    value={state.industryCode}
                    placeholder={t('industryCode.label')}
                    error={errors.industryCode}
                    scrollViewRef={scrollViewRef}
                    dataSource={state.industryArray}
                    title={t('industryCode.label')}
                    key="industryCode"
                  />
                  <NormalPicker
                    field="jobTypeCode"
                    key="jobTypeCode"
                    label={t('jobTypeCode.label')}
                    scrollViewRef={scrollViewRef}
                    onChange={({ code, name }) => {
                      setFieldValue('jobTypeCode', code)
                      dispatch({ type: 'jobType', value: { code, name } })
                      behavior.setModify('P02_C02_S_JOBTYPECODE', code, state.jobTypeCode)
                    }}
                    value={state.jobTypeCode}
                    placeholder={t('jobTypeCode.label')}
                    error={errors.jobTypeCode}
                    dataSource={state.jobTypeArray}
                    title={t('jobTypeCode.label')}
                  />
                  <NormalPicker
                    field="monthlyIncome"
                    key="monthlyIncome"
                    scrollViewRef={scrollViewRef}
                    label={t('monthlyIncome.label')}
                    onChange={({ code }) => {
                      setFieldValue('monthlyIncome', code)
                      dispatch({ type: 'updateMonthlyIncome', value: code })
                      behavior.setModify('P02_C03_S_MONTHLYINCOME', code, state.monthlyIncome)
                    }}
                    value={state.monthlyIncome}
                    placeholder={t('monthlyIncome.label')}
                    error={errors.monthlyIncome}
                    dataSource={state.monthlyIncomeArray}
                    title={t('monthlyIncome.label')}
                  />
                  <NormalPicker
                    field="salaryType"
                    key="salaryType"
                    scrollViewRef={scrollViewRef}
                    label={t('salaryType.label')}
                    onChange={({ code }) => {
                      setFieldValue('salaryType', code)
                      dispatch({ type: 'updateSalaryType', value: code })
                      behavior.setModify('P02_C04_S_SALARYTYPE', code, state.salaryType)
                    }}
                    value={state.salaryType}
                    placeholder={t('salaryType.label')}
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
                      key="salaryDate"
                      label={t('salaryDate.label')}
                      onChange={({ code }) => {
                        setFieldValue('salaryDate', code)
                        dispatch({ type: 'updateSalaryDate', value: code })
                        behavior.setModify('P02_C05_S_SALARYDATE', code, state.salaryDate)
                      }}
                      value={state.salaryDate}
                      placeholder={t('salaryDate.label')}
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
                    onClear={() => setFieldValue('company', '')}
                    maxLength={100}
                    onFocus={() => behavior.setStartModify('P02_C01_I_COMPANY', state.company)}
                    onBlur={() => behavior.setEndModify('P02_C01_I_COMPANY', state.company)}
                    value={state.company}
                    field={'company'}
                    key={'company'}
                    label={t('company.label')}
                    error={errors.company}
                    placeholder={t('company.label')}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('companyPhone', text)
                      dispatch({ type: 'companyPhone', value: text })
                    }}
                    onClear={() => setFieldValue('companyPhone', '')}
                    maxLength={20}
                    onFocus={() =>
                      behavior.setStartModify('P02_C02_I_COMPANYPHONE', state.companyPhone)
                    }
                    onBlur={() =>
                      behavior.setEndModify('P02_C02_I_COMPANYPHONE', state.companyPhone)
                    }
                    value={state.companyPhone}
                    field={'companyPhone'}
                    key={'companyPhone'}
                    keyboardType="phone-pad"
                    error={errors.companyPhone}
                    label={t('companyPhone.label')}
                    placeholder={t('companyPhone.label')}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    onChange={({ code, name }) => {
                      setFieldValue('companyAddrProvinceCode', code)
                      dispatch({ type: 'updateProvince', value: { code, name } })
                      dispatch({ type: 'updateCity', value: { code: '', name: '' } })
                      behavior.setModify('P02_C06_S_STATE', code, state.companyAddrProvinceCode)
                    }}
                    value={state.companyAddrProvinceCode}
                    title={t('address.province')}
                    field={'companyAddrProvinceCode'}
                    key={'companyAddrProvinceCode'}
                    label={t('companyAddrProvinceCode.label')}
                    placeholder={t('companyAddrProvinceCode.label')}
                    dataSource={state.provinceArray}
                    error={errors.companyAddrProvinceCode}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    onChange={({ code, name }) => {
                      setFieldValue('companyAddrCityCode', code)
                      dispatch({ type: 'updateCity', value: { code, name } })
                      behavior.setModify('P02_C07_S_CITY', code, state.companyAddrCityCode)
                    }}
                    title={t('address.city')}
                    field={'companyAddrCityCode'}
                    key={'companyAddrCityCode'}
                    value={state.companyAddrCityCode}
                    label={t('companyAddrCityCode.label')}
                    placeholder={t('companyAddrCityCode.label')}
                    dataSource={state.cityArray}
                    error={errors.companyAddrCityCode}
                  />
                  <Input
                    scrollViewRef={scrollViewRef}
                    onChangeText={text => {
                      setFieldValue('companyAddrDetail', text)
                      dispatch({ type: 'companyAddrDetail', value: text })
                    }}
                    onClear={() => setFieldValue('companyAddrDetail', '')}
                    onFocus={() =>
                      behavior.setStartModify(
                        'P02_C03_I_COMPANYADDRDETAIL',
                        state.companyAddrDetail
                      )
                    }
                    onBlur={() =>
                      behavior.setEndModify('P02_C03_I_COMPANYADDRDETAIL', state.companyAddrDetail)
                    }
                    value={state.companyAddrDetail}
                    field={'companyAddrDetail'}
                    key={'companyAddrDetail'}
                    label={t('companyAddrDetail.label')}
                    error={errors.companyAddrDetail}
                    maxLength={200}
                    placeholder={t('companyAddrDetail.label')}
                  />
                  <NormalPicker
                    scrollViewRef={scrollViewRef}
                    field="incumbency"
                    key="incumbency"
                    label={t('incumbency.label')}
                    onChange={({ code }) => {
                      setFieldValue('incumbency', code)
                      dispatch({ type: 'updateIncumbency', value: code })
                      behavior.setModify('P02_C08_S_INCUMBENCY', code, state.incumbency)
                    }}
                    value={state.incumbency}
                    placeholder={t('incumbency.label')}
                    error={errors.incumbency}
                    dataSource={state.incumbencyArray}
                    title={t('incumbency.label')}
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
      value: Pick<Dict, 'code' | 'name'>
    }
  | {
      type: 'updateCities'
      value: Dict[]
    }
  | {
      type: 'updateCity'
      value: Pick<Dict, 'code' | 'name'>
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
      value: Pick<Dict, 'code' | 'name'>
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
      value: Pick<Dict, 'code' | 'name'>
    }
