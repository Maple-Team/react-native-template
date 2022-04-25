import {
  Home,
  // ValidateCode
} from '@screens/apply'
import { UserStack } from './userStack'
import React from 'react'
import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BillsList } from '@screens/order'
import { useTranslation } from 'react-i18next'

const Tab = createBottomTabNavigator()

export const BottomTab = () => {
  const { t } = useTranslation()
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={t('bottomTab.home')}
        key="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const src = focused
              ? require('@/assets/compressed/common/active/home.webp')
              : require('@/assets/compressed/common/normal/home.webp')
            return <Image source={src} resizeMode="cover" />
          },
        }}
      />
      <Tab.Screen
        name={t('bottomTab.bills')}
        key="Order"
        component={BillsList}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const src = focused
              ? require('@/assets/compressed/common/active/bills.webp')
              : require('@/assets/compressed/common/normal/bills.webp')
            return <Image source={src} resizeMode="cover" />
          },
        }}
      />
      <Tab.Screen
        name={t('bottomTab.account')}
        key="Account"
        component={UserStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const src = focused
              ? require('@/assets/compressed/common/active/account.webp')
              : require('@/assets/compressed/common/normal/account.webp')
            return <Image source={src} resizeMode="cover" />
          },
        }}
      />
    </Tab.Navigator>
  )
}
