import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, {
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'
import { useFocusEffect } from '@react-navigation/native'
import { useWindowSize } from 'usehooks-ts'
import { PageStyles, Text, FormGap } from '@/components'
import {
  DEBOUNCE_OPTIONS,
  DEBOUNCE_WAIT,
  KEY_APPLYID,
  KEY_BEHAVIOR_DATA,
  TOTAL_STEPS,
} from '@/utils/constant'
import { MMKV, Behavior, REGEX_PHONE } from '@/utils'
import { ApplyButton, Input, NormalPicker, PhonePicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { useLocation } from '@/hooks'
import { fetchDict, submit } from '@/services/apply'
import { MoneyyaContext } from '@/state'
import type { ApplyParameter, ApplyStep3Parameter, Contact } from '@/typings/apply'
import type { BehaviorModel } from '@/typings/behavior'
import type { Dict, DictField } from '@/typings/response'

export const Step3 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    contactName1: Yup.string().required(t('contactName.required')),
    contactPhone1: Yup.string()
      // .required(t('contactPhone.required'))
      .matches(REGEX_PHONE, t('contactPhone.invalid')),
    contactRelationCode1: Yup.string().required(t('contactRelationCode.required')),
    contactName2: Yup.string().required(t('contactName.required')),
    contactPhone2: Yup.string()
      // .required(t('contactPhone.required'))
      .matches(REGEX_PHONE, t('contactPhone.invalid')),
    contactRelationCode2: Yup.string().required(t('contactRelationCode.required')),
    contactName3: Yup.string().required(t('contactName.required')),
    contactPhone3: Yup.string()
      // .required(t('contactPhone.required'))
      .matches(REGEX_PHONE, t('contactPhone.invalid')),
    contactRelationCode3: Yup.string().required(t('contactRelationCode.required')),
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
        case 'updateContactRelation1':
          return { ...s, contactRelationCode1: value.code, contactRelation1: value.name }
        case 'updateContactRelation2':
          return { ...s, contactRelationCode2: value.code, contactRelation2: value.name }
        case 'updateContactRelation3':
          return { ...s, contactRelationCode3: value.code, contactRelation3: value.name }
        default:
          return { ...s }
      }
    },
    {
      contactName1: '',
      contactPhone1: '',
      contactRelation1: '',
      contactRelationCode1: '',
      contactName2: '',
      contactPhone2: '',
      contactRelation2: '',
      contactRelationCode2: '',
      contactName3: '',
      contactPhone3: '',
      contactRelation3: '',
      contactRelationCode3: '',
      contactRelation: [],
      otherContactRelation: [],
    }
  )
  useEffect(() => {
    const queryDict = async () => {
      const dicts: DictField[] = ['RELATIONSHIP', 'OTHER_RELATIONSHIP']
      dicts.forEach(field =>
        fetchDict(field)
          .then(value => {
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
      const contacts: Contact[] = []
      for (let index = 1; index <= 3; index++) {
        contacts.push({
          //@ts-ignore
          contactName: values[`contactName${index}`],
          //@ts-ignore
          contactPhone: values[`contactPhone${index}`],
          //@ts-ignore
          contactRelation: values[`contactRelation${index}`],
          //@ts-ignore
          contactRelationCode: values[`contactRelationCode${index}`],
        })
      }
      submit({
        contacts,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 3,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        navigation.navigate('Step4')
      })
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

  useLocation()

  useFocusEffect(
    useCallback(() => {
      behavior.setEnterPageTime('P03_C00')
      return () => {
        behavior.setLeavePageTime('P03_C99')
      }
    }, [behavior])
  )
  const scrollviewRef = useRef<ScrollView>(null)

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView ref={scrollviewRef} style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={state}
            onSubmit={onSubmit}
            validationSchema={schema}
            validateOnBlur
            validateOnChange>
            {({ handleSubmit, isValid, setFieldValue, errors }) => (
              <>
                <View style={PageStyles.form}>
                  <FormGap title="Relation Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={record => {
                      setFieldValue('contactRelationCode1', record.code)
                      dispatch({ type: 'updateContactRelation1', value: record })
                      behavior.setModify(
                        'P03_C01_S_RELATIONSHIP',
                        record.code,
                        state.contactRelationCode1
                      )
                    }}
                    title={t('contactRelationCode.label')}
                    field={'contactRelationCode1'}
                    label={t('contactRelationCode.label')}
                    placeholder={t('contactRelationCode.placeholder')}
                    dataSource={state.contactRelation}
                    error={errors.contactRelationCode1}
                    value={state.contactRelationCode1}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('contactName1', text)
                      dispatch({ type: 'updateContactName1', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('contactName1', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P03_C01_I_CONTACTNAME', state.contactName1)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P03_C01_I_CONTACTNAME', state.contactName1)
                    }}
                    value={state.contactName1}
                    field={'contactName1'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <PhonePicker
                    scrollViewRef={scrollviewRef}
                    field="contactPhone1"
                    label={t('contactPhone.label')}
                    onChange={text => {
                      setFieldValue('contactPhone1', text)
                      dispatch({ type: 'updateContactPhone1', value: text })
                      behavior.setModify('P03_C02_S_CONTACTPHONE', text, state.contactPhone1)
                    }}
                    value={state.contactPhone1}
                    placeholder={t('contactPhone.placeholder')}
                    error={errors.contactPhone1}
                  />
                  <FormGap title="Other Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={record => {
                      setFieldValue('contactRelationCode2', record.code)
                      dispatch({ type: 'updateContactRelation2', value: record })
                      behavior.setModify(
                        'P03_C03_S_RELATIONSHIP',
                        record.code,
                        state.contactRelationCode2
                      )
                    }}
                    title={t('contactRelationCode.label')}
                    field={'contactRelationCode2'}
                    label={t('contactRelationCode.label')}
                    placeholder={t('contactRelationCode.placeholder')}
                    dataSource={state.otherContactRelation}
                    error={errors.contactRelationCode2}
                    value={state.contactRelationCode2}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('contactName2', text)
                      dispatch({ type: 'updateContactName2', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('contactName2', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P03_C02_I_CONTACTNAME', state.contactName1)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P03_C02_I_CONTACTNAME', state.contactName1)
                    }}
                    value={state.contactName2}
                    field={'contactName2'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <PhonePicker
                    scrollViewRef={scrollviewRef}
                    field="contactPhone2"
                    label={t('contactPhone.label')}
                    onChange={text => {
                      setFieldValue('contactPhone2', text)
                      dispatch({ type: 'updateContactPhone2', value: text })
                      behavior.setModify('P03_C04_S_CONTACTPHONE', text, state.contactPhone2)
                    }}
                    value={state.contactPhone2}
                    placeholder={t('contactPhone.placeholder')}
                    error={errors.contactPhone2}
                  />
                  <FormGap title="Other Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={record => {
                      console.log(record)
                      setFieldValue('contactRelationCode3', record.code)
                      dispatch({ type: 'updateContactRelation3', value: record })
                      behavior.setModify(
                        'P03_C05_S_RELATIONSHIP',
                        record.code,
                        state.contactRelationCode3
                      )
                    }}
                    title={t('contactRelationCode.label')}
                    field={'contactRelationCode3'}
                    label={t('contactRelationCode.label')}
                    placeholder={t('contactRelationCode.placeholder')}
                    dataSource={state.otherContactRelation}
                    error={errors.contactRelationCode3}
                    value={state.contactRelationCode3}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('contactName3', text)
                      dispatch({ type: 'updateContactName3', value: text })
                    }}
                    onClear={() => {
                      setFieldValue('contactName3', '')
                    }}
                    onFocus={() => {
                      behavior.setStartModify('P03_C03_I_CONTACTNAME', state.contactName3)
                    }}
                    onBlur={() => {
                      behavior.setEndModify('P03_C03_I_CONTACTNAME', state.contactName3)
                    }}
                    value={state.contactName3}
                    field={'contactName3'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <PhonePicker
                    scrollViewRef={scrollviewRef}
                    field="contactPhone3"
                    label={t('contactPhone.label')}
                    onChange={text => {
                      setFieldValue('contactPhone3', text)
                      dispatch({ type: 'updateContactPhone3', value: text })
                      behavior.setModify('P03_C06_S_CONTACTPHONE', text, state.contactPhone3)
                    }}
                    value={state.contactPhone3}
                    placeholder={t('contactPhone.placeholder')}
                    error={errors.contactPhone3}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : 'ghost'}
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

type FormModel = Omit<ApplyStep3Parameter, keyof (ApplyParameter & { contacts: Contact[] })> &
  Step3State
interface Step3State {
  contactName1: string
  contactPhone1: string
  contactRelation1: string
  contactRelationCode1: string
  contactName2: string
  contactPhone2: string
  contactRelation2: string
  contactRelationCode2: string
  contactName3: string
  contactPhone3: string
  contactRelation3: string
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
      type: 'updateContactRelation1'
      value: Dict
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
      type: 'updateContactRelation2'
      value: Dict
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
      type: 'updateContactRelation3'
      value: Dict
    }
