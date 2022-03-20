import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { type Reducer, useEffect, useReducer, useState } from 'react'
import { View, StatusBar, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { string, object } from 'yup'
import debounce from 'lodash.debounce'

import { Hint, PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, NormalPicker, MaskInput } from '@components/form'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep7Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import type { Dict, DictField } from '@/typings/response'
import { MMKV } from '@/utils'
import { fetchDict, submit } from '@/services/apply'
import { REGEX_BANK_CARD, REGEX_BANK_CLABE } from '@/utils/reg'

export const Step7 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = object().shape({
    bankCardNo: string()
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
  })

  const onSubmit = () => {
    setVisible(true)
  }
  const onRealSubmit = debounce(
    () => {
      const values = {
        bankCode: state.bankCode,
        cardNoType: state.cardNoType,
        bankCardNo: state.bankCardNo,
      }
      submit<'7'>({
        ...values,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 7,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        MMKV.setMapAsync('step7Data', {
          ...values,
          bankCodeName: state.bankCodeName,
          cardNoTypeName: state.cardNoTypeName,
        })
        navigation.navigate('Step8', {
          bankCardNo: state.bankCardNo,
          bankCode: state.bankCode,
          cardNoType: state.cardNoType,
        })
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const step7Data = (MMKV.getMap('step7Data') as Partial<Step7State>) || {}

  const [state, dispatch] = useReducer<Reducer<Step7State, Step7Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'bankArray':
          return { ...s, bankArray: value }
        case 'bankCardNo':
          return { ...s, bankCardNo: value }
        case 'bankCode':
          MMKV.setString('bankCodeName', value.name)
          return { ...s, bankCode: value.code, bankCodeName: value.name }
        case 'cardNoTypeArray':
          return { ...s, cardNoTypeArray: value }
        case 'cardNoType':
          MMKV.setString('cardNoTypeName', value.name)
          return { ...s, cardNoType: value.code, cardNoTypeName: value.name }
        default:
          return { ...s }
      }
    },
    {
      bankArray: [],
      bankCardNo: step7Data.bankCardNo || '',
      bankCode: step7Data.bankCode || '',
      cardNoType: step7Data.cardNoType || 'CARD',
      bankCodeName: step7Data.bankCodeName || MMKV.getString('bankCodeName') || '',
      cardNoTypeName: step7Data.cardNoTypeName || MMKV.getString('cardNoTypeName') || 'CARD',
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
  const [visible, setVisible] = useState<boolean>(false)

  const behavior = useBehavior<'P07'>('P07', 'P07_C00', 'P07_C99')
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      {!visible ? (
        <>
          <View style={{ paddingHorizontal: 37, backgroundColor: '#fff', flexDirection: 'row' }}>
            <Hint
              img={require('@/assets/compressed/apply/loan_notice.webp')}
              hint={t('bankCodePrompt')}
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
                {({ handleSubmit, isValid, setFieldValue, values, errors }) => (
                  <>
                    <View style={PageStyles.form}>
                      <NormalPicker
                        onChange={({ code, name }) => {
                          setFieldValue('bankCode', code)
                          dispatch({ type: 'bankCode', value: { code, name } })
                          behavior.setModify('P07_C01_S_BANKCODE', code, state.bankCode)
                        }}
                        key="bankCode"
                        value={state.bankCode}
                        title={t('bankCode.label')}
                        field={'bankCode'}
                        label={t('bankCode.label')}
                        placeholder={t('bankCode.label')}
                        dataSource={state.bankArray}
                      />
                      <NormalPicker
                        onChange={({ code, name }) => {
                          setFieldValue('cardNoType', code)
                          dispatch({ type: 'cardNoType', value: { code, name } })
                          behavior.setModify('P07_C01_S_CARDNOTYPE', code, state.cardNoType)
                        }}
                        key="bankCardType"
                        value={values.cardNoType}
                        title={t('cardNoType.label')}
                        field={'cardNoType'}
                        label={t('cardNoType.label')}
                        placeholder={t('cardNoType.label')}
                        dataSource={state.cardNoTypeArray}
                      />
                      {state.cardNoType === 'CARD' ? (
                        <MaskInput
                          onFocus={() =>
                            behavior.setStartModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                          }
                          onBlur={() =>
                            behavior.setEndModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                          }
                          value={state.bankCardNo}
                          field={'bankCardNo'}
                          keyboardType="phone-pad"
                          error={errors.bankCardNo}
                          label={t('bankCardNo.label')}
                          placeholder={t('bankCardNo.label')}
                          key="bankCardNo_card"
                          mask={'[0000] [0000] [0000] [0000]'}
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
                          onBlur={() =>
                            behavior.setEndModify('P07_C01_I_BANKCARDNO', state.bankCardNo)
                          }
                          value={state.bankCardNo}
                          field={'bankCardNo'}
                          error={errors.bankCardNo}
                          keyboardType="phone-pad"
                          label={t('bankCardNo.label')}
                          placeholder={t('bankCardNo.label')}
                          key="bankCardNo_clabe"
                          mask={'[0000] [0000] [0000] [0000] [00]'}
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
        </>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#AFAFAF',
            justifyContent: 'center',
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 27.5,
            }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 14 }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingTop: 47,
                  paddingBottom: 33.5,
                }}>
                <View
                  style={{
                    padding: 13,
                    width: 75 + 13,
                    height: 75 + 13,
                    borderRadius: (75 + 13) / 2,
                    top: -(75 + 13) / 2,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                  }}>
                  <Image
                    source={require('@/assets/compressed/additional/bank.webp')}
                    resizeMode="cover"
                  />
                </View>
                <Text color="#333030" fontSize={18} fontFamily="Arial-BoldMT" fontWeight="bold">
                  {t('informationConfirmed')}
                </Text>
              </View>
              <View style={{ paddingVertical: 10, paddingHorizontal: 11 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    fontSize={13}
                    color="#333030" //@ts-ignore
                    styles={{ marginRight: 10 }}>
                    {t('bankCode.label')}:
                  </Text>
                  <Text color="#333030" fontSize={15} fontWeight="bold" fontFamily="Arial-BoldMT">
                    {state.bankCodeName}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    fontSize={13}
                    color="#333030" //@ts-ignore
                    styles={{ marginRight: 10 }}>
                    {t('cardNoType.label')}:
                  </Text>
                  <Text color="#333030" fontSize={15} fontWeight="bold" fontFamily="Arial-BoldMT">
                    {state.cardNoTypeName}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    fontSize={13}
                    color="#333030" //@ts-ignore
                    styles={{ marginRight: 10 }}>
                    {t('bankCardNo.label')}:
                  </Text>
                  <Text color="#333030" fontSize={15} fontWeight="bold" fontFamily="Arial-BoldMT">
                    {state.bankCardNo}
                  </Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 14.5, paddingBottom: 47, flexDirection: 'row' }}>
                <Hint
                  img={require('@/assets/compressed/apply/loan_notice.webp')}
                  hint={t('backCodeValidPrompt')}
                  hintColor={'rgba(255, 50, 50, 1)'}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Pressable
                  //@ts-ignore
                  onPress={onRealSubmit}
                  style={{
                    width: '50%',
                    backgroundColor: Color.primary,
                    borderRadius: 0,
                    borderBottomLeftRadius: 14,
                    paddingVertical: 17,
                    alignItems: 'center',
                  }}>
                  <Text color="#fff" fontSize={17}>
                    {t('submit')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setVisible(false)
                  }}
                  style={{
                    width: '50%',
                    backgroundColor: '#E3E3E3',
                    borderRadius: 0,
                    borderBottomRightRadius: 14,
                    paddingVertical: 17,
                    alignItems: 'center',
                  }}>
                  <Text color="#909090" fontSize={17}>
                    {t('modify')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

type FormModel = Omit<ApplyStep7Parameter, keyof ApplyParameter>
interface Step7State extends FormModel {
  bankArray: Dict[]
  bankCardNo: string
  bankCode: string
  bankCodeName: string
  cardNoTypeName: string
  cardNoTypeArray: Dict[]
}

type Step7Action =
  | {
      type: 'bankArray'
      value: Dict[]
    }
  | {
      type: 'bankCode'
      value: Dict
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
      value: Dict
    }
