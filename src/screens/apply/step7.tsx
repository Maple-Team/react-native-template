import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { Reducer, useReducer } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, Input, NormalPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep7Parameter, BankCardType } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import type { Dict } from '@/typings/response'
import { MMKV } from '@/utils'
import { submit } from '@/services/apply'

export const Step7 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    bankCardNo: Yup.string().required(t('bankCardNo.required')), // FIXME 关联
    bankCode: Yup.string().required(t('bankCode.required')),
    cardNoType: Yup.string().required(t('cardNoType.required')),
  })

  const onSubmit = debounce(
    (values: FormModel) => {
      submit({
        ...values,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 7,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        console.log(behavior.getCurrentModel())
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
    }
  )
  useLocation()

  const behavior = useBehavior<'P07'>('P07', 'P07_C00', 'P07_C99')

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel> initialValues={state} onSubmit={onSubmit} validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    onChange={function (record: Dict): void {
                      setFieldValue('bankCode', record)
                      dispatch({ type: 'bankCode', value: record.code })
                      behavior.setModify('P07_C01_S_BANKCODE', record.code, state.bankCode)
                    }}
                    value={state.bankCode}
                    title={t('bankcode.label')}
                    field={'bankCode'}
                    label={t('bankcode.label')}
                    placeholder={t('bankcode.placeholder')}
                    dataSource={state.bankArray}
                  />
                  <Input
                    onChangeText={function (text: string): void {
                      setFieldValue('bankCardNo', text)
                      dispatch({ type: 'bankCardNo', value: text })
                    }}
                    onClear={function (): void {
                      setFieldValue('bankCardNo', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                    }}
                    value={state.bankCardNo}
                    field={'bankCardNo'}
                    label={t('bankCardNo.label')}
                    placeholder={t('bankCardNo.placeholder')}
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

type FormModel = Omit<ApplyStep7Parameter, keyof ApplyParameter>
interface Step7State extends FormModel {
  bankArray: Dict[]
  bankCardNo: string
  bankCode: string
  cardNoType: BankCardType
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
      type: 'cardNoType'
      value: BankCardType
    }
  | {
      type: 'bankCardNo'
      value: string
    }
