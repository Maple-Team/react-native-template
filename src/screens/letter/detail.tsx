import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { ScrollView } from 'react-native-gesture-handler'
import { markZhanLetterRead } from '@/services/misc'
import { useRoute } from '@react-navigation/native'
import type { ZhanneiLetter } from '@/typings/user'

export const LetterDetail = () => {
  const route = useRoute()
  const paramas = route.params as {
    record: ZhanneiLetter
  }
  useEffect(() => {
    markZhanLetterRead(`${paramas?.record.id}`)
  }, [paramas?.record.id])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#eee' }}>
        <View
          style={{
            borderRadius: 5,
            backgroundColor: '#fff',
            flexWrap: 'wrap',
            padding: 16,
            alignItems: 'center',
          }}>
          <Text
            fontSize={16}
            fontWeight="bold"
            color={Color.primary}
            //@ts-ignore
            styles={{ paddingBottom: 20 }}>
            {paramas?.record?.title}
          </Text>
          <Text
            fontSize={13}
            color="#869096"
            //@ts-ignore
            styles={{ paddingBottom: 10 }}>
            {paramas?.record?.createTime}
          </Text>
          <View style={{ width: '100%' }}>
            <Text fontSize={12} color="#343434">
              {paramas?.record?.content}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
