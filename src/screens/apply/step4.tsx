import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useMemo, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, PhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyStep4Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { default as MoneyyaContext } from '@/state'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'

type FormModel = Omit<ApplyStep4Parameter, 'applyId' | 'currentStep' | 'totalSteps'> & {
  idcard: string
}
export const Step4 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    idcard: Yup.string().required(t('idcard1.required')),
  })
  const context = useContext(MoneyyaContext)
  const initialValue = useMemo<FormModel>(() => ({ images: [], idcard: '' }), [])
  const onSubmit = debounce(
    (values: FormModel) => {
      submit<'4'>({
        images: [{ imageId: +values.idcard || 0 }],
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
  const behavior = useBehavior<'P04'>('P04', 'P04_C00', 'P04_C99')
  useLocation()
  const [oldExif, setExif] = useState<string>()
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validateOnBlur
            validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue, errors }) => (
              <>
                <View style={PageStyles.form}>
                  <PhotoPicker
                    field="idcard"
                    key="idcard"
                    hint=""
                    title={'Proporciona tu INE/IFE por favor'}
                    bg={require('@assets/images/apply/id1.webp')}
                    imageType="INE_OR_IFE_BACK"
                    cameraType="back"
                    onUploadSuccess={id => {
                      setFieldValue('idcard', id)
                    }}
                    reportExif={exif => {
                      setExif(exif)
                      behavior.setModify('P04_C01_S_XX1', exif, oldExif || '')
                    }}
                    isSupplement="N"
                    error={errors.idcard}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : undefined}
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
