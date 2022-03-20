import React from 'react'
import { SafeAreaView, StatusBar, Image, Pressable } from 'react-native'
import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { ScrollView } from 'react-native-gesture-handler'

export const AboutScreen = () => {
  const { t } = useTranslation()
  const navigate = useNavigation()
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={{ padding: 20 }}>
        <Pressable
          style={styles.wrap}
          onPress={() => {
            //@ts-ignore
            navigate.navigate('Html', {
              title: t('service-agreement'),
              field: 'serviceUrl',
            })
          }}>
          <Text color="#000">{t('service-agreement')}</Text>
          <Image
            resizeMode="cover"
            source={require('@/assets/compressed/user-center/right.webp')}
          />
        </Pressable>
        <Pressable
          style={styles.wrap}
          onPress={() => {
            //@ts-ignore
            navigate.navigate('Html', {
              title: t('privacy-policy'),
              field: 'privacyUrl',
            })
          }}>
          <Text color="#000">{t('privacy-policy')}</Text>
          <Image
            resizeMode="cover"
            source={require('@/assets/compressed/user-center/right.webp')}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

import { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

export const styles = StyleSheet.create<{
  wrap: ViewStyle
}>({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
