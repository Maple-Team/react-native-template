import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView, StatusBar, View, Image, FlatList, Pressable, Dimensions } from 'react-native'
import { Loading, PageStyles, Text, ToastLoading } from '@/components'
import { Color } from '@/styles/color'
import { queryZhanLetterList } from '@/services/misc'
import { useTranslation } from 'react-i18next'
import uniqBy from 'lodash.uniqby'
import type { ZhanneiLetter } from '@/typings/user'
import { useNavigation } from '@react-navigation/native'
import { useHeaderHeight } from '@react-navigation/elements'
import RefreshListView, { RefreshState } from '../../components/refreshListView'

// 上拉加载，下拉刷新
export const LetterList = () => {
  const [data, setData] = useState<ZhanneiLetter[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading] = useState<boolean>(false)
  const [refreshState, setRefreshState] = useState<number>(RefreshState.Idle)
  const { t } = useTranslation()
  const headerHeight = useHeaderHeight()

  // 每页最大数量
  const listNums = useMemo(() => {
    const window = Dimensions.get('window')
    const listNum = (window.height - headerHeight) / 188 // 计算而来
    return Math.ceil(listNum)
  }, [headerHeight])

  const na = useNavigation()
  const ref = useRef<FlatList>(null)

  const onHeaderRefresh = useCallback(() => {
    setRefreshState(RefreshState.HeaderRefreshing)
    queryZhanLetterList({ currentPage: 1, pageSize: listNums })
      .then(res => {
        setData(_data => uniqBy(res.concat(_data), 'id'))
        setRefreshState(res.length < 1 ? RefreshState.NoMoreData : RefreshState.Idle)
      })
      .catch(() => {
        setRefreshState(RefreshState.Failure)
      })
  }, [listNums])

  useEffect(() => {
    onHeaderRefresh()
  }, [onHeaderRefresh])

  const onFooterRefresh = useCallback(() => {
    setRefreshState(RefreshState.FooterRefreshing)

    queryZhanLetterList({ currentPage: page, pageSize: listNums })
      .then(res => {
        setData(uniqBy(res.concat(data), 'id'))
        setRefreshState(res.length >= listNums ? RefreshState.Idle : RefreshState.NoMoreData)
        setPage(page + 1)
      })
      .catch(() => {
        setRefreshState(RefreshState.Failure)
      })
  }, [data, listNums, page])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ToastLoading animating={loading} />
      <View style={[PageStyles.sav, { paddingVertical: 20, backgroundColor: '#E6F1F8' }]}>
        {loading ? (
          <Loading />
        ) : (
          <RefreshListView
            data={data}
            loading={loading}
            listRef={ref}
            keyExtractor={(item: ZhanneiLetter) => `${item.id}`}
            renderItem={(item: ZhanneiLetter) => (
              <Pressable
                onPress={() => {
                  // @ts-ignore
                  na.navigate('LetterDetail', { record: item })
                }}
                style={{ alignItems: 'center', marginBottom: 17 }}>
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
                      {item?.content?.substring(0, 32)}...
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            paddingHorizontal={38}
            refreshState={refreshState}
            onHeaderRefresh={onHeaderRefresh}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 113, flex: 1 }}>
                <Image source={require('@/assets/compressed/additional/no-message.webp')} />
                <Text color="#f00" fontSize={14}>
                  {t('noMessagePrompt')}
                </Text>
              </View>
            }
            onFooterRefresh={onFooterRefresh}
            footerRefreshingText={t('loadMore')}
            footerFailureText={t('loadFailure')}
            footerNoMoreDataText={`- ${t('toBottom')} -`}
            footerEmptyDataText={t('noMessagePrompt')}
          />
          // <FlatList
          //   style={{ paddingHorizontal: 38 }}
          //   ref={ref}
          //   refreshControl={
          //     <RefreshControl colors={[Color.primary]} refreshing={loading} onRefresh={onRefresh} />
          //   }
          //   onEndReachedThreshold={0.1}
          //   onEndReached={() => {
          //     console.log('onEndReached')
          //     if (!nomore && onEndReachedCalled) {
          //       loadData(page + 1, false)
          //     }
          //     setOnEndReachedCalled(true)
          //   }}
          //   listKey="id"
          //   keyExtractor={item => `${item.id}`}
          //   ListEmptyComponent={
          //     <View style={{ alignItems: 'center', paddingTop: 113, flex: 1 }}>
          //       <Image source={require('@/assets/compressed/additional/no-message.webp')} />
          //       <Text color="#f00" fontSize={14}>
          //         {t('noMessagePrompt')}
          //       </Text>
          //     </View>
          //   }
          //   ListFooterComponent={
          //     <View style={{ alignItems: 'center' }}>
          //       {data.length !== 0 ? (
          //         nomore ? (
          //           <Text>- {t('toBottom')} -</Text>
          //         ) : (
          //           <View style={{ alignItems: 'center' }}>
          //             <ActivityIndicator size="small" animating={loading} />
          //             <Text>{t('loadMore')}</Text>
          //           </View>
          //         )
          //       ) : null}
          //     </View>
          //   }
          //   data={data}
          //   renderItem={({ item }) => {
          //     return (
          //       <Pressable
          //         onPress={() => {
          //           // @ts-ignore
          //           na.navigate('LetterDetail', { record: item })
          //         }}
          //         style={{ alignItems: 'center', marginBottom: 17 }}>
          //         <View
          //           style={{
          //             backgroundColor: '#5D75F7',
          //             borderRadius: 6.75,
          //             paddingVertical: 3,
          //             paddingHorizontal: 10,
          //             marginBottom: 17,
          //           }}>
          //           <Text color="#fff">{item.createTime}</Text>
          //         </View>
          //         <View
          //           style={{
          //             backgroundColor: '#fff',
          //             borderRadius: 14,
          //             paddingTop: 40,
          //             width: '100%',
          //             paddingBottom: 24,
          //             paddingHorizontal: 19,
          //             alignItems: 'center',
          //             marginTop: 17,
          //             justifyContent: 'space-between',
          //           }}>
          //           <View
          //             style={{
          //               position: 'absolute',
          //               top: -25,
          //               alignItems: 'center',
          //               width: '100%',
          //             }}>
          //             <Image
          //               resizeMode="cover"
          //               source={require('@/assets/compressed/additional/message.webp')}
          //             />
          //           </View>
          //           {item.status === 'N' && (
          //             <View
          //               style={{
          //                 backgroundColor: '#E60012',
          //                 width: 8,
          //                 height: 8,
          //                 borderRadius: 4,
          //                 right: 9,
          //                 top: 12,
          //                 position: 'absolute',
          //               }}
          //             />
          //           )}
          //           <View>
          //             <Text
          //               color="#343434"
          //               fontSize={15}
          //               //@ts-ignore
          //               styles={{ marginBottom: 11.5 }}>
          //               {item.title}
          //             </Text>
          //             <Text color="#869096" fontSize={12}>
          //               {item.content.substring(0, 32)}...
          //             </Text>
          //           </View>
          //         </View>
          //       </Pressable>
          //     )
          //   }}
          // />
        )}
      </View>
    </SafeAreaView>
  )
}
