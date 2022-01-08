import { Color } from '@/styles/color'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { ApplyStack } from './applyStack'

const Stack = createNativeStackNavigator()
// https://reactnavigation.org/docs/hiding-tabbar-in-screens
// bottom需要在进件过程中隐藏掉，故参考官方文档说明操作
export function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="Apply"
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
      })}>
      <Stack.Screen
        key="Apply"
        name="Apply"
        component={ApplyStack}
        options={() => ({
          headerShown: false,
        })}
      />
      {/* NOTE 比如message screen等 */}
    </Stack.Navigator>
  )
}
