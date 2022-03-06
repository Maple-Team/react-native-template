import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Image, View, ImageBackground, Pressable, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Loading, TabHeader, Text, ToastLoading } from '@/components'
import { Color } from '@/styles/color'
import { queryOrders } from '@/services/order'
import { Order } from '@/typings/order'
import { APPLY_STATE } from '@/state/enum'
import { useNavigation, useRoute } from '@react-navigation/native'
import uniqBy from 'lodash.uniqby'
import { useTranslation } from 'react-i18next'
import { useCustomBack, UserFocusStatusBar } from '@/hooks'
import { useHeaderHeight } from '@react-navigation/elements'
import RefreshListView, { RefreshState } from '@screens/letter/refreshListView'

export function BillsList() {
  const route = useRoute()

  const { t, i18n } = useTranslation()
  const { type } = (route.params || { type: 'order' }) as { type: 'payment' | 'order' }
  const [data, setData] = useState<Order[]>([])
  const [loading] = useState<boolean>(false)
  const headerHeight = useHeaderHeight()
  const [page, setPage] = useState<number>(1)

  // 每页最大数量
  const ListNums = useMemo(() => {
    const window = Dimensions.get('window')
    const listNum = (window.height - headerHeight) / 173 // 计算而来
    return Math.ceil(listNum)
  }, [headerHeight])

  const na = useNavigation()
  useCustomBack(() => {
    //@ts-ignore
    na.navigate('BottomTab')
  })
  /**
   * 计算出还款相关状态
   */
  const getStateContent = useCallback((item: Order) => {
    let content: { text?: string; color: string; state: number } = {
      text: item.contractStatusName,
      color: Color.primary,
      state: 0,
    }
    switch (item.contractStatus) {
      case APPLY_STATE.OVERDUE:
        content = { text: item.contractStatusName, color: '#FF4800', state: -1 }
        break
      case APPLY_STATE.APPLY:
      case APPLY_STATE.LOAN:
      case APPLY_STATE.WAIT:
        content = { text: item.contractStatusName, color: Color.primary, state: 2 }
        break
      case APPLY_STATE.REJECTED:
        content = { text: item.contractStatusName, color: '#FF4800', state: 3 }
        break
      case APPLY_STATE.SETTLE:
        content = { color: Color.primary, state: 1 }
        break
    }

    return content
  }, [])
  const viewRef = useRef<View>(null)

  const ref = useRef<FlatList>(null)
  const [refreshState, setRefreshState] = useState<number>(RefreshState.Idle)

  const onHeaderRefresh = useCallback(() => {
    setRefreshState(RefreshState.HeaderRefreshing)
    queryOrders(type, { currentPage: 1, pageSize: ListNums })
      .then(res => {
        if (res) {
          setData(uniqBy(res.concat(data), 'id'))
          setRefreshState(res.length < 1 ? RefreshState.NoMoreData : RefreshState.Idle)
        }
      })
      .catch(() => {
        setRefreshState(RefreshState.Failure)
      })
  }, [data, ListNums, type])

  useEffect(() => {
    onHeaderRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFooterRefresh = useCallback(() => {
    setRefreshState(RefreshState.FooterRefreshing)

    queryOrders(type, { currentPage: page, pageSize: ListNums })
      .then(res => {
        if (res) {
          setData(uniqBy(res.concat(data), 'id'))
          setRefreshState(res.length >= ListNums ? RefreshState.Idle : RefreshState.NoMoreData)
          setPage(page + 1)
        }
      })
      .catch(() => {
        setRefreshState(RefreshState.Failure)
      })
  }, [data, ListNums, type, page])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserFocusStatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <ToastLoading animating={loading} />
      <View
        style={{
          paddingTop: 0,
          paddingHorizontal: 0,
          paddingBottom: 47.5,
          flex: 1,
        }}>
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
        {loading ? (
          <Loading />
        ) : (
          <RefreshListView
            paddingHorizontal={47.5}
            data={data}
            loading={loading}
            listRef={ref}
            refreshState={refreshState}
            renderItem={(item: Order) => (
              <View
                style={{ paddingTop: 35.5, marginTop: 24.5 }}
                ref={viewRef}
                onLayout={() => {
                  viewRef.current?.measure(() => {
                    // console.log(h, '=========') // 173
                  })
                }}>
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
                      source={
                        getStateContent(item).state >= 0
                          ? getStateContent(item).state === 1
                            ? require('@/assets/compressed/bills/setted.webp')
                            : require('@/assets/compressed/bills/repay1.webp')
                          : require('@/assets/compressed/bills/repay3.webp')
                      }
                      resizeMode="cover"
                    />
                  </Pressable>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 30.5,
                      justifyContent: 'space-between',
                      paddingHorizontal: i18n.language === 'es-MX' ? 5 : 49.5,
                      paddingBottom: 13,
                      width: '100%',
                    }}>
                    <View style={{ alignItems: 'center', flexWrap: 'wrap', marginRight: 10 }}>
                      <Text
                        styles={{
                          //@ts-ignore
                          marginBottom: 15,
                        }}>
                        {t('loanAmount')}
                      </Text>
                      <Text>{item.applyAmount}</Text>
                    </View>
                    <View style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      {getStateContent(item).state === 3 ||
                      getStateContent(item).state === 2 ||
                      getStateContent(item).state === 1 ? (
                        <>
                          <Text
                            styles={{
                              //@ts-ignore
                              marginBottom: 15,
                            }}>
                            {t('loanDays')}
                          </Text>
                          <Text>{item.loanTerms}</Text>
                        </>
                      ) : (
                        <>
                          <Text
                            styles={{
                              //@ts-ignore
                              marginBottom: 15,
                            }}>
                            {t('repayDate')}
                          </Text>
                          <Text>{item.repayDate}</Text>
                        </>
                      )}
                    </View>
                  </View>

                  {getStateContent(item).state !== 1 && (
                    <Pressable
                      onPress={() =>
                        //@ts-ignore
                        na.navigate('BillsDetail', {
                          applyId: item.applyId,
                        })
                      }
                      style={{
                        backgroundColor: getStateContent(item).color,
                        paddingVertical: 11,
                        borderBottomLeftRadius: 14,
                        borderBottomRightRadius: 14,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                      }}>
                      <Text
                        color="#fff"
                        //@ts-ignore
                        styles={{ textTransform: 'capitalize' }}>
                        {getStateContent(item).text}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={{ paddingTop: 122, alignItems: 'center' }}>
                <Image
                  source={require('@/assets/compressed/bills/no-bill.webp')}
                  resizeMode="cover"
                />
              </View>
            }
            keyExtractor={(item: Order) => `${item.applyId}`}
            onFooterRefresh={onFooterRefresh}
            footerRefreshingText={t('loadMore')}
            footerFailureText={t('loadFailure')}
            footerNoMoreDataText={`- ${t('toBottom')} -`}
            footerEmptyDataText={t('noMessagePrompt')}
          />
        )}
      </View>
    </SafeAreaView>
  )
}
