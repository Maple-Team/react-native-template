import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useMemo } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { ApplyButton, IdcardPhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyStep4Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks'
import { MoneyyaContext } from '@/state'

type FormModel = Omit<ApplyStep4Parameter, 'applyId' | 'currentStep' | 'totalSteps'>
export const Step4 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    // phone: Yup.string()
    //   .min(10, t('field.short', { field: 'Phone' }))
    //   .max(10, t('field.long', { field: 'Phone' }))
    //   .matches(REGEX_PHONE, t('phone.invalid'))
    //   .required(t('phone.required')),
  })
  const context = useContext(MoneyyaContext)
  const initialValue = useMemo<FormModel>(() => ({ images: [] }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values)
      navigation.navigate('Step5')
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  const location = useLoction()
  console.log(location)

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validateOnBlur
            validateOnChange
            validationSchema={schema}>
            {({ handleChange, handleSubmit, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <IdcardPhotoPicker
                    onChange={handleChange('')}
                    field={'ss'}
                    label={'El frente de tu ID'}
                    bg={require('@assets/images/apply/id1.webp')}
                    // error={errors.images}
                  />
                  <IdcardPhotoPicker
                    onChange={handleChange('')}
                    field={'ss'}
                    label={'La parte trasera de tu ID'}
                    bg={require('@assets/images/apply/id2.webp')}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : undefined}
                    onPress={handleSubmit}
                    loading={context.loading.effects.apply}
                    // loading={state}
                  >
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
