import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import { object, string } from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, PhotoPicker } from '@components/form'
import { Color } from '@/styles/color'
import type { ApplyStep4Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'

type FormModel = Omit<ApplyStep4Parameter, 'applyId' | 'currentStep' | 'totalSteps' | 'images'> & {
  idcard1: string
  idcard2: string
}
export const Step4 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = object().shape({
    idcard1: string().required(t('idcard1.required')),
    idcard2: string().required(t('idcard2.required')),
  })
  const initialValue: FormModel = { idcard1: '', idcard2: '' }
  const onSubmit = debounce(
    (values: FormModel) => {
      submit<'4'>({
        images: [{ imageId: +values.idcard1 || 0 }, { imageId: +values.idcard2 || 0 }],
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 4,
        totalSteps: TOTAL_STEPS,
      }).then(res => {
        navigation.navigate('Step5', { ocrResult: res.ocrResult })
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
            validationSchema={schema}>
            {({ handleSubmit, isValid, setFieldValue, errors }) => {
              return (
                <>
                  <View style={PageStyles.form}>
                    <Text>{t('take-photo-title')}</Text>
                    <PhotoPicker
                      field="idcard1"
                      key="idcard1"
                      hint={t('take-photo-hint-1')}
                      title={t('take-photo-title')}
                      bg={require('@assets/compressed/apply/id1.webp')}
                      imageType="INE_OR_IFE_FRONT"
                      cameraType="front"
                      onUploadSuccess={id => setFieldValue('idcard1', id)}
                      reportExif={exif => {
                        setExif(exif)
                        behavior.setModify('P04_C01_S_IDCARD_FRONT', exif, oldExif || '')
                      }}
                      isSupplement="N"
                      error={errors.idcard1}
                    />
                    <PhotoPicker
                      field="idcard2"
                      key="idcard2"
                      hint={t('take-photo-hint-2')}
                      bg={require('@assets/compressed/apply/id2.webp')}
                      imageType="INE_OR_IFE_BACK"
                      cameraType="back"
                      onUploadSuccess={id => setFieldValue('idcard2', id)}
                      reportExif={exif => {
                        setExif(exif)
                        behavior.setModify('P04_C01_S_IDCARD_BACK', exif, oldExif || '')
                      }}
                      isSupplement="N"
                      error={errors.idcard2}
                    />
                  </View>
                  <View style={PageStyles.btnWrap}>
                    <ApplyButton type={isValid ? 'primary' : 'ghost'} onPress={handleSubmit}>
                      <Text color={isValid ? '#fff' : '#aaa'}>{t('submit')}</Text>
                    </ApplyButton>
                  </View>
                </>
              )
            }}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
