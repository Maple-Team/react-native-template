import React from 'react'
import { View, Image } from 'react-native'
import headerStyles from './style'

interface HeaderProps {
  title?: any
  notice?: any
  help?: any
}

export const TabHeader = ({ title, help, notice }: HeaderProps) => (
  <View style={headerStyles.header}>
    <View style={headerStyles.headerLeft}>
      <Image
        style={headerStyles.logo}
        source={require('@/assets/images/apply/logo.webp')}
        resizeMode="cover"
      />
      <Image
        style={headerStyles.moneyya}
        source={title || require('@/assets/images/common/normal/moneyya.webp')}
        resizeMode="cover"
      />
    </View>
    <View style={headerStyles.headerRight}>
      <Image
        style={headerStyles.notice}
        source={notice || require('@/assets/images/common/normal/notice.webp')}
        resizeMode="cover"
      />
      <Image
        style={headerStyles.help}
        source={help || require('@/assets/images/common/normal/help.webp')}
        resizeMode="cover"
      />
    </View>
  </View>
)
