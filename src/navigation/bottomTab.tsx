import emitter from '@/eventbus'
import { useEventListener } from '@/hooks/useListener'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useEffect } from 'react'
import { Text, View, Image } from 'react-native'
import { ApplyStack } from './applyStack'
import { navigate } from './rootNavigation'

const Tab = createBottomTabNavigator()

function OrdersNavigator() {
  return (
    <View>
      <Text>Settings!</Text>
    </View>
  )
}
function UserNavigator() {
  return (
    <View>
      <Text>Settings!</Text>
    </View>
  )
}

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
        component={OrdersNavigator}
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
        component={UserNavigator}
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
