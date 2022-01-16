import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { Reducer, useCallback, useContext, useMemo, useReducer, useRef } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE, REGEX_USERNAME } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_BEHAVIOR_DATA } from '@/utils/constant'
import { ApplyButton, Input, NormalPicker, DatePicker, RadioInput } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { ApplyParameter, ApplyStep5Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks'
import behavior from '@/utils/behavior'
import { MoneyyaContext } from '@/state'
import { Dict } from '@/typings/response'
import { BehaviorModel } from '@/typings/behavior'
import Behavior from '@/utils/behavior'
import { MMKV } from '@/utils/storage'
import { useFocusEffect } from '@react-navigation/native'
import { useWindowSize } from 'usehooks-ts'

export const Step5 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    firstName: Yup.string()
      // .min(10, t('field.short', { field: 'Phone' }))
      // .max(10, t('field.long', { field: 'Phone' }))
      // .matches(REGEX_USERNAME, t('phone.invalid'))
      .required(t('phone.required')),
    middleName: Yup.string().required(t('phone.required')),
    lastName: Yup.string().required(t('phone.required')),
    birth: Yup.string().required(t('birth.required')),
    sex: Yup.string().required(t('gender.required')),
    idcard: Yup.string().required(t('idcard.required')),
    maritalStatus: Yup.string().required(t('maritalStatus.required')),
    homeAddrProvinceCode: Yup.string().required(t('homeAddrProvinceCode.required')),
    homeAddrCityCode: Yup.string().required(t('homeAddrCityCode.required')),
    homeAddrDetail: Yup.string().required(t('homeAddrDetail.required')),
    docType: Yup.string().required(t('docType.required')),
    backupPhone: Yup.string().required(t('backupPhone.required')),
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
        default:
          return { ...s }
      }
    },
    {
      firstName: '',
      middleName: '',
      lastName: '',
      educationCode: '',
      email: '',
      homeAddrCity: '',
      homeAddrCityCode: '',
      homeAddrDetail: '',
      homeAddrProvince: '',
      homeAddrProvinceCode: '',
      backupPhone: '',
      birth: '',
      docType: '',
      idcard: '',
      loanPurpose: '',
      maritalStatus: '',
      name: '',
      secondCardNo: '',
      sex: 'male',
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
      console.log(values)
      navigation.navigate('Step6')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const windowSize = useWindowSize()
  const behavior = useMemo(() => {
    const initModel: BehaviorModel<'P05'> = {
      screenHeight: `${windowSize.height}`,
      screenWidth: `${windowSize.width}`,
      applyId: `${context.user?.applyId}`,
      outerIp: '',
      internalIp: '',
      records: MMKV.getArray(KEY_BEHAVIOR_DATA) || [],
    }
    return new Behavior<'P05'>(initModel)
  }, [context.user?.applyId, windowSize])

  useFocusEffect(
    useCallback(() => {
      behavior.setEnterPageTime('P05_C00')
      return () => {
        behavior.setLeavePageTime('P05_C99')
      }
    }, [behavior])
  )
  const location = useLoction()
  console.log(location)
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
                      // behavior.setStartModify('P03_C01_S_RELATIONSHIP', state.contactName1)
                    }}
                    onBlur={() => {
                      // behavior.setEndModify('P03_C01_S_RELATIONSHIP', state.contactName1)
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
                      // behavior.setStartModify('P03_C01_S_RELATIONSHIP', state.contactName1)
                    }}
                    onBlur={() => {
                      // behavior.setEndModify('P03_C01_S_RELATIONSHIP', state.contactName1)
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
                      // behavior.setStartModify('P03_C01_S_RELATIONSHIP', state.contactName1)
                    }}
                    onBlur={() => {
                      // behavior.setEndModify('P03_C01_S_RELATIONSHIP', state.contactName1)
                    }}
                    value={state.lastName}
                    field={'lastName'}
                    label={t('lastName.label')}
                    placeholder={t('lastName.placeholder')}
                  />
                  <DatePicker
                    scrollViewRef={scrollviewRef}
                    onChange={text => {
                      console.log(text)
                    }}
                    title={'birth'}
                    field={'birth'}
                    label={'birth'}
                    value=""
                    placeholder={'birth'}
                  />
                  <RadioInput
                    onChange={text => {
                      console.log(text)
                    }}
                    field={'sex'}
                    label={'gender'}
                  />
                  <Input
                    onChangeText={function (text): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'idcard'}
                    field={'idcard'}
                    label={'idcard'}
                    scrollViewRef={scrollviewRef}
                    placeholder={'idcard'}
                  />
                  <NormalPicker
                    onChange={function (text: Dict): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'maritalStatus'}
                    title={'maritalStatus'}
                    field={'maritalStatus'}
                    label={'maritalStatus'}
                    placeholder={'maritalStatus'}
                    dataSource={state.maritalStatusArray}
                    scrollViewRef={scrollviewRef}
                  />
                  <NormalPicker
                    onChange={function (text: Dict): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'homeAddrProvinceCode'}
                    title={'homeAddrProvinceCode'}
                    field={'homeAddrProvinceCode'}
                    label={'homeAddrProvinceCode'}
                    placeholder={'homeAddrProvinceCode'}
                    dataSource={state.homeAddrProvinceArray}
                    scrollViewRef={scrollviewRef}
                  />
                  <NormalPicker
                    onChange={function (text: Dict): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'homeAddrCityCode'}
                    title={'homeAddrCityCode'}
                    field={'homeAddrCityCode'}
                    label={'homeAddrCityCode'}
                    placeholder={'homeAddrCityCode'}
                    dataSource={state.homeAddrCityArray}
                    scrollViewRef={scrollviewRef}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'homeAddrDetail'}
                    field={'homeAddrDetail'}
                    label={'homeAddrDetail'}
                    placeholder={'homeAddrDetail'}
                  />
                  <NormalPicker
                    onChange={function (text: Dict): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'docType'}
                    title={'docType'}
                    field={'docType'}
                    label={'docType'}
                    placeholder={'docType'}
                    dataSource={state.docTypeArray}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'backupPhone'}
                    field={'backupPhone'}
                    label={'backupPhone'}
                    placeholder={'backupPhone'}
                  />
                  <NormalPicker
                    onChange={function (text: Dict): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'educationCode'}
                    title={'educationCode'}
                    field={'educationCode'}
                    label={'educationCode'}
                    placeholder={'educationCode'}
                    dataSource={state.educationArray}
                  />
                  <NormalPicker
                    onChange={function (text: Dict): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'loanPurpose'}
                    title={'loanPurpose'}
                    field={'loanPurpose'}
                    label={'loanPurpose'}
                    placeholder={'loanPurpose'}
                    dataSource={state.loanPurposeArray}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'socialPhone'}
                    field={'socialPhone'}
                    label={'socialPhone'}
                    placeholder={'socialPhone'}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'whatsapp'}
                    field={'whatsapp'}
                    label={'whatsapp'}
                    placeholder={'whatsapp'}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'email'}
                    field={'email'}
                    label={'email'}
                    placeholder={'email'}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      throw new Error('Function not implemented.')
                    }}
                    onClear={function (): void {
                      throw new Error('Function not implemented.')
                    }}
                    value={'secondCardNo'}
                    field={'secondCardNo'}
                    label={'secondCardNo'}
                    placeholder={'secondCardNo'}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : undefined}
                    onPress={handleSubmit}
                    // loading={state}
                  >
                    <Text fontSize={18} color="#fff">
                      {t('submit')}
                    </Text>
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
      value: string
    }
  | {
      type: 'idcard'
      value: string
    }
  | {
      type: 'maritalStatus'
      value: Dict
    }
  | {
      type: 'homeAddrProvince'
      value: Dict
    }
  | {
      type: 'homeAddrCity'
      value: Dict
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
      value: Dict
    }
  | {
      type: 'loanPurpose'
      value: Dict
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
