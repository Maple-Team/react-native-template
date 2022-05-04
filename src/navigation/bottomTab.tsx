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
        name="Home"
        key="Home"
        component={Home}
        options={{
          title: t('bottomTab.home'),
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
        name="Order"
        key="Order"
        component={BillsList}
        options={{
          title: t('bottomTab.bills'),
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
        name="Account"
        key="Account"
        component={UserStack}
        options={{
          title: t('bottomTab.account'),
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
