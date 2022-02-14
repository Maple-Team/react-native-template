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
  // TODO 总次数跟随申请单， 防止刷活体接口
  const [errorTimes, setErrorTimes] = useState<number>(0)
  const context = useContext(MoneyyaContext)

  const onSubmit = debounce(
    () => {
      submit<'6'>({
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 6,
        totalSteps: TOTAL_STEPS,
        livenessId: `${imageId}`,
        images: [{ imageId: 2 }],
        livenessAuthFlag: context.brand?.livenessAuthEnable,
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
        console.log({ livenessid, transitionid, isPay })
        // FIXME 无活体id
        // TODO 上传影像信息 base64 type：LIVENESS_IMAGE
        setImageId(+livenessid)
        setValid(true)
        onSubmit()
      },
      (cancel, errorMessage, errorCode) => {
        console.log({ cancel, errorMessage, errorCode })
        setErrorTimes(errorTimes + 1)
      }
    )
  }, [errorTimes, onSubmit])

  useEffect(() => {
    if (errorTimes >= (context.brand?.livenessAuthCount || 100)) {
      navigation.navigate('Step62')
    }
  }, [context.brand?.livenessAuthCount, errorTimes, navigation])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <View style={PageStyles.form}>
            <LivenessPicker
              onPress={startLiveness}
              error={isValid === false ? t('liveness.required') : ''}
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
