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
import { ApplyButton, PhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep6Parameter } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'

type FormModel = Omit<ApplyStep6Parameter, keyof ApplyParameter> & {
  handId: string
}
export const Step62 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = object().shape({
    handId: string().required(t('idcard.required')),
  })

  const initialValue: FormModel = {
    handId: '',
  }
  const onSubmit = debounce(
    (values: FormModel) => {
      submit<'6'>({
        images: [{ imageId: values ? +values.handId : 0 }],
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 6,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        navigation.navigate('Step7')
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  const behavior = useBehavior<'P06'>('P06', 'P06_C00', 'P06_C99')
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
            {({ handleSubmit, isValid, setFieldValue, errors }) => (
              <>
                <View style={PageStyles.form}>
                  <PhotoPicker
                    field="handId"
                    key="handId"
                    bg={require('@assets/compressed/apply/id1.webp')}
                    imageType="HANDHELD_IDCARD"
                    cameraType="front"
                    onUploadSuccess={id => {
                      setFieldValue('handId', id)
                    }}
                    reportExif={exif => {
                      setExif(exif)
                      behavior.setModify('P06_C01_S_HANDIDCARD', exif, oldExif || '')
                    }}
                    isSupplement="N"
                    error={errors.handId}
                    hint={t('providehandleIDcardPrompt')}
                  />
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
