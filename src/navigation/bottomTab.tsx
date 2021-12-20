import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Text, View } from 'react-native'

const Tab = createBottomTabNavigator()

function ApplyNavigator() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  )
}

function OrdersNavigator() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}
function UserNavigator() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}

function BottomTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ApplyNavigator} />
      <Tab.Screen name="Order" component={OrdersNavigator} />
      <Tab.Screen name="User" component={UserNavigator} />
    </Tab.Navigator>
  )
}

export default BottomTab
