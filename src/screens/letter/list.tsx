import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
} from 'react-native'
import { Loading, PageStyles, Text, ToastLoading } from '@/components'
import { Color } from '@/styles/color'
import { queryZhanLetterList } from '@/services/misc'
import { useTranslation } from 'react-i18next'
import emitter from '@/eventbus'
import uniqBy from 'lodash.uniqby'
import type { ZhanneiLetter } from '@/typings/user'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from '@ant-design/react-native'
import { useHeaderHeight } from '@react-navigation/elements'

// 上拉加载，下拉刷新
export const LetterList = () => {
  const [data, setData] = useState<ZhanneiLetter[]>([])
  const [page, setPage] = useState<number>(1)
  const [nomore, setNomore] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>(false)
  // const [onEndReachedCalled, setOnEndReachedCalled] = useState<boolean>()
  const { t } = useTranslation()
  const headerHeight = useHeaderHeight()

  // 每页最大数量
  const ListNums = useMemo(() => {
    const window = Dimensions.get('window')
    const listNum = (window.height - headerHeight) / 188 // 计算而来
    return Math.ceil(listNum)
  }, [headerHeight])

  console.log(ListNums, data.map(({ id }) => id).sort(), nomore)
  const loadData = useCallback(
    async (pageNum: number, refresh: boolean) => {
      setLoading(true)
      queryZhanLetterList({ currentPage: pageNum, pageSize: ListNums })
        .then(res => {
          let noMore
          if (res.length < ListNums) {
            noMore = true
          } else {
            noMore = false
          }
          if (refresh) {
            setData(res)
            emitter.emit('SHOW_MESSAGE', { type: 'info', message: t('refreshSuccess') })
          } else {
            //  加载，叠加数据
            setData(uniqBy(res.concat(data), 'id'))
          }
          setNomore(noMore)
          setPage(page + 1)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [ListNums, data, page, t]
  )

  useEffect(() => {
    console.log('first')
    loadData(1, false)
  }, [])
  /**
   * 刷新最新页
   */
  const onRefresh = useCallback(async () => {
    setNomore(false)
    loadData(1, true)
  }, [loadData])

  const na = useNavigation()

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ToastLoading animating={loading} />
      <View style={[PageStyles.sav, { paddingVertical: 20, backgroundColor: '#E6F1F8' }]}>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            style={{ paddingHorizontal: 38 }}
            refreshControl={
              <RefreshControl colors={[Color.primary]} refreshing={loading} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 113, flex: 1 }}>
                <Image source={require('@/assets/compressed/additional/no-message.webp')} />
                <Text color="#f00" fontSize={14}>
                  {t('noMessagePrompt')}
                </Text>
              </View>
            }
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              console.log('onEndReached')
              if (
                !nomore
                // && onEndReachedCalled
              ) {
                loadData(page, false)
              }
              // setOnEndReachedCalled(true)
            }}
            keyExtractor={item => `${item.id}`}
            ListFooterComponent={
              <View style={{ alignItems: 'center' }}>
                {data.length !== 0 ? (
                  nomore ? (
                    <Text>- {t('toBottom')} -</Text>
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <ActivityIndicator size="small" animating={loading} />
                      <Text>{t('loadMore')}</Text>
                    </View>
                  )
                ) : null}
              </View>
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
                  key={item.id}>
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
