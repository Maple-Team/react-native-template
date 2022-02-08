import { queryOrderDetail } from '@/services/order'
import React, { useEffect } from 'react'
import { View } from 'react-native'

export default () => {
  useEffect(() => {
    queryOrderDetail({ applyId: '' }).then(res => {
      console.log(res)
    })
  }, [])

  return <View>detail</View>
}
