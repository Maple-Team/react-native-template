import React, { useEffect } from 'react'
import { FlatList, Image, View, StatusBar, ImageBackground, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'
import { Color } from '@/styles/color'
import { queryOrders } from '@/services/order'

export function BillsList() {
  const data: Bill[] = []
  useEffect(() => {
    queryOrders().then(res => {
      console.log(res)
    })
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <View style={{ paddingTop: 0, paddingHorizontal: 0 }}>
        <View>
          <ImageBackground
            source={require('@/assets/images/bills/banner.webp')}
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
          {data.length ? (
            <FlatList
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
                      style={{
                        top: -35.5,
                        alignItems: 'center',
                        position: 'absolute',
                        width: '100%',
                      }}>
                      <Image
                        source={require('@/assets/images/bills/repay1.webp')} //FIXME switch state
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
                        <Text>{item.loanAmount}</Text>
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
                    {!item.isSettled && (
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
                        <Text>Repay</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={{ paddingTop: 122, alignItems: 'center' }}>
              <Image source={require('@/assets/images/bills/no-bill.webp')} resizeMode="cover" />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
interface Bill {
  loanAmount: number
  repayDate: string
  isSettled?: boolean
}
