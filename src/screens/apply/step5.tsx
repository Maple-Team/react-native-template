import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { Reducer, useContext, useEffect, useReducer, useRef } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, Input, NormalPicker, DatePicker, RadioInput } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep5Parameter, OcrResult } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { MoneyyaContext } from '@/state'
import type { Dict, DictField } from '@/typings/response'
import { MMKV } from '@/utils/storage'
import { useRoute } from '@react-navigation/native'
import { Gender } from '@/typings/user'
import { fetchDict, submit } from '@/services/apply'

export const Step5 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const route = useRoute()
  const { orcResult } = route.params as { orcResult?: OcrResult }
  const schema = Yup.object().shape({
    firstName: Yup.string()
      .min(1, t('field.short', { field: t('firstName.label') }))
      .max(50, t('field.long', { field: t('firstName.label') }))
      .required(t('firstName.required')),
    middleName: Yup.string()
      .min(1, t('field.short', { field: t('middleName.label') }))
      .max(100, t('field.long', { field: t('middleName.label') }))
      .required(t('middleName.required')),
    lastName: Yup.string()
      .min(1, t('field.short', { field: t('lastname.label') }))
      .max(50, t('field.long', { field: t('lastname.label') }))
      .required(t('lastname.required')),
    birth: Yup.string().required(t('birth.required')),
    sex: Yup.string().required(t('gender.required')),
    idcard: Yup.string().required(t('idcard.required')),
    maritalStatus: Yup.string().required(t('maritalStatus.required')),
    homeAddrProvinceCode: Yup.string().required(t('homeAddrProvinceCode.required')),
    homeAddrCityCode: Yup.string().required(t('homeAddrCityCode.required')),
    homeAddrDetail: Yup.string().required(t('homeAddrDetail.required')),
    docType: Yup.string().required(t('docType.required')),
    backupPhone: Yup.string()
      .matches(REGEX_PHONE, t('backupPhone.invalid'))
      .required(t('backupPhone.required')),
    educationCode: Yup.string().required(t('educationCode.required')),
    loanPurposeCode: Yup.string().required(t('loanPurposeCode.required')),
    socialPhone: Yup.string().required(t('socialPhone.required')),
    whatsapp: Yup.string().required(t('whatsapp.required')),
    email: Yup.string().required(t('email.required')),
    secondCardNo: Yup.string().required(t('secondCardNo.required')),
  })
  const context = useContext(MoneyyaContext)

  const [state, dispatch] = useReducer<Reducer<Step5State, Step5Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'backupPhone':
          return { ...s, backupPhone: value }
        case 'homeAddrCity':
          return { ...s, homeAddrCity: value?.name || '', homeAddrCityCode: value?.code || '' }
        case 'homeAddrCityArray':
          return { ...s, homeAddrCityArray: value }
        case 'homeAddrProvince':
          return { ...s, homeAddrProvince: value.name, homeAddrProvinceCode: value.code }
        case 'homeAddrProvinceArray':
          return { ...s, homeAddrProvinceArray: value }
        case 'homeAddrDetail':
          return { ...s, homeAddrDetail: value }
        case 'docTypeArray':
          return { ...s, docTypeArray: value }
        case 'educationArray':
          return { ...s, educationArray: value }
        case 'loanPurposeArray':
          return { ...s, loanPurposeArray: value }
        case 'maritalStatusArray':
          return { ...s, maritalStatusArray: value }
        case 'birth':
          return { ...s, birth: value }
        case 'secondCardNo':
          return { ...s, secondCardNo: value }
        case 'educationCode':
          return { ...s, educationCode: value }
        case 'email':
          return { ...s, email: value }
        case 'firstName':
          return { ...s, firstName: value }
        case 'gender':
          return { ...s, sex: value }
        case 'idcard':
          return { ...s, idcard: value }
        case 'lastName':
          return { ...s, lastName: value }
        case 'loanPurpose':
          return { ...s, loanPurpose: value }
        case 'maritalStatus':
          return { ...s, maritalStatus: value }
        case 'middleName':
          return { ...s, middleName: value }
        case 'socialPhone':
          return { ...s, socialPhone: value }
        case 'docType':
          return { ...s, docType: value }
        case 'whatsapp':
          return { ...s, whatsapp: value }
        default:
          return { ...s }
      }
    },
    {
      firstName: orcResult?.userName || '',
      middleName: orcResult?.mothersurname || '',
      lastName: orcResult?.fathersurname || '',
      educationCode: '',
      email: '',
      homeAddrCity: '',
      homeAddrCityCode: '',
      homeAddrDetail: orcResult?.addressAll || '',
      homeAddrProvince: '',
      homeAddrProvinceCode: '',
      backupPhone: '',
      birth: orcResult?.birthday || '',
      docType: '',
      idcard: orcResult?.idCard || '',
      loanPurpose: '',
      maritalStatus: '',
      name: '',
      secondCardNo: '',
      sex: (orcResult?.gender as Gender) || '',
      maritalStatusArray: [],
      homeAddrProvinceArray: [],
      homeAddrCityArray: [],
      docTypeArray: [],
      educationArray: [],
      loanPurposeArray: [],
      socialPhone: '',
      whatsapp: '',
    }
  )

  const onSubmit = debounce(
    (values: FormModel) => {
      submit({
        ...values,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 5,
        totalSteps: TOTAL_STEPS,
        thirdInfos: [
          {
            authPhone: state.socialPhone,
            authType: state.whatsapp,
            isAuth: 'Y',
            thirdCode: 'whatsApp',
            thirdName: 'whatsApp',
          },
        ],
        homeAddrCity: state.homeAddrCity,
        homeAddrProvince: state.homeAddrProvince,
      }).then(() => {
        navigation.navigate('Step6')
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = [
        'MARITAL_STATUS',
        'ID_TYPE',
        'EDUCATION',
        'LOAN_PURPOSE',
        'DISTRICT',
      ]
      dicts.forEach(field =>
        fetchDict(field)
          .then(value => {
            switch (field) {
              case 'DISTRICT':
                dispatch({ type: 'homeAddrProvinceArray', value })
                break
              case 'EDUCATION':
                dispatch({ type: 'educationArray', value })
                break
              case 'MARITAL_STATUS':
                dispatch({ type: 'maritalStatusArray', value })
                break
              case 'ID_TYPE':
                dispatch({ type: 'docTypeArray', value })
                break
              case 'LOAN_PURPOSE':
                dispatch({ type: 'loanPurposeArray', value })
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
    const queryCity = () => fetchDict(state.homeAddrProvinceCode as DictField)
    queryCity().then(values => {
      dispatch({ type: 'homeAddrCityArray', value: values })
    })
  }, [state.homeAddrProvinceCode])

  const behavior = useBehavior<'P05'>('P05', 'P05_C00', 'P05_C99')
  useLocation()
  const scrollviewRef = useRef<ScrollView>(null)

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} ref={scrollviewRef} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel> initialValues={state} onSubmit={onSubmit} validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue }) => (
              <>
                <View style={PageStyles.form}>
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('firstName', text)
                      dispatch({ type: 'firstName', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('firstName', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C01_I_FIRSTNAME', state.firstName)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C01_I_FIRSTNAME', state.firstName)
                    }}
                    value={state.firstName}
                    field={'firstName'}
                    label={t('firstName.label')}
                    placeholder={t('firstName.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('middleName', text)
                      dispatch({ type: 'middleName', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('middleName', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C02_I_MIDDLENAME', state.middleName)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C02_I_MIDDLENAME', state.middleName)
                    }}
                    value={state.middleName}
                    field={'middleName'}
                    label={t('middleName.label')}
                    placeholder={t('middleName.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('lastName', text)
                      dispatch({ type: 'lastName', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('lastName', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C03_I_LASTNAME', state.lastName)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C03_I_LASTNAME', state.lastName)
                    }}
                    value={state.lastName}
                    field={'lastName'}
                    label={t('lastName.label')}
                    placeholder={t('lastName.placeholder')}
                  />
                  <DatePicker
                    scrollViewRef={scrollviewRef}
                    onChange={text => {
                      setFieldValue('birth', text)
                      dispatch({ type: 'birth', value: text })
                      behavior.setModify('P05_C01_S_BIRTH', text, state.birth)
                    }}
                    title={t('birth.label')}
                    field={'birth'}
                    label={t('birth.label')}
                    value={state.birth}
                    placeholder={t('birth.placeholder')}
                  />
                  <RadioInput
                    onChange={text => {
                      setFieldValue('sex', text)
                      dispatch({ type: 'gender', value: text as Gender })
                      behavior.setModify('P05_C02_S_GENDER', text, state.sex)
                    }}
                    field={'sex'}
                    value={state.sex}
                    label={t('gender.label')}
                  />
                  <Input
                    onChangeText={text => {
                      setFieldValue('idcard', text)
                      dispatch({ type: 'idcard', value: text })
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C04_I_IDCARD', state.idcard)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C04_I_IDCARD', state.idcard)
                    }}
                    onClear={() => {
                      setFieldValue('idcard', '')
                    }}
                    value={state.idcard}
                    field={'idcard'}
                    label={t('idcard.label')}
                    scrollViewRef={scrollviewRef}
                    placeholder={t('idcard.placeholder')}
                  />
                  <NormalPicker
                    onChange={(record: Dict) => {
                      setFieldValue('maritalStatus', record.code)
                      dispatch({ type: 'maritalStatus', value: record.code })
                      behavior.setModify(
                        'P05_C03_S_MARITALSTATUS',
                        record.code,
                        state.maritalStatus
                      )
                    }}
                    value={state.maritalStatus}
                    title={t('maritalStatus.label')}
                    field={'maritalStatus'}
                    label={t('maritalStatus.label')}
                    placeholder={t('maritalStatus.placeholder')}
                    dataSource={state.maritalStatusArray}
                    scrollViewRef={scrollviewRef}
                  />
                  <NormalPicker
                    onChange={(record: Dict) => {
                      setFieldValue('homeAddrProvinceCode', record.code)
                      dispatch({ type: 'homeAddrProvince', value: record })
                      dispatch({ type: 'homeAddrCity', value: { name: '', code: '' } })
                      behavior.setModify(
                        'P05_C04_S_HOMEADDRPROVINCECODE',
                        record.code,
                        state.homeAddrProvinceCode
                      )
                    }}
                    value={state.homeAddrProvinceCode}
                    title={t('homeAddrProvinceCode.label')}
                    field={'homeAddrProvinceCode'}
                    label={t('homeAddrProvinceCode.label')}
                    placeholder={t('homeAddrProvinceCode.placeholder')}
                    dataSource={state.homeAddrProvinceArray}
                    scrollViewRef={scrollviewRef}
                  />
                  <NormalPicker
                    onChange={(record: Dict) => {
                      setFieldValue('homeAddrCityCode', record.code)
                      dispatch({ type: 'homeAddrCity', value: record })
                      behavior.setModify(
                        'P05_C05_S_HOMEADDRCITYCODE',
                        record.code,
                        state.homeAddrCityCode
                      )
                    }}
                    value={state.homeAddrCityCode}
                    title={t('homeAddrCityCode.label')}
                    field={'homeAddrCityCode'}
                    label={t('homeAddrCityCode.label')}
                    placeholder={t('homeAddrCityCode.placeholder')}
                    dataSource={state.homeAddrCityArray}
                    scrollViewRef={scrollviewRef}
                  />
                  <Input
                    onChangeText={(text: string) => {
                      setFieldValue('homeAddrDetail', text)
                      dispatch({ type: 'homeAddrDetail', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('homeAddrDetail', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C05_I_IHOMEADDRDETAIL', state.homeAddrDetail)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C05_I_IHOMEADDRDETAIL', state.homeAddrDetail)
                    }}
                    value={state.homeAddrDetail}
                    field={'homeAddrDetail'}
                    label={t('homeAddrDetail.label')}
                    placeholder={t('homeAddrDetail.placeholder')}
                  />
                  <NormalPicker
                    onChange={function (record: Dict): void {
                      setFieldValue('docType', record.code)
                      dispatch({ type: 'docType', value: record.code })
                      behavior.setModify('P05_C06_S_DOCTYPE', record.code, state.docType)
                    }}
                    value={state.docType}
                    title={t('docType.label')}
                    field={'docType'}
                    label={t('docType.label')}
                    placeholder={t('docType.placeholder')}
                    dataSource={state.docTypeArray}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      setFieldValue('backupPhone', text)
                      dispatch({ type: 'backupPhone', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('backupPhone', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C06_I_BACKUPPHONE', state.backupPhone)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C06_I_BACKUPPHONE', state.backupPhone)
                    }}
                    value={state.backupPhone}
                    field={'backupPhone'}
                    maxLength={10}
                    label={t('backupPhone.label')}
                    placeholder={t('backupPhone.placeholder')}
                  />
                  <NormalPicker
                    onChange={function (record: Dict): void {
                      setFieldValue('educationCode', record.code)
                      dispatch({ type: 'educationCode', value: record.code })
                      behavior.setModify(
                        'P05_C07_S_EDUCATIONCODE',
                        record.code,
                        state.educationCode
                      )
                    }}
                    value={state.educationCode}
                    title={t('educationCode.label')}
                    field={'educationCode'}
                    label={t('educationCode.label')}
                    placeholder={t('educationCode.placeholder')}
                    dataSource={state.educationArray}
                  />
                  <NormalPicker
                    onChange={function (record: Dict): void {
                      setFieldValue('loanPurpose', record.code)
                      dispatch({ type: 'loanPurpose', value: record.code })
                      behavior.setModify('P05_C08_S_LOANPURPOSE', record.code, state.loanPurpose)
                    }}
                    value={state.loanPurpose}
                    title={t('loanPurpose.label')}
                    field={'loanPurpose'}
                    label={t('loanPurpose.label')}
                    placeholder={t('loanPurpose.placeholder')}
                    dataSource={state.loanPurposeArray}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      setFieldValue('socialPhone', text)
                      dispatch({ type: 'socialPhone', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('socialPhone', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C07_I_SOCIALPHONE', state.socialPhone)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C07_I_SOCIALPHONE', state.socialPhone)
                    }}
                    value={state.socialPhone}
                    field={'socialPhone'}
                    maxLength={10}
                    label={t('socialPhone.label')}
                    placeholder={t('socialPhone.placeholder')}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      setFieldValue('whatsapp', text)
                      dispatch({ type: 'whatsapp', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('whatsapp', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C08_I_WHATSAPP', state.whatsapp)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C08_I_WHATSAPP', state.whatsapp)
                    }}
                    value={state.whatsapp}
                    field={'whatsapp'}
                    label={t('whatsapp.label')}
                    placeholder={t('whatsapp.placeholder')}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      setFieldValue('email', text)
                      dispatch({ type: 'email', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('email', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C09_I_EMAIL', state.email)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C09_I_EMAIL', state.email)
                    }}
                    value={state.email}
                    field={'email'}
                    label={t('email.label')}
                    placeholder={t('email.placeholder')}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      setFieldValue('secondCardNo', text)
                      dispatch({ type: 'secondCardNo', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('secondCardNo', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P05_C10_I_SECONDCARDNO', state.secondCardNo)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P05_C10_I_SECONDCARDNO', state.secondCardNo)
                    }}
                    value={state.secondCardNo}
                    field={'secondCardNo'}
                    label={t('secondCardNo.label')}
                    placeholder={t('secondCardNo.placeholder')}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : undefined}
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

type FormModel = Omit<
  ApplyStep5Parameter,
  keyof (ApplyParameter & {
    thirdInfos: []
  })
>
interface Step5State extends FormModel {
  maritalStatusArray: Dict[]
  homeAddrProvinceArray: Dict[]
  homeAddrCityArray: Dict[]
  docTypeArray: Dict[]
  educationArray: Dict[]
  loanPurposeArray: Dict[]
  socialPhone: string
  whatsapp: string
}
type Step5Action =
  | {
      type: 'maritalStatusArray'
      value: Dict[]
    }
  | {
      type: 'homeAddrProvinceArray'
      value: Dict[]
    }
  | {
      type: 'homeAddrCityArray'
      value: Dict[]
    }
  | {
      type: 'docTypeArray'
      value: Dict[]
    }
  | {
      type: 'educationArray'
      value: Dict[]
    }
  | {
      type: 'loanPurposeArray'
      value: Dict[]
    }
  | {
      type: 'firstName'
      value: string
    }
  | {
      type: 'middleName'
      value: string
    }
  | {
      type: 'lastName'
      value: string
    }
  | {
      type: 'birth'
      value: string
    }
  | {
      type: 'gender'
      value: Gender
    }
  | {
      type: 'idcard'
      value: string
    }
  | {
      type: 'maritalStatus'
      value: string
    }
  | {
      type: 'homeAddrProvince'
      value: Dict
    }
  | {
      type: 'homeAddrCity'
      value: Dict | null
    }
  | {
      type: 'homeAddrDetail'
      value: string
    }
  | {
      type: 'docType'
      value: string
    }
  | {
      type: 'backupPhone'
      value: string
    }
  | {
      type: 'educationCode'
      value: string
    }
  | {
      type: 'loanPurpose'
      value: string
    }
  | {
      type: 'socialPhone'
      value: string
    }
  | {
      type: 'whatsapp'
      value: string
    }
  | {
      type: 'email'
      value: string
    }
  | {
      type: 'secondCardNo'
      value: string
    }
