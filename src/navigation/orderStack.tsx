import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import List from '../screens/order/list'
import Detail from '../screens/order/detail'

const Stack = createNativeStackNavigator()

function OrderStack() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default OrderStack
