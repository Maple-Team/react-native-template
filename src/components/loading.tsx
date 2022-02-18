import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from '@/components'
import { Color } from '@/styles/color'
import React from 'react'
import { ActivityIndicator, View, type ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'

const loadingStyles = StyleSheet.create<{
  container: ViewStyle
  loadingHint: ViewStyle
}>({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flex: 1,
  },
  loadingHint: {
    marginTop: 10,
  },
})
export const Loading = () => {
  const { t } = useTranslation()
  return (
    <View style={loadingStyles.container}>
      <ActivityIndicator size="large" color={Color.primary} />
      <Text styles={loadingStyles.loadingHint}>{t('loading')}</Text>
    </View>
  )
}
