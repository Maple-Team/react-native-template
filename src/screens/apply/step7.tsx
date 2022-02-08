import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { type Reducer, useEffect, useReducer } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { Hint, PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, NormalPicker, MaskInput } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep7Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import type { Dict, DictField } from '@/typings/response'
import { MMKV } from '@/utils'
import { fetchDict, submit } from '@/services/apply'
import { REGEX_BANK_CARD, REGEX_BANK_CLABE } from '@/utils/reg'

export const Step7 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    bankCardNo: Yup.string()
      .when('cardNoType', {
        is: 'CARD',
        then: Yup.string().matches(REGEX_BANK_CARD, t('bankCardNo.invalid')),
      })
      .when('cardNoType', {
        is: 'ACCOUNT',
        then: Yup.string().matches(REGEX_BANK_CLABE, t('bankCardNo.invalid')),
      })
      .required(t('bankCardNo.required')),
    bankCode: Yup.string().required(t('bankCode.required')),
    cardNoType: Yup.string().required(t('cardNoType.required')),
  })

  const onSubmit = debounce(
    (values: FormModel) => {
      submit<'7'>({
        ...values,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 7,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        navigation.navigate('Step8')
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const [state, dispatch] = useReducer<Reducer<Step7State, Step7Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'bankArray':
          return { ...s, bankArray: value }
        case 'bankCardNo':
          return { ...s, bankCardNo: value }
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
      bankCardNo: '',
      bankCode: '',
      cardNoType: 'CARD',
      cardNoTypeArray: [],
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
      <Hint
        img={require('@/assets/compressed/apply/loan_notice.webp')}
        hint={'Tips:ReceiptAs and repayments may be affected by bank working'}
        hintColor={'rgba(255, 50, 50, 1)'}
      />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="always">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            validateOnBlur
            initialValues={state}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue, values }) => (
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
                  {state.cardNoType === 'CARD' ? (
                    <MaskInput
                      onFocus={() =>
                        behavior.setStartModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                      }
                      onBlur={() => behavior.setEndModify('P07_C01_I_BANKCARDNO', state.bankCardNo)}
                      value={state.bankCardNo}
                      field={'bankCardNo'}
                      keyboardType="phone-pad"
                      label={t('bankCardNo.label') + '_card'}
                      placeholder={t('bankCardNo.placeholder')}
                      key="bankCardNo_card"
                      mask={'[0000] [0000] [0000] [0000] [00]'}
                      onChangeText={(text: string, extracted?: string) => {
                        setFieldValue('bankCardNo', extracted || '')
                        dispatch({ type: 'bankCardNo', value: extracted || '' })
                      }}
                    />
                  ) : (
                    <MaskInput
                      onChangeText={(text: string, extracted?: string) => {
                        setFieldValue('bankCardNo', extracted || '')
                        dispatch({ type: 'bankCardNo', value: extracted || '' })
                      }}
                      onFocus={() =>
                        behavior.setStartModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                      }
                      onBlur={() => behavior.setEndModify('P07_C01_I_BANKCARDNO', state.bankCardNo)}
                      value={state.bankCardNo}
                      field={'bankCardNo'}
                      keyboardType="phone-pad"
                      label={t('bankCardNo.label') + '_clabe'}
                      placeholder={t('bankCardNo.placeholder')}
                      key="bankCardNo_clabe"
                      mask={'[0000] [0000] [0000] [0000]'}
                    />
                  )}
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

type FormModel = Omit<ApplyStep7Parameter, keyof ApplyParameter>
interface Step7State extends FormModel {
  bankArray: Dict[]
  bankCardNo: string
  bankCode: string
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
      type: 'bankCardNo'
      value: string
    }
  | {
      type: 'cardNoType'
      value: string
    }
