import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext } from 'react'
import { AboutScreen, UserCenter, HtmlScreen } from '@/screens/user'
import { Color } from '@/styles/color'
import { HeaderRight } from '@components/header'
import { default as MoneyyaContext } from '@/state'
import { Linking } from 'react-native'

const Stack = createNativeStackNavigator()

export function UserStack() {
  const context = useContext(MoneyyaContext)
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
        headerRight: () => (
          <HeaderRight
            onPress={() => {
              context.brand?.serviceInfo.ccphone &&
                Linking.openURL(`tel:${context.brand?.serviceInfo.ccphone}`)
            }}
          />
        ),
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
        <Stack.Screen name="About" key="About" component={AboutScreen} />
        <Stack.Screen name="Html" key="Html" component={HtmlScreen} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
