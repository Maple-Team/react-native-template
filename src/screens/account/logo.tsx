import React from 'react'
import { View, Image } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default () => (
  <View style={styles.logoWrapper}>
    <Image source={require('@/assets/images/logo.webp')} style={styles.logo} resizeMode="cover" />
    <Image
      source={require('@/assets/images/moneyya.webp')}
      style={styles.moneyya}
      resizeMode="cover"
    />
  </View>
)

const styles = StyleSheet.create({
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
