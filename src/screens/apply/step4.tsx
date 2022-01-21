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
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, IdcardPhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyStep4Parameter } from '@/typings/apply'
import { useLocation } from '@/hooks'
import { MoneyyaContext } from '@/state'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'

type FormModel = Omit<ApplyStep4Parameter, 'applyId' | 'currentStep' | 'totalSteps'>
export const Step4 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    idcard1: Yup.string().required(t('idcard1.required')),
    idcard2: Yup.string().required(t('idcard2.required')),
  })
  const context = useContext(MoneyyaContext)
  const initialValue = useMemo<FormModel>(() => ({ images: [] }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      submit({
        ...values,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 4,
        totalSteps: TOTAL_STEPS,
      }).then(res => {
        navigation.navigate('Step5', { orc: res.ocrResult })
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  useLocation()

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
            {({ handleSubmit, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <IdcardPhotoPicker
                    field={'idcard1'}
                    label={'El frente de tu ID'}
                    bg={require('@assets/images/apply/id1.webp')}
                    imageType={undefined}
                    cameraType={'back'}
                    onUploadSuccess={function (id): void {
                      throw new Error('Function not implemented.')
                    }}
                    reportExif={undefined} // error={errors.images}
                  />
                  <IdcardPhotoPicker
                    field={'idcard2'}
                    label={'La parte trasera de tu ID'}
                    bg={require('@assets/images/apply/id2.webp')}
                    imageType={undefined}
                    cameraType={'back'}
                    onUploadSuccess={function (id): void {
                      throw new Error('Function not implemented.')
                    }}
                    reportExif={undefined}
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
