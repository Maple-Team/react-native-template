import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext } from 'react'
import { BillsList, BillsDetail } from '@/screens/order'
import { Color } from '@/styles/color'
import { HeaderLeft, HeaderRight } from '@components/header'
import { Linking } from 'react-native'
import { default as MoneyyaContext } from '@/state'
import { useNavigation } from '@react-navigation/native'

const Stack = createNativeStackNavigator()

export function OrderStack() {
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
  return (
    <Stack.Navigator
      initialRouteName="BillsList"
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
        gestureEnabled: true,
      })}>
      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="BillsList"
          key="BillsList"
          component={BillsList}
          options={() => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name="BillsDetail"
          key="BillsDetail"
          component={BillsDetail}
          options={() => ({
            title: 'Loan detailed record',
            headerRight: () => (
              <HeaderRight
                onPress={() => {
                  context.brand?.serviceInfo.ccphone &&
                    Linking.openURL(`tel:${context.brand?.serviceInfo.ccphone}`)
                }}
              />
            ),
            headerLeft: () => (
              <HeaderLeft
                onPress={() => {
                  na.goBack()
                }}
              />
            ),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}
