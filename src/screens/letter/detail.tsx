import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { ScrollView } from 'react-native-gesture-handler'
import { queryZhanLetterDetail } from '@/services/misc'
import { useRoute } from '@react-navigation/native'

export const LetterDetail = () => {
  const route = useRoute()
  const paramas = route.params as { id: string }
  const [data, setData] = useState<any>()
  useEffect(() => {
    queryZhanLetterDetail(paramas?.id).then(res => {
      console.log(res)
      setData(res)
    })
  }, [paramas?.id])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={{ paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#eee' }}>
        <View
          style={{
            borderRadius: 5,
            backgroundColor: '#fff',
            flexWrap: 'wrap',
            padding: 16,
            alignItems: 'center',
          }}>
          <Text fontSize={16} fontWeight="bold" color="#ff0">
            {data.title}
          </Text>
          <Text fontSize={13} color="#ff0">
            {data.date}
          </Text>
          <View style={{ width: '100%' }}>
            <Text fontSize={15} color="#ff0">
              {data.content}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
