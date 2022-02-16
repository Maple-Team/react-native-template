import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { type Reducer, useEffect, useReducer, useContext } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { object, string } from 'yup'
import debounce from 'lodash.debounce'

import { Hint, PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import {
  ApplyButton,
  NormalPicker,
  MaskInput,
  Input,
  ValidateCode,
} from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { BankInfoParameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import type { Dict, DictField } from '@/typings/response'
import { MMKV } from '@/utils'
import { fetchDict, updateBankInfo } from '@/services/apply'
import { REGEX_BANK_CARD, REGEX_BANK_CLABE, REGEX_VALIDATE_CODE } from '@/utils/reg'
import { filterArrayKey, fourGap } from '@/utils/util'
import { default as MoneyyaContext } from '@/state'

export const Step71 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = object().shape({
    newBankCardNo: string()
      .when('cardNoType', {
        is: 'CARD',
        then: string().matches(REGEX_BANK_CARD, t('bankCardNo.invalid')),
      })
      .when('cardNoType', {
        is: 'ACCOUNT',
        then: string().matches(REGEX_BANK_CLABE, t('bankCardNo.invalid')),
      })
      .required(t('bankCardNo.required')),
    bankCode: string().required(t('bankCode.required')),
    cardNoType: string().required(t('cardNoType.required')),
    validateCode: string()
      .min(4, t('field.short', { field: 'Validate Code' }))
      .max(4, t('field.long', { field: 'Validate Code' }))
      .required(t('validateCode.required'))
      .matches(REGEX_VALIDATE_CODE, t('validateCode.invalid')),
  })

  const onSubmit = debounce(
    (values: FormModel) => {
      updateBankInfo(
        filterArrayKey({
          ...values,
          bankCardNo: state.newBankCardNo,
        }) as unknown as BankInfoParameter
      ).then(() => {
        navigation.navigate('Step8', {
          bankCardNo: state.newBankCardNo,
        })
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const step7Data = (MMKV.getMap('step7Data') as Partial<Step7State>) || {}
  const context = useContext(MoneyyaContext)
  const [state, dispatch] = useReducer<Reducer<Step7State, Step7Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'bankArray':
          return { ...s, bankArray: value }
        case 'newBankCardNo':
          return { ...s, newBankCardNo: value }
        case 'bankCode':
          return { ...s, bankCode: value }
        case 'cardNoTypeArray':
          return { ...s, cardNoTypeArray: value }
        case 'cardNoType':
          return { ...s, cardNoType: value }
        default:
          return { ...s }
      }
    },
    {
      bankArray: [],
      bankCardNo: step7Data.bankCardNo || '',
      bankCode: step7Data.bankCode || '',
      cardNoTypeArray: [],
      validateCode: '',
      autoRepayment: false,
      customerId: +(context.user?.customerId || '0'),
      cardNoType: step7Data.cardNoType || '',
      newBankCardNo: '',
    }
  )
  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = ['CARD_NO_TYPE', 'BANK']
      dicts.forEach(field =>
        fetchDict(field)
          .then(value => {
            switch (field) {
              case 'BANK':
                dispatch({ type: 'bankArray', value })
                break
              case 'CARD_NO_TYPE':
                dispatch({ type: 'cardNoTypeArray', value })
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
  useLocation()
  const behavior = useBehavior<'P07'>('P07', 'P07_C00', 'P07_C99')
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <View style={{ paddingHorizontal: 37, backgroundColor: '#fff', flexDirection: 'row' }}>
        <Hint
          img={require('@/assets/compressed/apply/loan_notice.webp')}
          hint={'Tips:ReceiptAs and repayments may be affected by bank working'}
          hintColor={'rgba(255, 50, 50, 1)'}
        />
      </View>
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="always">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            validateOnBlur
            initialValues={state}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue, values, handleChange, errors }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    onChange={({ code }) => {
                      setFieldValue('bankCode', code)
                      dispatch({ type: 'bankCode', value: code })
                      behavior.setModify('P07_C01_S_BANKCODE', code, state.bankCode)
                    }}
                    key="bankCode"
                    value={state.bankCode}
                    title={t('bankCode.label')}
                    field={'bankCode'}
                    label={t('bankCode.label')}
                    placeholder={t('bankCode.placeholder')}
                    dataSource={state.bankArray}
                  />
                  <NormalPicker
                    onChange={({ code }) => {
                      setFieldValue('cardNoType', code)
                      dispatch({ type: 'cardNoType', value: code })
                      behavior.setModify('P07_C01_S_CARDNOTYPE', code, state.cardNoType)
                    }}
                    key="bankCardType"
                    value={values.cardNoType}
                    title={t('cardNoType.label')}
                    field={'cardNoType'}
                    label={t('cardNoType.label')}
                    placeholder={t('cardNoType.placeholder')}
                    dataSource={state.cardNoTypeArray}
                  />
                  <Input
                    value={fourGap(state.bankCardNo)} // old
                    readonly={false}
                    keyboardType="phone-pad"
                    label={t('old') + t('bankCardNo.label')}
                    placeholder={t('bankCardNo.placeholder')}
                    key="bankCardNo_card_old"
                  />
                  {state.cardNoType === 'CARD' ? (
                    <MaskInput
                      onFocus={() =>
                        behavior.setStartModify('P07_C01_I_BANKCARDNO', state.newBankCardNo)
                      }
                      onBlur={() =>
                        behavior.setEndModify('P07_C01_I_BANKCARDNO', state.newBankCardNo)
                      }
                      value={state.newBankCardNo}
                      field={'newBankCardNo'}
                      keyboardType="phone-pad"
                      label={t('bankCardNo.label')}
                      placeholder={t('bankCardNo.placeholder')}
                      key="bankCardNo_card"
                      mask={'[0000] [0000] [0000] [0000] [00]'}
                      onChangeText={(text: string, extracted?: string) => {
                        setFieldValue('newBankCardNo', extracted || '')
                        dispatch({ type: 'newBankCardNo', value: extracted || '' })
                      }}
                    />
                  ) : (
                    <MaskInput
                      onChangeText={(text: string, extracted?: string) => {
                        setFieldValue('newBankCardNo', extracted || '')
                        dispatch({ type: 'newBankCardNo', value: extracted || '' })
                      }}
                      onFocus={() =>
                        behavior.setStartModify('P07_C01_I_BANKCARDNO', state.newBankCardNo)
                      }
                      onBlur={() =>
                        behavior.setEndModify('P07_C01_I_BANKCARDNO', state.newBankCardNo)
                      }
                      value={state.newBankCardNo}
                      field={'newBankCardNo'}
                      keyboardType="phone-pad"
                      label={t('bankCardNo.label')}
                      placeholder={t('bankCardNo.placeholder')}
                      key="bankCardNo_clabe"
                      mask={'[0000] [0000] [0000] [0000]'}
                    />
                  )}
                  <ValidateCode
                    field="validateCode"
                    label={t('validateCode.label')}
                    onChangeText={handleChange('validateCode')}
                    value={values.validateCode}
                    onClear={() => setFieldValue('validateCode', '')}
                    placeholder={t('validateCode.placeholder')}
                    error={errors.validateCode}
                    validateCodeType="MODIFY_BANKCARD"
                    phone={context.user?.phone || ''}
                    keyboardType="number-pad"
                  />
                  <View
                    style={{
                      backgroundColor: '#fff',
                      flexDirection: 'row',
                    }}>
                    <Hint
                      img={require('@/assets/compressed/apply/loan_guarantee.webp')}
                      hint={t('fillBankCodePrompt')}
                      hintColor="#626366"
                    />
                  </View>
                </View>

                <View style={PageStyles.btnWrap}>
                  <ApplyButton type={isValid ? 'primary' : undefined} onPress={handleSubmit}>
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

type FormModel = BankInfoParameter
interface Step7State extends FormModel {
  bankArray: Dict[]
  bankCardNo: string
  bankCode: string
  newBankCardNo: string
  validateCode: string
  cardNoType: string
  customerId: number
  cardNoTypeArray: Dict[]
}

type Step7Action =
  | {
      type: 'bankArray'
      value: Dict[]
    }
  | {
      type: 'bankCode'
      value: string
    }
  | {
      type: 'cardNoTypeArray'
      value: Dict[]
    }
  | {
      type: 'newBankCardNo'
      value: string
    }
  | {
      type: 'cardNoType'
      value: string
    }
