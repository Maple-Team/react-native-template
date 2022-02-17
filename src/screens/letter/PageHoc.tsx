import { Color } from '@/styles/color'
import { PageStyles } from '@/components'
import React from 'react'
import { SafeAreaView, StatusBar, ScrollView } from 'react-native'

export function PageHoc<T, P>(Component: React.ComponentType<T>): React.FC<P> {
  return () => {
    const componentProps: any = {}
    return (
      <SafeAreaView style={PageStyles.sav}>
        <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
        <ScrollView>
          <Component {...componentProps} />
        </ScrollView>
      </SafeAreaView>
    )
  }
}
