import { Color } from '@/styles/color'
import { PageStyles, Text } from '@/components'
import React, { useCallback, useEffect, useState } from 'react'
import { Pressable, SafeAreaView, StatusBar, View, Image } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { queryClabe, queryPayCode } from '@/services/order'
import { ScrollView } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import emitter from '@/eventbus'
import Clipboard from '@react-native-clipboard/clipboard'
import { toThousands } from '@/utils/util'

interface RouteParams {
  applyId?: string
  amount?: number
  type?: 'spei' | 'oxxo'
}
export function PaymentDetail() {
  const route = useRoute()
  const params: RouteParams | undefined = route.params
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({ title: params?.type?.toUpperCase() })
  }, [navigation, params?.type])
  useEffect(() => {
    if (params) {
      if (params?.type === 'spei') {
        queryClabe({ applyId: +(params.applyId || '0') }).then(res => {
          console.log(res)
          setAccount('123')
        })
      } else {
        queryPayCode({ applyId: +(params.applyId || '0'), amount: +(params.amount || '0') }).then(
          res => {
            console.log(res)
            setAccount('123')
            setSource('https://www.baidu.com')
          }
        )
      }
    }
  }, [params])
  const [source, setSource] = useState<string>()
  const [account, setAccount] = useState<string>()
  const { t } = useTranslation()
  const onCopy = useCallback(() => {
    Clipboard.setString(account || '')
    emitter.emit('SHOW_MESSAGE', { type: 'success', message: t('copySuccessed') })
  }, [account, t])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView
        style={{ flex: 1, backgroundColor: '#E6F1F8', paddingHorizontal: 10, paddingTop: 15 }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 15,
            paddingHorizontal: 24,
            paddingTop: 37.5,
            paddingBottom: params?.type === 'spei' ? 68 : 79.5,
          }}>
          <View style={{ paddingBottom: 33 }}>
            <Text fontSize={18} color="#333230">
              {t('warnRepayPrompt')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 18,
            }}>
            <Text>Tasa de Tramitacion</Text>
            <Text>{toThousands(params?.amount || 0)} MXN</Text>
          </View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable
              onPress={onCopy}
              style={{
                backgroundColor: '#E3E5F0',
                paddingVertical: 10.5,
                flex: 1,
                paddingHorizontal: 7,
                marginRight: 9.5,
                borderRadius: 5,
              }}>
              <Text>{account}</Text>
            </Pressable>
            <Pressable
              onPress={onCopy}
              style={{
                backgroundColor: Color.primary,
                paddingVertical: 10.5,
                paddingHorizontal: 24,
                borderRadius: 5,
              }}>
              <Text
                color="#fff"
                fontSize={15}
                //@ts-ignore
                styles={{ textTransform: 'capitalize' }}>
                {t('copy')}
              </Text>
            </Pressable>
          </View>
          {params?.type === 'oxxo' && (
            <View>
              {source && (
                <Image
                  resizeMode="cover"
                  source={{
                    uri: source,
                  }}
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
