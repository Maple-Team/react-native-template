import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton, LivenessPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { useLocation } from '@/hooks'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'
import { Liveness } from '@/modules'
import { default as MoneyyaContext } from '@/state'

export const Step61 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const [isValid, setValid] = useState<Boolean>()
  const [imageId, setImageId] = useState<number>()
  const [errorTimes, setErrorTimes] = useState<number>(0)
  const onSubmit = debounce(
    //FIXME debounce wrapped with callback?
    () => {
      submit({
        images: [{ imageId: imageId || 0 }],
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
  const startLiveness = useCallback(() => {
    Liveness.startLiveness(
      (livenessid, base64, transitionid, isPay) => {
        console.log(livenessid, base64, transitionid, isPay)
        setImageId(+livenessid)
        setValid(true)
        onSubmit()
      },
      (cancel, errorMessage, errorCode) => {
        console.log(cancel, errorMessage, errorCode)
        setErrorTimes(errorTimes + 1)
      }
    )
  }, [errorTimes, onSubmit])
  const context = useContext(MoneyyaContext)
  useEffect(() => {
    if (errorTimes >= (context.barnd?.livenessAuthCount || 100)) {
      navigation.navigate('Step62')
    }
  }, [context.barnd?.livenessAuthCount, errorTimes, navigation])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <View style={PageStyles.form}>
            <LivenessPicker
              onPress={startLiveness}
              error={!isValid ? t('liveness.required') : ''}
            />
          </View>
          <View style={PageStyles.btnWrap}>
            <ApplyButton type={'primary'} onPress={startLiveness}>
              <Text color={'#fff'}>{t('start')}</Text>
            </ApplyButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
