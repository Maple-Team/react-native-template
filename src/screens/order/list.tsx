import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  View,
  StatusBar,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'
import { Color } from '@/styles/color'
import { queryOrders } from '@/services/order'
import { Order } from '@/typings/order'
import { default as MoneyyaContext } from '@/state'
import { APPLY_STATE } from '@/state/enum'
import { useNavigation } from '@react-navigation/native'
import emitter from '@/eventbus'
import uniqBy from 'lodash.uniqby'

export function BillsList() {
  const [data, setData] = useState<Order[]>([])
  useEffect(() => {
    queryOrders().then(res => {
      setData(res)
    })
  }, [])
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (data.length < 10) {
      queryOrders().then(res => {
        setData(uniqBy(res.concat(data), 'applyId'))
        setRefreshing(false)
      })
    } else {
      emitter.emit('SHOW_MESSAGE', { type: 'info', message: 'No more new data available' })
      setRefreshing(false)
    }
  }, [data])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <View style={{ paddingTop: 0, paddingHorizontal: 0 }}>
        <View>
          <ImageBackground
            source={require('@/assets/compressed/bills/banner.webp')}
            resizeMode="cover"
            style={{
              height: 45,
            }}>
            <TabHeader />
          </ImageBackground>
        </View>
        <View
          style={{
            marginBottom: 47.5,
          }}>
          {context.loading.effects.ORDER_LIST ? (
            <ActivityIndicator />
          ) : data.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  colors={[Color.primary]}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              style={{ paddingHorizontal: 47.5 }}
              data={data}
              renderItem={({ item }) => (
                <View style={{ paddingTop: 35.5, marginTop: 24.5 }}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      alignItems: 'center',
                    }}>
                    <Pressable
                      onPress={() => {
                        //@ts-ignore
                        na.navigate('BillsDetail', {
                          applyId: item.applyId,
                        })
                      }}
                      style={{
                        top: -35.5,
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',
                      }}>
                      <Image
                        source={require('@/assets/compressed/bills/repay1.webp')} //FIXME switch state
                        resizeMode="cover"
                      />
                    </Pressable>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: 30.5,
                        justifyContent: 'space-between',
                        paddingHorizontal: 49.5,
                        paddingBottom: 13,
                        width: '100%',
                      }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          styles={{
                            //@ts-ignore
                            marginBottom: 15,
                          }}>
                          借款金额
                        </Text>
                        <Text>{item.applyAmount}</Text>
                      </View>
                      <View style={{ alignItems: 'center' }}>
                        <Text
                          styles={{
                            //@ts-ignore
                            marginBottom: 15,
                          }}>
                          应还日期
                        </Text>
                        <Text>{item.repayDate}</Text>
                      </View>
                    </View>
                    {item.contractStatus === APPLY_STATE.WAIT.toString() && (
                      <Pressable
                        style={{
                          backgroundColor: Color.primary, //FIXME switch state
                          paddingVertical: 11,
                          borderBottomLeftRadius: 14,
                          borderBottomRightRadius: 14,
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                        }}>
                        <Text color="#fff">Repay</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={{ paddingTop: 122, alignItems: 'center' }}>
              <Image
                source={require('@/assets/compressed/bills/no-bill.webp')}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
