import { Home } from '@screens/apply'
import { OrderStack } from './orderStack'
import { UserStack } from './userStack'
import React from 'react'
import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

export const BottomTab = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
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
      name="Order"
      key="Order"
      component={OrderStack}
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
      name="Account"
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
