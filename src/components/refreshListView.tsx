//
//  Created by Liu Jinyong on 17/4/5.
//  Copyright © 2016年 Liu Jinyong. All rights reserved.
//
//  @flow
//  Github:
//  https://github.com/huanxsd/react-native-refresh-list-view

import { Color } from '@/styles/color'
import React, { PureComponent, RefObject } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { Text } from '@/components'
export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3,
  Failure: 4,
  EmptyData: 5,
}

const DEBUG = __DEV__
const log = (text: string) => {
  DEBUG && console.log(text)
}

type Props<T> = {
  refreshState: number
  onHeaderRefresh?: (state: number) => void
  onFooterRefresh?: (state: number) => void
  data: T[]
  listRef?: RefObject<FlatList>
  footerRefreshingText?: string
  footerFailureText?: string
  footerNoMoreDataText?: string
  footerEmptyDataText?: string
  keyExtractor: (item: T, index: number) => string
  footerRefreshingComponent?: View
  footerFailureComponent?: View
  footerNoMoreDataComponent?: View
  footerEmptyDataComponent?: View
  ListEmptyComponent?: any
  paddingHorizontal: number
  renderItem: (item: T) => any
  loading: boolean
}

class RefreshListView<T> extends PureComponent<Props<T>> {
  onHeaderRefresh = () => {
    log('[RefreshListView]  onHeaderRefresh')

    if (this.shouldStartHeaderRefreshing()) {
      log('[RefreshListView]  shouldStartHeaderRefreshing')
      this.props.onHeaderRefresh && this.props.onHeaderRefresh(RefreshState.HeaderRefreshing)
    }
  }

  onEndReached = (info: { distanceFromEnd: number }) => {
    log('[RefreshListView]  onEndReached   ' + info.distanceFromEnd)

    if (this.shouldStartFooterRefreshing()) {
      log('[RefreshListView]  onFooterRefresh')
      this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing)
    }
  }

  shouldStartHeaderRefreshing = () => {
    log('[RefreshListView]  shouldStartHeaderRefreshing')

    if (
      this.props.refreshState === RefreshState.HeaderRefreshing ||
      this.props.refreshState === RefreshState.FooterRefreshing
    ) {
      return false
    }

    return true
  }

  shouldStartFooterRefreshing = () => {
    log('[RefreshListView]  shouldStartFooterRefreshing')

    let { refreshState, data } = this.props
    if (data.length === 0) {
      return false
    }

    return refreshState === RefreshState.Idle
  }

  render() {
    log('[RefreshListView]  render  refreshState:' + this.props.refreshState)
    let { renderItem, paddingHorizontal, onHeaderRefresh, loading, ...rest } = this.props

    return (
      <FlatList
        style={{ paddingHorizontal }}
        ref={this.props.listRef}
        refreshControl={
          <RefreshControl
            colors={[Color.primary]}
            refreshing={loading}
            onRefresh={() => {
              console.log('onRefresh,===========')
              this.onHeaderRefresh()
            }}
          />
        }
        onEndReachedThreshold={0.1}
        onEndReached={info => this.onEndReached(info)}
        onRefresh={onHeaderRefresh ? this.onHeaderRefresh : null}
        refreshing={this.props.refreshState === RefreshState.HeaderRefreshing}
        ListFooterComponent={<RenderFooter {...this.props} />}
        renderItem={({ item }: { item: T }) => renderItem(item)}
        {...rest}
      />
    )
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 44,
  },
  footerText: {
    fontSize: 14,
    color: '#555555',
  },
})
function RenderFooter<T>({
  footerRefreshingText,
  footerFailureText,
  footerNoMoreDataText,
  footerEmptyDataText,

  footerRefreshingComponent,
  footerFailureComponent,
  footerNoMoreDataComponent,
  footerEmptyDataComponent,

  refreshState,
  data,
  onHeaderRefresh,
  onFooterRefresh,
}: Partial<Props<T>>) {
  let footer = null

  switch (refreshState) {
    case RefreshState.Idle:
      footer = <View style={styles.footerContainer} />
      break
    case RefreshState.Failure: {
      footer = (
        <TouchableOpacity
          onPress={() => {
            if (data?.length === 0) {
              onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing)
            } else {
              onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing)
            }
          }}>
          {footerFailureComponent
            ? footerFailureComponent
            : data?.length !== 0 && (
                <View style={styles.footerContainer}>
                  <Text
                    //@ts-ignore
                    styles={styles.footerText}>
                    {footerFailureText}
                  </Text>
                </View>
              )}
        </TouchableOpacity>
      )
      break
    }
    case RefreshState.EmptyData: {
      footer = (
        <TouchableOpacity
          onPress={() => {
            onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing)
          }}>
          {footerEmptyDataComponent ? (
            footerEmptyDataComponent
          ) : (
            <View style={styles.footerContainer}>
              <Text
                //@ts-ignore
                styles={styles.footerText}>
                {footerEmptyDataText}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )
      break
    }
    case RefreshState.FooterRefreshing: {
      footer = footerRefreshingComponent ? (
        footerRefreshingComponent
      ) : (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={Color.primary} />
          <Text
            //@ts-ignore
            styles={[styles.footerText, { marginLeft: 7 }]}>
            {footerRefreshingText}
          </Text>
        </View>
      )
      break
    }
    case RefreshState.NoMoreData: {
      footer = footerNoMoreDataComponent ? (
        footerNoMoreDataComponent
      ) : (
        <View style={styles.footerContainer}>
          <Text
            //@ts-ignore
            styles={styles.footerText}>
            {footerNoMoreDataText}
          </Text>
        </View>
      )
      break
    }
  }

  return footer as any
}
export default RefreshListView
