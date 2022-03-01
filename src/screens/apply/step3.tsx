import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { type Reducer, useContext, useEffect, useReducer, useRef } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { object, string } from 'yup'
import debounce from 'lodash.debounce'
import { PageStyles, Text, FormGap } from '@/components'
import {
  DEBOUNCE_OPTIONS,
  DEBOUNCE_WAIT,
  KEY_APPLYID,
  KEY_CONTACTS,
  TOTAL_STEPS,
} from '@/utils/constant'
import { MMKV, REGEX_PHONE } from '@/utils'
import { ApplyButton, Input, NormalPicker, PhonePicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { useBehavior, useLocation } from '@/hooks'
import { fetchDict, MoneyyaContact, submit, uploadAllContacts } from '@/services/apply'
import { default as MoneyyaContext } from '@/state'
import type { ApplyParameter, ApplyStep3Parameter, Contact } from '@/typings/apply'
import type { Dict, DictField } from '@/typings/response'

export const Step3 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  //TODO fromOther==='Y' 少填一个联系人
  const context = useContext(MoneyyaContext)
  const fromOther = context.user?.fromOther
  console.log(fromOther)
  const schema = object().shape({
    contactName1: string().max(100, t('contactName.invalid')).required(t('contactName.required')),
    contactPhone1: string()
      .required(t('contactPhone.required'))
      .typeError(t('contactPhone.invalid'))
      .matches(REGEX_PHONE, t('contactPhone.invalid')),
    contactRelationCode1: string().required(t('contactRelationCode.required')),
    contactName2: string().max(100, t('contactName.invalid')).required(t('contactName.required')),
    contactPhone2: string()
      .typeError(t('contactPhone.invalid'))
      .required(t('contactPhone.required'))
      .matches(REGEX_PHONE, t('contactPhone.invalid')),
    contactRelationCode2: string().required(t('contactRelationCode.required')),
    // fromOther==='Y'
    contactName3: string().max(100, t('contactName.invalid')).required(t('contactName.required')),
    contactPhone3: string()
      .required(t('contactPhone.required'))
      .typeError(t('contactPhone.invalid'))
      .matches(REGEX_PHONE, t('contactPhone.invalid')),
    contactRelationCode3: string().required(t('contactRelationCode.required')),
  })

  const step3Data = (MMKV.getMap('step3Data') as Partial<Step3State>) || {}
  const [state, dispatch] = useReducer<Reducer<Step3State, Step3Action>>(
    (s, { type, value }) => {
      switch (type) {
        case 'updateContactRelation':
          return { ...s, contactRelationArray: value }
        case 'updateOtherContactRelation':
          return { ...s, otherContactRelationArray: value }
        case 'updateContactName1':
          return { ...s, contactName1: value }
        case 'updateContactName2':
          return { ...s, contactName2: value }
        case 'updateContactName3':
          return { ...s, contactName3: value }
        case 'updateContactPhone1':
          return { ...s, contactPhone1: value }
        case 'updateContactPhone2':
          return { ...s, contactPhone2: value }
        case 'updateContactPhone3':
          return { ...s, contactPhone3: value }
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
      contactName1: step3Data.contactName1 || '',
      contactPhone1: step3Data.contactPhone1 || '',
      contactRelation1: step3Data.contactRelation1 || '',
      contactRelationCode1: step3Data.contactRelationCode1 || '',
      contactName2: step3Data.contactName2 || '',
      contactPhone2: step3Data.contactPhone2 || '',
      contactRelation2: step3Data.contactRelation2 || '',
      contactRelationCode2: step3Data.contactRelationCode2 || '',
      contactName3: step3Data.contactName3 || '',
      contactPhone3: step3Data.contactPhone3 || '',
      contactRelation3: step3Data.contactRelation3 || '',
      contactRelationCode3: step3Data.contactRelationCode3 || '',
      contactRelationArray: [],
      otherContactRelationArray: [],
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
          .catch(console.error)
      )
    }
    queryDict()
  }, [])
  const onSubmit = debounce(
    (values: FormModel) => {
      const contacts: Contact[] = []
      const length = fromOther === 'Y' ? 2 : 3
      for (let index = 1; index <= length; index++) {
        contacts.push({
          //@ts-ignore
          contactName: state[`contactName${index}`],
          //@ts-ignore
          contactPhone: state[`contactPhone${index}`],
          //@ts-ignore
          contactRelation: state[`contactRelation${index}`],
          //@ts-ignore
          contactRelationCode: state[`contactRelationCode${index}`],
        })
      }
      submit<'3'>({
        contacts,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 3,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        MMKV.setMapAsync('step3Data', values)
        uploadAllContacts({
          list: (MMKV.getArray(KEY_CONTACTS) as MoneyyaContact[]) || [],
          applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
          idcard: '',
          phone: '',
        })
          .then(r => console.log('----------------uploadAllContacts--------------', r))
          .catch(console.error)
        navigation.navigate('Step4')
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  const behavior = useBehavior<'P03'>('P03', 'P03_C00', 'P03_C99')
  useLocation()
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
            validateOnBlur>
            {({ handleSubmit, isValid, errors, setFieldValue }) => (
              <>
                <View style={PageStyles.form}>
                  <FormGap title="Relation Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={({ code, name }) => {
                      setFieldValue('contactRelationCode1', code)
                      dispatch({ type: 'updateContactRelation1', value: { code, name } })
                      behavior.setModify('P03_C01_S_RELATIONSHIP', code, state.contactRelationCode1)
                    }}
                    title={t('contactRelationCode.label')}
                    field={'contactRelationCode1'}
                    key={'contactRelationCode1'}
                    label={t('contactRelationCode.label')}
                    placeholder={t('contactRelationCode.placeholder')}
                    dataSource={state.contactRelationArray}
                    error={errors.contactRelationCode1}
                    value={state.contactRelationCode1}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('contactName1', text)
                      dispatch({ type: 'updateContactName1', value: text })
                    }}
                    onFocus={() =>
                      behavior.setStartModify('P03_C01_I_CONTACTNAME', state.contactName1)
                    }
                    onBlur={() =>
                      behavior.setEndModify('P03_C01_I_CONTACTNAME', state.contactName1)
                    }
                    value={state.contactName1}
                    maxLength={100}
                    field={'contactName1'}
                    key={'contactName1'}
                    label={t('contactName.label')}
                    error={errors.contactName1}
                    placeholder={t('contactName.placeholder')}
                  />
                  <PhonePicker
                    scrollViewRef={scrollviewRef}
                    field="contactPhone1"
                    key="contactPhone1"
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
                  <FormGap title={t('otherContact')} />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={({ code, name }) => {
                      setFieldValue('contactRelationCode2', code)
                      dispatch({ type: 'updateContactRelation2', value: { code, name } })
                      behavior.setModify('P03_C03_S_RELATIONSHIP', code, state.contactRelationCode2)
                    }}
                    title={t('contactRelationCode.label')}
                    field={'contactRelationCode2'}
                    key={'contactRelationCode2'}
                    label={t('contactRelationCode.label')}
                    placeholder={t('contactRelationCode.placeholder')}
                    dataSource={state.otherContactRelationArray}
                    error={errors.contactRelationCode2}
                    value={state.contactRelationCode2}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={text => {
                      setFieldValue('contactName2', text)
                      dispatch({ type: 'updateContactName2', value: text })
                    }}
                    onFocus={() =>
                      behavior.setStartModify('P03_C02_I_CONTACTNAME', state.contactName2)
                    }
                    maxLength={100}
                    onBlur={() =>
                      behavior.setEndModify('P03_C02_I_CONTACTNAME', state.contactName2)
                    }
                    value={state.contactName2}
                    field={'contactName2'}
                    key={'contactName2'}
                    error={errors.contactName2}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <PhonePicker
                    scrollViewRef={scrollviewRef}
                    field="contactPhone2"
                    key="contactPhone2"
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
                  {fromOther !== 'Y' && (
                    <>
                      <FormGap title={t('otherContact')} />
                      <NormalPicker
                        scrollViewRef={scrollviewRef}
                        onChange={({ code, name }) => {
                          setFieldValue('contactRelationCode3', code)
                          dispatch({ type: 'updateContactRelation3', value: { code, name } })
                          behavior.setModify(
                            'P03_C05_S_RELATIONSHIP',
                            code,
                            state.contactRelationCode3
                          )
                        }}
                        title={t('contactRelationCode.label')}
                        field={'contactRelationCode3'}
                        key={'contactRelationCode3'}
                        label={t('contactRelationCode.label')}
                        placeholder={t('contactRelationCode.placeholder')}
                        dataSource={state.otherContactRelationArray}
                        error={errors.contactRelationCode3}
                        value={state.contactRelationCode3}
                      />
                      <Input
                        scrollViewRef={scrollviewRef}
                        onChangeText={text => {
                          setFieldValue('contactName3', text)
                          dispatch({ type: 'updateContactName3', value: text })
                        }}
                        maxLength={100}
                        onFocus={() =>
                          behavior.setStartModify('P03_C03_I_CONTACTNAME', state.contactName3)
                        }
                        onBlur={() =>
                          behavior.setEndModify('P03_C03_I_CONTACTNAME', state.contactName3)
                        }
                        value={state.contactName3}
                        field={'contactName3'}
                        key={'contactName3'}
                        error={errors.contactName3}
                        label={t('contactName.label')}
                        placeholder={t('contactName.placeholder')}
                      />
                      <PhonePicker
                        scrollViewRef={scrollviewRef}
                        field="contactPhone3"
                        key="contactPhone3"
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
                    </>
                  )}
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton type={isValid ? 'primary' : 'ghost'} onPress={handleSubmit}>
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
  contactRelationArray: Dict[]
  otherContactRelationArray: Dict[]
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
      value: Pick<Dict, 'code' | 'name'>
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
      value: Pick<Dict, 'code' | 'name'>
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
      value: Pick<Dict, 'code' | 'name'>
    }
