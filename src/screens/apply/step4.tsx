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
import { ApplyButton, IdcardPhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyStep4Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { MoneyyaContext } from '@/state'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'

type FormModel = Omit<ApplyStep4Parameter, 'applyId' | 'currentStep' | 'totalSteps'> & {
  idcard1?: string
  idcard2?: string
}
export const Step4 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    idcard1: Yup.string().required(t('idcard1.required')),
    idcard2: Yup.string().required(t('idcard2.required')),
  })
  const context = useContext(MoneyyaContext)
  const initialValue = useMemo<FormModel>(() => ({ images: [] }), [])
  const [id1, setId1] = useState<number>(0)
  const [id2, setId2] = useState<number>(0)
  const onSubmit = debounce(
    () => {
      submit({
        images: [{ imageId: id1 }, { imageId: id2 }],
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
            {({ handleSubmit, isValid, setFieldValue, errors }) => (
              <>
                <View style={PageStyles.form}>
                  <IdcardPhotoPicker
                    field="idcard1"
                    label={'El frente de tu ID'}
                    bg={require('@assets/images/apply/id1.webp')}
                    imageType="INE_OR_IFE_FRONT"
                    cameraType="front"
                    onUploadSuccess={id => {
                      setFieldValue('idcard1', id)
                      setId1(id)
                    }}
                    reportExif={exif => behavior.setModify('P04_C01_S_XX1', exif, '')}
                    isSupplement="N"
                    error={errors.idcard1}
                  />
                  <IdcardPhotoPicker
                    field="idcard2"
                    label={'La parte trasera de tu ID'}
                    bg={require('@assets/images/apply/id2.webp')}
                    imageType="INE_OR_IFE_BACK"
                    cameraType="back"
                    onUploadSuccess={id => {
                      setFieldValue('idcard2', id)
                      setId2(id)
                    }}
                    reportExif={exif => behavior.setModify('P04_C02_S_XX2', exif, '')}
                    isSupplement="N"
                    error={errors.idcard2}
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
