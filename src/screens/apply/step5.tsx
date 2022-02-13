import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { type Reducer, useContext, useEffect, useReducer, useRef } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE } from '@/utils/reg'
import { filterArrayKey } from '@/utils/util'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import {
  ApplyButton,
  Input,
  NormalPicker,
  DatePicker,
  RadioInput,
  MaskInput,
} from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep5Parameter, OcrResult } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { default as MoneyyaContext } from '@/state'
import type { Dict, DictField } from '@/typings/response'
import { MMKV } from '@/utils/storage'
import { useRoute } from '@react-navigation/native'
import type { Gender } from '@/typings/user'
import { fetchDict, submit } from '@/services/apply'

export const Step5 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const route = useRoute()
  const { orcResult } = route.params as { orcResult?: OcrResult }
  const schema = Yup.object().shape({
    firstName: Yup.string()
      .max(50, t('field.long', { field: t('firstName.label') }))
      .required(t('firstName.required')),
    middleName: Yup.string()
      .max(100, t('field.long', { field: t('middleName.label') }))
      .required(t('middleName.required')),
    lastName: Yup.string()
      .max(50, t('field.long', { field: t('lastname.label') }))
      .required(t('lastname.required')),
    birth: Yup.string().required(t('birth.required')),
    sex: Yup.string().required(t('gender.required')),
    idcard: Yup.string()
      .min(18, t('idcard.invalid'))
      .max(18, t('idcard.invalid')) // 英文加数字都有
      .required(t('idcard.required')),
    maritalStatus: Yup.string().required(t('maritalStatus.required')),
    homeAddrProvinceCode: Yup.string().required(t('homeAddrProvinceCode.required')),
    homeAddrCityCode: Yup.string().required(t('homeAddrCityCode.required')),
    homeAddrDetail: Yup.string().required(t('homeAddrDetail.required')),
    docType: Yup.string().required(t('docType.required')),
    backupPhone: Yup.string()
      .matches(REGEX_PHONE, t('backupPhone.invalid'))
      .required(t('backupPhone.required')),
    educationCode: Yup.string().required(t('educationCode.required')),
    loanPurpose: Yup.string().required(t('loanPurposeCode.required')),
    authPhone: Yup.string().max(20, t('authPhone.invalid')).required(t('authPhone.required')),
    whatsapp: Yup.string().required(t('whatsapp.required')),
    email: Yup.string().email().required(t('email.required')),
    secondCardNo: Yup.string()
      .max(20, t('secondCardNo.invalid'))
      .required(t('secondCardNo.required')),
  })
  const context = useContext(MoneyyaContext)
  const step5Data = (MMKV.getMap('step5Data') as Partial<Step5State>) || {}
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
        case 'authPhone':
          return { ...s, authPhone: value }
        case 'docType':
          return { ...s, docType: value }
        case 'whatsapp':
          return { ...s, whatsapp: value }
        default:
          return { ...s }
      }
    },
    {
      firstName: orcResult?.userName || step5Data.firstName || '',
      middleName: orcResult?.mothersurname || step5Data.middleName || '',
      lastName: orcResult?.fathersurname || step5Data.lastName || '',
      educationCode: step5Data.educationCode || '',
      email: step5Data.email || '',
      homeAddrCity: step5Data.homeAddrCity || '',
      homeAddrCityCode: step5Data.homeAddrCityCode || '',
      homeAddrDetail: orcResult?.addressAll || step5Data.homeAddrDetail || '',
      homeAddrProvince: step5Data.homeAddrProvince || '',
      homeAddrProvinceCode: step5Data.homeAddrProvinceCode || '',
      backupPhone: step5Data.backupPhone || '',
      birth: orcResult?.birthday || step5Data.birth || '',
      docType: step5Data.docType || '',
      idcard: orcResult?.idCard || step5Data.idcard || '',
      loanPurpose: step5Data.loanPurpose || '',
      maritalStatus: step5Data.maritalStatus || '',
      name: '',
      secondCardNo: step5Data.secondCardNo || '',
      sex: (orcResult?.gender as Gender) || step5Data.sex || '',
      maritalStatusArray: [],
      homeAddrProvinceArray: [],
      homeAddrCityArray: [],
      docTypeArray: [],
      educationArray: [],
      loanPurposeArray: [],
      authPhone: step5Data.authPhone || '',
      whatsapp: step5Data.whatsapp || '',
    }
  )

  const onSubmit = debounce(
    (values: FormModel) => {
      const data = {
        ...(filterArrayKey(values) as FormModel),
        homeAddrCity: state.homeAddrCity,
        homeAddrProvince: state.homeAddrProvince,
        authPhone: state.authPhone,
      }
      submit<'5'>({
        ...data,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 5,
        totalSteps: TOTAL_STEPS,
        thirdInfos: [
          {
            authPhone: state.authPhone,
            authType: '',
            isAuth: 'Y',
            thirdCode: 'whatsApp',
            thirdName: 'whatsApp',
          },
        ],
        name: `${values.firstName.trim()} ${values.middleName.trim()} ${values.lastName.trim()}`,
      }).then(() => {
        MMKV.setMapAsync('step5Data', data)
        if (context.brand?.livenessAuthEnable === 'Y') {
          navigation.navigate('Step61')
        } else {
          navigation.navigate('Step62')
        }
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = [
        'MARITAL_STATUS',
        'PRIMAARYID',
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
              case 'PRIMAARYID':
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
          <Formik<FormModel>
            initialValues={state}
            validateOnBlur
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue, errors }) => {
              return (
                <>
                  <View style={PageStyles.form}>
                    <Input
                      scrollViewRef={scrollviewRef}
                      onChangeText={text => {
                        setFieldValue('firstName', text)
                        dispatch({ type: 'firstName', value: text })
                      }}
                      onClear={() => setFieldValue('firstName', '')}
                      onFocus={() =>
                        behavior.setStartModify('P05_C01_I_FIRSTNAME', state.firstName)
                      }
                      onBlur={() => behavior.setEndModify('P05_C01_I_FIRSTNAME', state.firstName)}
                      value={state.firstName}
                      maxLength={50}
                      field={'firstName'}
                      key={'firstName'}
                      label={t('firstName.label')}
                      placeholder={t('firstName.placeholder')}
                    />
                    <Input
                      scrollViewRef={scrollviewRef}
                      onChangeText={text => {
                        setFieldValue('middleName', text)
                        dispatch({ type: 'middleName', value: text })
                      }}
                      onClear={() => setFieldValue('middleName', '')}
                      onFocus={() =>
                        behavior.setStartModify('P05_C02_I_MIDDLENAME', state.middleName)
                      }
                      onBlur={() => behavior.setEndModify('P05_C02_I_MIDDLENAME', state.middleName)}
                      value={state.middleName}
                      field={'middleName'}
                      maxLength={100}
                      key={'middleName'}
                      label={t('middleName.label')}
                      placeholder={t('middleName.placeholder')}
                    />
                    <Input
                      scrollViewRef={scrollviewRef}
                      onChangeText={text => {
                        setFieldValue('lastName', text)
                        dispatch({ type: 'lastName', value: text })
                      }}
                      onClear={() => setFieldValue('lastName', '')}
                      onFocus={() => behavior.setStartModify('P05_C03_I_LASTNAME', state.lastName)}
                      onBlur={() => behavior.setEndModify('P05_C03_I_LASTNAME', state.lastName)}
                      value={state.lastName}
                      field={'lastName'}
                      maxLength={50}
                      key={'lastName'}
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
                      key={'birth'}
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
                      key={'sex'}
                      value={state.sex}
                      label={t('gender.label')}
                    />
                    <Input
                      onChangeText={text => {
                        setFieldValue('idcard', text)
                        dispatch({ type: 'idcard', value: text })
                      }}
                      onFocus={() => behavior.setStartModify('P05_C04_I_IDCARD', state.idcard)}
                      onBlur={() => behavior.setEndModify('P05_C04_I_IDCARD', state.idcard)}
                      onClear={() => setFieldValue('idcard', '')}
                      value={state.idcard}
                      field={'idcard'}
                      keyboardType="number-pad"
                      key={'idcard'}
                      maxLength={18}
                      label={t('idcard.label')}
                      scrollViewRef={scrollviewRef}
                      placeholder={t('idcard.placeholder')}
                    />
                    <NormalPicker
                      onChange={({ code }) => {
                        setFieldValue('maritalStatus', code)
                        dispatch({ type: 'maritalStatus', value: code })
                        behavior.setModify('P05_C03_S_MARITALSTATUS', code, state.maritalStatus)
                      }}
                      value={state.maritalStatus}
                      title={t('maritalStatus.label')}
                      field={'maritalStatus'}
                      key={'maritalStatus'}
                      label={t('maritalStatus.label')}
                      placeholder={t('maritalStatus.placeholder')}
                      dataSource={state.maritalStatusArray}
                      scrollViewRef={scrollviewRef}
                    />
                    <NormalPicker
                      onChange={({ code, name }) => {
                        setFieldValue('homeAddrProvinceCode', code)
                        dispatch({ type: 'homeAddrProvince', value: { code, name } })
                        dispatch({ type: 'homeAddrCity', value: { name: '', code: '' } })
                        behavior.setModify(
                          'P05_C04_S_HOMEADDRPROVINCECODE',
                          code,
                          state.homeAddrProvinceCode
                        )
                      }}
                      value={state.homeAddrProvinceCode}
                      title={t('homeAddrProvinceCode.label')}
                      field={'homeAddrProvinceCode'}
                      key={'homeAddrProvinceCode'}
                      label={t('homeAddrProvinceCode.label')}
                      placeholder={t('homeAddrProvinceCode.placeholder')}
                      dataSource={state.homeAddrProvinceArray}
                      scrollViewRef={scrollviewRef}
                    />
                    <NormalPicker
                      onChange={({ code, name }) => {
                        setFieldValue('homeAddrCityCode', code)
                        dispatch({ type: 'homeAddrCity', value: { code, name } })
                        behavior.setModify(
                          'P05_C05_S_HOMEADDRCITYCODE',
                          code,
                          state.homeAddrCityCode
                        )
                      }}
                      value={state.homeAddrCityCode}
                      title={t('homeAddrCityCode.label')}
                      field={'homeAddrCityCode'}
                      key={'homeAddrCityCode'}
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
                      onClear={() => setFieldValue('homeAddrDetail', '')}
                      onFocus={() =>
                        behavior.setStartModify('P05_C05_I_IHOMEADDRDETAIL', state.homeAddrDetail)
                      }
                      onBlur={() =>
                        behavior.setEndModify('P05_C05_I_IHOMEADDRDETAIL', state.homeAddrDetail)
                      }
                      value={state.homeAddrDetail}
                      field={'homeAddrDetail'}
                      key={'homeAddrDetail'}
                      maxLength={200}
                      label={t('homeAddrDetail.label')}
                      placeholder={t('homeAddrDetail.placeholder')}
                    />
                    <NormalPicker
                      onChange={({ code }) => {
                        setFieldValue('docType', code)
                        dispatch({ type: 'docType', value: code })
                        behavior.setModify('P05_C06_S_DOCTYPE', code, state.docType)
                      }}
                      value={state.docType}
                      title={t('docType.label')}
                      field={'docType'}
                      key={'docType'}
                      label={t('docType.label')}
                      placeholder={t('docType.placeholder')}
                      dataSource={state.docTypeArray}
                    />
                    <MaskInput
                      field="backupPhone"
                      onChangeText={(formatted, extracted) => {
                        setFieldValue('backupPhone', extracted)
                        dispatch({ type: 'backupPhone', value: extracted || '' })
                      }}
                      value={state.backupPhone}
                      placeholder={t('phone.placeholder')}
                      error={errors.backupPhone}
                      keyboardType="phone-pad"
                      mask={'[0000] [000] [000]'}
                      key={'backupPhone'}
                      onFocus={() =>
                        behavior.setStartModify('P05_C06_I_BACKUPPHONE', state.backupPhone)
                      }
                      onBlur={() =>
                        behavior.setEndModify('P05_C06_I_BACKUPPHONE', state.backupPhone)
                      }
                      label={t('backupPhone.label')}
                    />
                    <NormalPicker
                      onChange={({ code }) => {
                        setFieldValue('educationCode', code)
                        dispatch({ type: 'educationCode', value: code })
                        behavior.setModify('P05_C07_S_EDUCATIONCODE', code, state.educationCode)
                      }}
                      value={state.educationCode}
                      title={t('educationCode.label')}
                      field={'educationCode'}
                      key={'educationCode'}
                      label={t('educationCode.label')}
                      placeholder={t('educationCode.placeholder')}
                      dataSource={state.educationArray}
                    />
                    <NormalPicker
                      onChange={({ code }) => {
                        setFieldValue('loanPurpose', code)
                        dispatch({ type: 'loanPurpose', value: code })
                        behavior.setModify('P05_C08_S_LOANPURPOSE', code, state.loanPurpose)
                      }}
                      value={state.loanPurpose}
                      title={t('loanPurpose.label')}
                      field={'loanPurpose'}
                      key={'loanPurpose'}
                      label={t('loanPurpose.label')}
                      placeholder={t('loanPurpose.placeholder')}
                      dataSource={state.loanPurposeArray}
                    />
                    <Input
                      onChangeText={(text: string) => {
                        setFieldValue('authPhone', text)
                        dispatch({ type: 'authPhone', value: text })
                      }}
                      onClear={() => setFieldValue('authPhone', '')}
                      onFocus={() =>
                        behavior.setStartModify('P05_C07_I_AUTHPHONE', state.authPhone)
                      }
                      onBlur={() => behavior.setEndModify('P05_C07_I_AUTHPHONE', state.authPhone)}
                      value={state.authPhone}
                      keyboardType="phone-pad"
                      field={'authPhone'}
                      key={'authPhone'}
                      maxLength={100}
                      label={t('authPhone.label')}
                      placeholder={t('authPhone.placeholder')}
                    />
                    <Input
                      onChangeText={(text: string) => {
                        setFieldValue('whatsapp', text)
                        dispatch({ type: 'whatsapp', value: text })
                      }}
                      onClear={() => setFieldValue('whatsapp', '')}
                      onFocus={() => behavior.setStartModify('P05_C08_I_WHATSAPP', state.whatsapp)}
                      onBlur={() => behavior.setEndModify('P05_C08_I_WHATSAPP', state.whatsapp)}
                      value={state.whatsapp}
                      field={'whatsapp'}
                      key={'whatsapp'}
                      label={t('whatsapp.label')}
                      placeholder={t('whatsapp.placeholder')}
                    />
                    <Input
                      onChangeText={(text: string) => {
                        setFieldValue('email', text)
                        dispatch({ type: 'email', value: text })
                      }}
                      onClear={() => setFieldValue('email', '')}
                      onFocus={() => behavior.setStartModify('P05_C09_I_EMAIL', state.email)}
                      onBlur={() => behavior.setEndModify('P05_C09_I_EMAIL', state.email)}
                      keyboardType="email-address"
                      value={state.email}
                      field={'email'}
                      key={'email'}
                      label={t('email.label')}
                      placeholder={t('email.placeholder')}
                    />
                    <Input
                      onChangeText={(text: string) => {
                        setFieldValue('secondCardNo', text)
                        dispatch({ type: 'secondCardNo', value: text })
                      }}
                      onClear={() => setFieldValue('secondCardNo', '')}
                      onFocus={() =>
                        behavior.setStartModify('P05_C10_I_SECONDCARDNO', state.secondCardNo)
                      }
                      onBlur={() =>
                        behavior.setEndModify('P05_C10_I_SECONDCARDNO', state.secondCardNo)
                      }
                      value={state.secondCardNo}
                      field={'secondCardNo'}
                      key={'secondCardNo'}
                      maxLength={20}
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
              )
            }}
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
  authPhone: string
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
      value: Pick<Dict, 'code' | 'name'>
    }
  | {
      type: 'homeAddrCity'
      value: Pick<Dict, 'code' | 'name'>
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
      type: 'authPhone'
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
