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
// TODO 返回上一步
export function PaymentDetail() {
  const route = useRoute()
  const params: RouteParams | undefined = route.params
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions({ title: params?.type?.toUpperCase() })
  }, [navigation, params?.type])
  useEffect(() => {
    if (params) {
      const formdata = new FormData()
      formdata.append('applyId', params.applyId || '')
      if (params?.type === 'spei') {
        queryClabe(formdata).then(({ clabe }) => {
          setAccount(clabe)
        })
      } else {
        formdata.append('amount', `${params.amount}` || '0')
        queryPayCode(formdata).then(({ barcode, barcodeUrl }) => {
          setAccount(barcode)
          setSource(barcodeUrl)
        })
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
            <Text>{t('repayAmountHint')}</Text>
            <Text>
              {toThousands(params?.amount || 0)} {t('mxn')}
            </Text>
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
            <View style={{ paddingTop: 23, flex: 1, alignItems: 'center' }}>
              {source && (
                <Image
                  width={224}
                  style={{ width: 224 }}
                  height={100}
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
