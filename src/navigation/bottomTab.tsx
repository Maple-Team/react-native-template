import emitter from '@/eventbus'
import { useEventListener } from '@/hooks/useListener'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { navigate } from './rootNavigation'

const Tab = createBottomTabNavigator()

function ApplyNavigator() {
  return (
    <View>
      <Text>Home!</Text>
    </View>
  )
}

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
      <Tab.Screen name="Home" component={ApplyNavigator} />
      <Tab.Screen name="Order" component={OrdersNavigator} />
      <Tab.Screen name="User" component={UserNavigator} />
    </Tab.Navigator>
  )
}

export default BottomTab
