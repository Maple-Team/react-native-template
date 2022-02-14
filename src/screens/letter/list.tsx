import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View, Image, FlatList, RefreshControl } from 'react-native'
import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { ScrollView } from 'react-native-gesture-handler'
import { queryZhanLetterList } from '@/services/misc'
import { useTranslation } from 'react-i18next'
import emitter from '@/eventbus'
import uniqBy from 'lodash.uniqby'

export const LetterList = () => {
  const [data, setData] = useState<any>()
  useEffect(() => {
    queryZhanLetterList().then(res => {
      console.log(res)
      setData(res)
    })
  }, [])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { t } = useTranslation()
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (data.length < 10) {
      queryZhanLetterList().then(res => {
        setData(uniqBy(res.concat(data), 'applyId'))
        setRefreshing(false)
      })
    } else {
      emitter.emit('SHOW_MESSAGE', { type: 'info', message: t('noMore') })
      setRefreshing(false)
    }
  }, [data, t])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView
        style={[
          PageStyles.sav,
          { paddingHorizontal: 10, paddingVertical: 20, backgroundColor: '#E6F1F8' },
        ]}>
        {data.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 113, flex: 1 }}>
            <Image source={require('@/assets/compressed/additional/no-message.webp')} />
            <Text color="#f00" fontSize={14}>
              {t('noMessagePrompt')}
            </Text>
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[Color.primary]}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            data={data}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text>10 minutes ago</Text>
                  <View
                    style={{
                      backgroundColor: '#ff',
                      borderRadius: 14,
                      paddingTop: 40,
                      paddingBottom: 24,
                      paddingHorizontal: 19,
                    }}>
                    <Image source={require('@/assets/compressed/additional/message.webp')} />
                    <View
                      style={{ backgroundColor: '#E60012', width: 8, height: 8, borderRadius: 4 }}
                    />
                    <View>
                      <Text>{item.title}</Text>
                      <Text>{'content'.substring(0, 50)}...</Text>
                    </View>
                  </View>
                </View>
              )
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
