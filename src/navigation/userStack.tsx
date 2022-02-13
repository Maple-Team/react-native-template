import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { About, UserCenter } from '@/screens/user'
import { Color } from '@/styles/color'
import { HeaderRight } from '@components/header'
import { RepayStack } from './repayStack'

const Stack = createNativeStackNavigator()

export function UserStack() {
  return (
    <Stack.Navigator
      initialRouteName="UserCenter"
      screenOptions={() => ({
        headerStyle: {
          backgroundColor: Color.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: 'ArialMT',
        },
        headerTitleAlign: 'center',
        headerRight: () => <HeaderRight onPress={() => {}} />,
      })}>
      <Stack.Group>
        <Stack.Screen
          name="UserCenter"
          key="UserCenter"
          component={UserCenter}
          options={() => ({
            headerShown: false,
          })}
        />
        <Stack.Screen name="Repay" key="Repay" component={RepayStack} />
        <Stack.Screen name="About" key="About" component={About} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
