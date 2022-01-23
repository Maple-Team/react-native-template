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
import { ApplyButton, HandPhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyParameter, ApplyStep6Parameter } from '@/typings/apply'
import { useLocation } from '@/hooks'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'
import { MoneyyaContext } from '@/state'

type FormModel = Omit<ApplyStep6Parameter, keyof ApplyParameter>
export const Step62 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({})
  const initialValue = useMemo<FormModel>(
    () => ({
      images: [],
      livenessAuthFlag: 'N',
      livenessId: '',
    }),
    []
  )
  const onSubmit = debounce(
    (values: FormModel) => {
      submit({
        ...values,
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

  useLocation()
  const context = useContext(MoneyyaContext)
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleSubmit, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <HandPhotoPicker
                    onChange={text => {
                      console.log(text)
                    }}
                    field={'idcard'}
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
