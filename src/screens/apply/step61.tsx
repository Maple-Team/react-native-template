import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import debounce from 'lodash.debounce'

import { PageStyles, Text, ToastLoading } from '@/components'
import {
  DEBOUNCE_OPTIONS,
  DEBOUNCE_WAIT,
  KEY_APPLYID,
  KEY_LIVENESS,
  TOTAL_STEPS,
} from '@/utils/constant'
import { ApplyButton, LivenessPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { useLocation } from '@/hooks'
import { submit } from '@/services/apply'
import { MMKV } from '@/utils'
import { Liveness } from '@/modules'
import { default as MoneyyaContext } from '@/state'
import uploadImages from '@/services/upload'

export const Step61 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()

  const [isValid, setValid] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>(false)
  const [livenessId, setLivenessId] = useState<number>()
  // NOTE 总次数跟随申请单， 防止刷活体接口
  const [errorTimes, setErrorTimes] = useState<number>(0)
  const context = useContext(MoneyyaContext)
  const livenessTimes = MMKV.getInt(KEY_LIVENESS) || 0
  const onSubmit = debounce(
    (id: number) => {
      submit<'6'>({
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 6,
        totalSteps: TOTAL_STEPS,
        livenessId: `${livenessId}`,
        images: [{ imageId: id }],
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
    // 当前申请单活体校验次数
    const count = context?.brand ? context?.brand.livenessAuthCount : 0
    if (livenessTimes > count) {
      navigation.navigate('Step62')
    } else {
      Liveness.startLiveness(
        (livenessid, base64, transitionid, isPay) => {
          MMKV.setInt(KEY_LIVENESS, livenessTimes + 1)
          console.log({ livenessid, transitionid, isPay })
          setLivenessId(+livenessid)
          setLoading(true)
          uploadImages({
            response: {
              type: 'image/png', // ?
              base64,
            },
            isSupplement: 'N',
            type: 'LIVENESS_IMAGE',
            onUploadProgress: () => {},
          })
            .then(id => {
              setValid(true)
              onSubmit(id)
              console.log('upload image Id', id)
            })
            .finally(() => setLoading(false))
        },
        (cancel, errorMessage, errorCode) => {
          console.log({ cancel, errorMessage, errorCode })
          MMKV.setInt(KEY_LIVENESS, livenessTimes + 1)
          setErrorTimes(errorTimes + 1)
        }
      )
    }
  }, [context?.brand, errorTimes, livenessTimes, navigation, onSubmit])

  useEffect(() => {
    if (errorTimes >= (context.brand?.livenessAuthCount || 0)) {
      navigation.navigate('Step62')
    }
  }, [context.brand?.livenessAuthCount, errorTimes, navigation])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ToastLoading animating={loading} />
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
