import React, { useCallback, useEffect, useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native'
import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { queryZhanLetterList } from '@/services/misc'
import { useTranslation } from 'react-i18next'
import emitter from '@/eventbus'
import uniqBy from 'lodash.uniqby'
import type { ZhanneiLetter } from '@/typings/user'
import { useNavigation } from '@react-navigation/native'

export const LetterList = () => {
  const [data, setData] = useState<ZhanneiLetter[]>([])
  const [page, setPage] = useState<number>(1)
  useEffect(() => {
    queryZhanLetterList({
      currentPage: 1,
      pageSize: 10,
    }).then(res => {
      setData(res)
      setPage(page + 1)
    })
  }, [page])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const { t } = useTranslation()
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (data.length < 10) {
      queryZhanLetterList({ currentPage: page, pageSize: 10 }).then(res => {
        setData(uniqBy(res.concat(data), 'applyId'))
        setRefreshing(false)
      })
    } else {
      emitter.emit('SHOW_MESSAGE', { type: 'info', message: t('noMore') })
      setRefreshing(false)
    }
  }, [data, t, page])
  const na = useNavigation()
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <View style={[PageStyles.sav, { paddingVertical: 20, backgroundColor: '#E6F1F8' }]}>
        {data.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 113, flex: 1 }}>
            <Image source={require('@/assets/compressed/additional/no-message.webp')} />
            <Text color="#f00" fontSize={14}>
              {t('noMessagePrompt')}
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ paddingHorizontal: 38 }}
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
                <Pressable
                  onPress={() => {
                    // @ts-ignore
                    na.navigate('LetterDetail', { record: item })
                  }}
                  style={{ alignItems: 'center', marginBottom: 17 }}
                  key={item.content}>
                  <View
                    style={{
                      backgroundColor: '#5D75F7',
                      borderRadius: 6.75,
                      paddingVertical: 3,
                      paddingHorizontal: 10,
                      marginBottom: 17,
                    }}>
                    <Text color="#fff">{item.createTime}</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      paddingTop: 40,
                      width: '100%',
                      paddingBottom: 24,
                      paddingHorizontal: 19,
                      alignItems: 'center',
                      marginTop: 17,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        top: -25,
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <Image
                        resizeMode="cover"
                        source={require('@/assets/compressed/additional/message.webp')}
                      />
                    </View>
                    {item.status === 'N' && (
                      <View
                        style={{
                          backgroundColor: '#E60012',
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          right: 9,
                          top: 12,
                          position: 'absolute',
                        }}
                      />
                    )}
                    <View>
                      <Text
                        color="#343434"
                        fontSize={15}
                        //@ts-ignore
                        styles={{ marginBottom: 11.5 }}>
                        {item.title}
                      </Text>
                      <Text color="#869096" fontSize={12}>
                        {item.content.substring(0, 32)}...
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )
            }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}
