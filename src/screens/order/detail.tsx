import { queryOrderDetail } from '@/services/order'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { Text } from '@/components'
import { Order } from '@/typings/order'

export default ({ route }: { route: any }) => {
  const { applyId } = route.params as { applyId: string }
  const [data, setData] = useState<Order>()
  useEffect(() => {
    if (applyId) {
      queryOrderDetail({ applyId }).then(res => {
        setData(res)
      })
    }
  }, [applyId])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <View>
        <Text>{JSON.stringify(data)}</Text>
      </View>
    </SafeAreaView>
  )
}
