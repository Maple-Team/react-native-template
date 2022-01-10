import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import type { Reducer } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'
import { useFocusEffect } from '@react-navigation/native'

import { PageStyles, Text } from '@/components'
import { KEY_BEHAVIOR_DATA, DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { Input, NormalPicker } from '@components/form/FormItem'
import { ApplyButton } from '@components/form/FormItem/applyButton'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep2Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks'
import type { Shape } from '@/typings/common'
import { dict } from '@/services/apply'
import type { Dict, DictField } from '@/typings/response'
import { MoneyyaContext } from '@/state'
import Behavior from '@/utils/behavior'
import type { BehaviorModel } from '@/typings/behavior'
import { useWindowSize } from 'usehooks-ts'
import { MMKV } from '@/utils/storage'

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

  const [state, dispatch] = useReducer<Reducer<Step2State, Step2Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'updateProvinces':
          return { ...s, provinceArr: value }
        case 'updateProvince':
          return { ...s, province: value }
        case 'updateCities':
          return { ...s, cityArr: value }
        case 'updateCity':
          return { ...s, city: value }
        case 'updateIncumbencies':
          return { ...s, incumbencyArr: value }
        case 'updateIncumbency':
          return { ...s, incumbency: value }
        case 'updateMonthlyIncomes':
          return { ...s, monthlyIncomeArr: value }
        case 'updateMonthlyIncome':
          return { ...s, monthlyIncome: value }
        case 'updateMonthly':
          return { ...s, monthly: value }
        case 'updateWeekly':
          return { ...s, weekly: value }
        case 'updateSalaryType':
          return { ...s, salaryType: value }
        case 'updateProfessions':
          return { ...s, jobTypeArr: value }
        case 'updateProfession':
          return { ...s, jobTypeCode: value }
        case 'updateIndustries':
          return { ...s, industryArr: value }
        case 'updateIndustry':
          return { ...s, industryCode: value }
        default:
          return { ...s }
      }
    },
    {
      provinceArr: [],
      cityArr: [],
      incumbencyArr: [],
      monthlyIncomeArr: [],
      jobTypeArr: [],
      industryArr: [],
      monthly: [],
      weekly: [],
      industryCode: '',
      incumbency: '',
      company: '',
      companyAddrCityCode: '',
      companyAddrDetail: '',
      companyAddrProvinceCode: '',
      companyPhone: '',
      jobTypeCode: '',
      salaryDate: '',
      salaryType: '',
      monthlyIncome: '',
    }
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
        dict(field)
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
                dispatch({ type: 'updateProfessions', value })
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
    const queryCity = () => {
      return dict('DISTRICT', {
        priviceID: state.companyAddrProvinceCode,
      })
    }
    queryCity().then(values => {
      dispatch({ type: 'updateCities', value: values })
    })
  }, [state.companyAddrProvinceCode])

  useEffect(() => {
    const query = (filed: 'MONTHLY' | 'WEEKLY') => dict(filed)
    const field = state.salaryType === 'Monthly' ? 'MONTHLY' : 'WEEKLY'
    query(field).then(values => {
      const type = state.salaryType === 'Monthly' ? 'updateMonthly' : 'updateWeekly'
      dispatch({ type, value: values })
    })
  }, [state.salaryType])

  const windowSize = useWindowSize()
  const behavior = useMemo(() => {
    const initModel: BehaviorModel<'P02'> = {
      screenHeight: `${windowSize.height}`,
      screenWidth: `${windowSize.width}`,
      applyId: `${context.user?.applyId}`,
      outerIp: '',
      internalIp: '',
      records: MMKV.getArray(KEY_BEHAVIOR_DATA) || [],
    }
    return new Behavior<'P02'>(initModel)
  }, [context.user?.applyId, windowSize])

  useFocusEffect(
    useCallback(() => {
      behavior.setEnterPageTime('P02_C00')
      return () => {
        behavior.setLeavePageTime('P02_C99')
      }
    }, [behavior])
  )

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={state}
            onSubmit={onSubmit}
            validateOnBlur
            validateOnChange
            validationSchema={schema}>
            {({ handleChange, handleSubmit, values, setFieldValue, errors, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    field="industryCode"
                    label={t('industryCode.label')}
                    onChange={text => {
                      // handleChange('industryCode')
                      setFieldValue('industryCode', text)
                      behavior.setModify('P02_C01_S_INDUSTRYCODE', state.industryCode, text)
                    }}
                    value={values.industryCode}
                    placeholder={t('industryCode.placeholder')}
                    error={errors.industryCode}
                    dataSource={state.industryArr}
                    title={t('industryCode.label')}
                  />
                  <NormalPicker
                    field="jobTypeCode"
                    label={t('jobTypeCode.label')}
                    onChange={text => {
                      // handleChange('jobTypeCode')
                      setFieldValue('jobTypeCode', text)
                      behavior.setModify('P02_C0x_S_jobTypeCode', state.jobTypeCode, text)
                    }}
                    value={values.jobTypeCode}
                    placeholder={t('jobTypeCode.placeholder')}
                    error={errors.jobTypeCode}
                    dataSource={state.jobTypeArr}
                    title={t('jobTypeCode.label')}
                  />
                  <NormalPicker
                    field="monthlyIncome"
                    label={t('monthlyIncome.label')}
                    onChange={text => {
                      // handleChange('monthlyIncome')
                      setFieldValue('monthlyIncome', text)
                      behavior.setModify('P02_C0x_S_MONTHLYINCOME', state.monthlyIncome, text)
                    }}
                    value={values.monthlyIncome}
                    placeholder={t('monthlyIncome.placeholder')}
                    error={errors.monthlyIncome}
                    dataSource={state.monthlyIncomeArr}
                    title={t('monthlyIncome.label')}
                  />
                  <NormalPicker
                    field="salaryType"
                    label={t('salaryType.label')}
                    onChange={text => {
                      console.log(text)
                      setFieldValue('salaryType', text)
                      dispatch({ type: 'updateSalaryType', value: text })
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
                    onChangeText={handleChange('company')}
                    onClear={() => {
                      setFieldValue('company', '')
                    }}
                    value={'company'}
                    field={'company'}
                    label={t('company.label')}
                    placeholder={t('company.placeholder')}
                  />
                  <Input
                    onChangeText={handleChange('companyPhone')}
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
                      console.log(text)
                      setFieldValue('companyAddrProvinceCode', text)
                      dispatch({ type: 'updateProvince', value: text })
                      behavior.setModify('P02_C0x_S_STATE', text, state.companyAddrCityCode)
                    }}
                    title={t('companyAddrProvinceCode.label')}
                    field={'companyAddrProvinceCode'}
                    label={t('companyAddrProvinceCode.label')}
                    placeholder={t('companyAddrProvinceCode.placeholder')}
                    dataSource={state.provinceArr}
                    error={errors.companyAddrProvinceCode}
                  />
                  <NormalPicker
                    onChange={text => {
                      console.log(text)
                      setFieldValue('companyAddrCityCode', text)
                      dispatch({ type: 'updateCity', value: text })
                      behavior.setModify('P02_C0x_S_CITY', text, state.companyAddrCityCode)
                    }}
                    title={t('companyAddrCityCode.label')}
                    field={'companyAddrCityCode'}
                    label={t('companyAddrCityCode.label')}
                    placeholder={t('companyAddrCityCode.placeholder')}
                    dataSource={state.cityArr}
                    error={errors.companyAddrCityCode}
                  />
                  <Input
                    onChangeText={handleChange('companyAddrDetail')}
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
                    dataSource={state.incumbencyArr}
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

type FormModel = Omit<ApplyStep2Parameter, keyof ApplyParameter>
interface Step2State extends FormModel {
  provinceArr: Dict[]
  cityArr: Dict[]
  incumbencyArr: Dict[]
  monthlyIncomeArr: Dict[]
  industryArr: Dict[]
  jobTypeArr: Dict[]
  monthly: Dict[]
  weekly: Dict[]
}
type Step2Action =
  | {
      type: 'updateProvinces'
      value: Dict[]
    }
  | {
      type: 'updateProvince'
      value: string
    }
  | {
      type: 'updateCities'
      value: Dict[]
    }
  | {
      type: 'updateCity'
      value: string
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
      type: 'updateMonthly'
      value: Dict[]
    }
  | {
      type: 'updateWeekly'
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
      value: string
    }
  | {
      type: 'updateProfessions'
      value: Dict[]
    }
  | {
      type: 'updateProfession'
      value: string
    }
