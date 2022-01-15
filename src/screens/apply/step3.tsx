import { NativeStackHeaderProps } from '@react-navigation/native-stack'
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

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_BEHAVIOR_DATA } from '@/utils/constant'
import { ApplyButton, Input, NormalPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { ApplyParameter, ApplyStep3Parameter, Contact } from '@/typings/apply'
import { useLoction } from '@/hooks'
import { useFocusEffect } from '@react-navigation/native'
import { BehaviorModel } from '@/typings/behavior'
import Behavior from '@/utils/behavior'
import { MMKV } from '@/utils/storage'
import { useWindowSize } from 'usehooks-ts'
import { fetchDict, submit } from '@/services/apply'
import { MoneyyaContext } from '@/state'
import { Dict, DictField } from '@/typings/response'
import FormGap from '@components/FormGap'

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
      console.log(values, 'Step4')
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
        applyId: 0,
        currentStep: 0,
        totalSteps: 0,
      })
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
  const scrollviewRef = useRef<ScrollView>(null)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel> initialValues={state} onSubmit={onSubmit} validationSchema={schema}>
            {({ handleChange, handleSubmit, isValid, setFieldValue, values, errors }) => (
              <>
                <View style={PageStyles.form}>
                  <FormGap title="Relation Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={record => {
                      setFieldValue('contactRelationCode1', record)
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
                    value={values.contactRelationCode1}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={handleChange('contactName1')}
                    onClear={() => {
                      setFieldValue('contactName1', '')
                    }}
                    value={values.contactName1}
                    field={'contactName1'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    field="contactPhone1"
                    label={t('contactPhone.label')}
                    onChangeText={handleChange('contactPhone1')}
                    value={values.contactPhone1}
                    onClear={() => setFieldValue('contactPhone1', '')}
                    placeholder={t('contactPhone.placeholder')}
                    error={errors.contactPhone1}
                  />
                  <FormGap title="Other Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={record => {
                      setFieldValue('contactRelationCode2', record)
                      dispatch({ type: 'updateContactRelation1', value: record })
                      behavior.setModify(
                        'P03_C01_S_RELATIONSHIP',
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
                    value={values.contactRelationCode2}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={handleChange('contactName2')}
                    onClear={() => {
                      setFieldValue('contactName2', '')
                    }}
                    value={values.contactName2}
                    field={'contactName2'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    field="contactPhone2"
                    label={t('contactPhone.label')}
                    onChangeText={handleChange('contactPhone2')}
                    value={values.contactPhone2}
                    onClear={() => setFieldValue('contactPhone2', '')}
                    placeholder={t('contactPhone.placeholder')}
                    error={errors.contactPhone2}
                  />
                  <FormGap title="Other Contact" />
                  <NormalPicker
                    scrollViewRef={scrollviewRef}
                    onChange={record => {
                      console.log(record)
                      setFieldValue('contactRelationCode3', record)
                      dispatch({ type: 'updateContactRelation3', value: record })
                      behavior.setModify(
                        'P03_C01_S_RELATIONSHIP',
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
                    value={values.contactRelationCode3}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    onChangeText={handleChange('contactName3')}
                    onClear={() => {
                      setFieldValue('contactName3', '')
                    }}
                    value={values.contactName3}
                    field={'contactName3'}
                    label={t('contactName.label')}
                    placeholder={t('contactName.placeholder')}
                  />
                  <Input
                    scrollViewRef={scrollviewRef}
                    field="contactPhone3"
                    label={t('contactPhone.label')}
                    onChangeText={handleChange('contactPhone3')}
                    value={values.contactPhone3}
                    onClear={() => setFieldValue('contactPhone3', '')}
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
