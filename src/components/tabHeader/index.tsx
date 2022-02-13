import React, { useContext } from 'react'
import { View, Image, Linking, Pressable } from 'react-native'
import headerStyles from './style'
import { default as MoneyyaContext } from '@/state'

interface HeaderProps {
  title?: any
  notice?: any
  help?: any
}

export const TabHeader = ({ title, help, notice }: HeaderProps) => {
  const context = useContext(MoneyyaContext)
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
          onPress={() => {
            //TODO
          }}>
          <Image
            style={headerStyles.notice}
            source={notice || require('@/assets/compressed/common/normal/notice.webp')}
            resizeMode="cover"
          />
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
