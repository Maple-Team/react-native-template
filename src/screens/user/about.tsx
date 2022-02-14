import React from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { ScrollView } from 'react-native-gesture-handler'

export default () => (
  <SafeAreaView style={PageStyles.sav}>
    <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
    <ScrollView>
      <View>
        <Text>about page</Text>
      </View>
    </ScrollView>
  </SafeAreaView>
)
