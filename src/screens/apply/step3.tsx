import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { Reducer, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_BEHAVIOR_DATA } from '@/utils/constant'
import { ApplyButton, Input, NormalPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { ApplyParameter, ApplyStep3Parameter, Contact } from '@/typings/apply'
import { useLoction } from '@/hooks'
import behavior from '@/utils/behavior'
import { useFocusEffect } from '@react-navigation/native'
import { BehaviorModel } from '@/typings/behavior'
import Behavior from '@/utils/behavior'
import { MMKV } from '@/utils/storage'
import { useWindowSize } from 'usehooks-ts'
import { dict } from '@/services/apply'
import { MoneyyaContext } from '@/state'
import { Dict, DictField } from '@/typings/response'

export const Step3 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    contactName: Yup.string().required(t('contactName.required')),
    contactPhone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('contactPhone.invalid'))
      .required(t('contactPhone.required')),
    contactRelationCode: Yup.string().required(t('contactRelationCode.required')),
  })

  const context = useContext(MoneyyaContext)

  const [state, dispatch] = useReducer<Reducer<Step3State, Step3Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'updateContactRelation':
          return { ...s, contactRelation: value }
        case 'updateOtherContactRelation':
          return { ...s, otherContactRelation: value }
        case 'updateContactName1':
          return { ...s, contactName1: value }
        case 'updateContactName2':
          return { ...s, contactName2: value }
        case 'updateContactName3':
          return { ...s, contactName3: value }
        case 'updateContactPhone1':
          return { ...s, contactPhone1: value }
        case 'updateContactPhone2':
          return { ...s, contactPhone1: value }
        case 'updateContactPhone3':
          return { ...s, contactPhone1: value }
        case 'updateContactRelationCode1':
          return { ...s, contactRelationCode1: value }
        case 'updateContactRelationCode2':
          return { ...s, contactRelationCode1: value }
        case 'updateContactRelationCode3':
          return { ...s, contactRelationCode1: value }
        default:
          return { ...s }
      }
    },
    {
      contactName1: '',
      contactPhone1: '',
      contactRelationCode1: '',
      contactName2: '',
      contactPhone2: '',
      contactRelationCode2: '',
      contactName3: '',
      contactPhone3: '',
      contactRelationCode3: '',
      contactRelation: [],
      otherContactRelation: [],
    }
  )
  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = ['RELATIONSHIP', 'OTHER_RELATIONSHIP']
      dicts.forEach(field =>
        dict(field)
          .then(value => {
            console.log(value)
            switch (field) {
              case 'RELATIONSHIP':
                dispatch({ type: 'updateContactRelation', value })
                break
              case 'OTHER_RELATIONSHIP':
                dispatch({ type: 'updateOtherContactRelation', value })
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
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values, 'Step4')
      navigation.navigate('Step4')
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const windowSize = useWindowSize()
  const behavior = useMemo(() => {
    const initModel: BehaviorModel<'P03'> = {
      screenHeight: `${windowSize.height}`,
      screenWidth: `${windowSize.width}`,
      applyId: `${context.user?.applyId}`,
      outerIp: '',
      internalIp: '',
      records: MMKV.getArray(KEY_BEHAVIOR_DATA) || [],
    }
    return new Behavior<'P03'>(initModel)
  }, [context.user?.applyId, windowSize])

  useLoction()

  useFocusEffect(
    useCallback(() => {
      behavior.setEnterPageTime('P03_C00')
      return () => {
        behavior.setLeavePageTime('P03_C99')
      }
    }, [behavior])
  )
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel> initialValues={state} onSubmit={onSubmit} validationSchema={schema}>
            {({ handleChange, handleSubmit, isValid, setFieldValue }) => (
              <>
                <View style={PageStyles.form}>
                  <NormalPicker
                    onChange={text => {
                      console.log(text)
                      // setFieldValue('companyAddrCityCode', text)
                      // dispatch({ type: 'updateCity', value: text })
                      // behavior.setModify('P02_C0x_S_CITY', text, state.companyAddrCityCode)
                    }}
                    title={t('contactName.label')}
                    field={'companyAddrCityCode'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                    dataSource={state.relation}
                    error={errors.contactName}
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

type FormModel = Omit<ApplyStep3Parameter, keyof (ApplyParameter & { contacts: Contact[] })> & {
  contactName1: string
  contactPhone1: string
  contactRelationCode1: string
  contactName2: string
  contactPhone2: string
  contactRelationCode2: string
  contactName3: string
  contactPhone3: string
  contactRelationCode3: string
  contactRelation: Dict[]
  otherContactRelation: Dict[]
}
interface Step3State extends FormModel {
  contactName1: string
  contactPhone1: string
  contactRelationCode1: string
  contactName2: string
  contactPhone2: string
  contactRelationCode2: string
  contactName3: string
  contactPhone3: string
  contactRelationCode3: string
  contactRelation: Dict[]
  otherContactRelation: Dict[]
}
type Step3Action =
  | {
      type: 'updateContactRelation'
      value: Dict[]
    }
  | {
      type: 'updateOtherContactRelation'
      value: Dict[]
    }
  | {
      type: 'updateContactName1'
      value: string
    }
  | {
      type: 'updateContactPhone1'
      value: string
    }
  | {
      type: 'updateContactRelationCode1'
      value: string
    }
  | {
      type: 'updateContactName2'
      value: string
    }
  | {
      type: 'updateContactPhone2'
      value: string
    }
  | {
      type: 'updateContactRelationCode2'
      value: string
    }
  | {
      type: 'updateContactName3'
      value: string
    }
  | {
      type: 'updateContactPhone3'
      value: string
    }
  | {
      type: 'updateContactRelationCode3'
      value: string
    }
