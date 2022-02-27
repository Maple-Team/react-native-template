import React, { useCallback, useContext, useState } from 'react'
import { View, Image, Linking, Pressable } from 'react-native'
import headerStyles from './style'
import { default as MoneyyaContext } from '@/state'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { queryZhanLetterCount } from '@/services/misc'

interface HeaderProps {
  title?: any
  notice?: any
  help?: any
}

export const TabHeader = ({ title, help, notice }: HeaderProps) => {
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
  const [count, setCount] = useState<number>(0)
  useFocusEffect(
    useCallback(() => {
      queryZhanLetterCount().then(_ => {
        setCount(_)
      })
      return () => {}
    }, [])
  )
  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerLeft}>
        <Image
          style={headerStyles.logo}
          source={require('@/assets/compressed/apply/logo.webp')}
          resizeMode="cover"
        />
        <Image
          style={headerStyles.moneyya}
          source={title || require('@/assets/compressed/common/normal/moneyya.webp')}
          resizeMode="cover"
        />
      </View>
      <View style={headerStyles.headerRight}>
        <Pressable
          style={{ position: 'relative' }}
          onPress={() => {
            na.getParent()?.navigate('Letters')
          }}>
          <Image
            style={headerStyles.notice}
            source={notice || require('@/assets/compressed/common/normal/notice.webp')}
            resizeMode="cover"
          />
          {count > 0 && (
            <View
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f00',
                top: 0,
                right: 0,
              }}
            />
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            context.brand?.serviceInfo.ccphone &&
              Linking.openURL(`tel:${context.brand?.serviceInfo.ccphone}`)
          }}>
          <Image
            style={headerStyles.help}
            source={help || require('@/assets/compressed/common/normal/help.webp')}
            resizeMode="cover"
          />
        </Pressable>
      </View>
    </View>
  )
}
