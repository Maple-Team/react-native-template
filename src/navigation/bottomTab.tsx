import emitter from '@/eventbus'
import { useEventListener } from '@/hooks/useListener'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useEffect } from 'react'
import { Image } from 'react-native'
import { ApplyStack } from './applyStack'
import { OrderStack } from './orderStack'
import { UserStack } from './userStack'
import { navigate } from './rootNavigation'

const Tab = createBottomTabNavigator()

function BottomTab() {
  useEventListener()
  useEffect(() => {
    emitter.on('SESSION_EXPIRED', () => {
      navigate('signin', null)
    })
    emitter.on('LOGOUT_SUCCESS', () => {
      navigate('signin', null) //TODO 携带手机号
    })
  })
  useEffect(() => {
    const queryZhanNeiXin = async () => {
      console.log('queryZhanNeiXin')
    }
    queryZhanNeiXin()
  }, [])
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        key="Home"
        component={ApplyStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const src = focused
              ? require('@/assets/images/common/active/home.webp')
              : require('@/assets/images/common/normal/home.webp')
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
              ? require('@/assets/images/common/active/bills.webp')
              : require('@/assets/images/common/normal/bills.webp')
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
              ? require('@/assets/images/common/active/account.webp')
              : require('@/assets/images/common/normal/account.webp')
            return <Image source={src} resizeMode="cover" />
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default BottomTab
