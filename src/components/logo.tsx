import React from 'react'
import { View, Image, ViewStyle, ImageStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export const Logo = () => (
  <View style={styles.logoWrapper}>
    <Image
      source={require('@/assets/compressed/common/logo.webp')}
      style={styles.logo}
      resizeMode="cover"
    />
    <Image
      source={require('@/assets/compressed/account/moneyya.webp')}
      style={styles.moneyya}
      resizeMode="cover"
    />
  </View>
)

const styles = StyleSheet.create<{
  logoWrapper: ViewStyle
  logo: ImageStyle
  moneyya: ImageStyle
}>({
  logoWrapper: {
    marginTop: 100,
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
  },
  moneyya: {
    marginTop: 18.5,
  },
})
