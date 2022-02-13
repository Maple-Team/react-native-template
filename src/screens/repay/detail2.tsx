import { queryOrderDetail } from '@/services/order'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View, Image, type ViewStyle } from 'react-native'
import { PageStyles, Text } from '@/components'
import { Order } from '@/typings/order'
import { useTranslation } from 'react-i18next'
import { ApplyButton } from '@components/form/FormItem'
import { default as MoneyyaContext } from '@/state'
import { ScrollView } from 'react-native-gesture-handler'

export default ({ route }: { route: any }) => {
  const { applyId } = route.params as { applyId: string }
  const [data, setData] = useState<Order>()

  const context = useContext(MoneyyaContext)
  useEffect(() => {
    if (applyId) {
      queryOrderDetail({ applyId }).then(res => {
        setData(res)
      })
    }
  }, [applyId])
  const { t } = useTranslation()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView
        style={{
          backgroundColor: '#E6F1F8',
          flex: 1,
          paddingHorizontal: 19,
          paddingTop: 20,
        }}>
        <View
          style={{
            backgroundColor: 'transparent',
            paddingTop: 47,
            paddingBottom: 140,
          }}>
          <View
            style={{ backgroundColor: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 33.5,
              }}>
              <View
                style={{
                  width: 71,
                  height: 71,
                  borderRadius: 71 / 2,
                  top: -71 / 2,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                }}>
                <Image
                  source={require('@/assets/compressed/additional/bill.webp')}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
          <View style={style.itemContainer}>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                Order number
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.applyId}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                Loan amount
              </Text>
              <Text color="#869096" fontSize={14}>
                MXN 6,000
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                Loan Term
              </Text>
              <Text color="#869096" fontSize={14}>
                7days
              </Text>
            </View>
            <View style={[style.itemWrapper, { borderBottomWidth: 0 }]}>
              <Text color="#869096" fontSize={14}>
                Status
              </Text>
              <Text color="#869096" fontSize={14}>
                To be repaid
              </Text>
            </View>
          </View>
          <View style={PageStyles.btnWrap}>
            <ApplyButton
              type={'primary'}
              onPress={() => {}}
              loading={context.loading.effects.APPLY}>
              <Text color={'#fff'}>{t('applyState.repay')}</Text>
            </ApplyButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

import StyleSheet from 'react-native-adaptive-stylesheet'
import { Color } from '@/styles/color'

const style = StyleSheet.create<{
  itemWrapper: ViewStyle
  itemContainer: ViewStyle
}>({
  itemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 150,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#DDE3E8',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
})
