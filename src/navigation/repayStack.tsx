import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext } from 'react'
import { BillsList, BillsDetail, Payment, PaymentDetail } from '@/screens/repay'
import { Color } from '@/styles/color'
import { HeaderLeft, HeaderRight } from '@components/header'
import { Linking } from 'react-native'
import { default as MoneyyaContext } from '@/state'
import { useNavigation } from '@react-navigation/native'

const Stack = createNativeStackNavigator()

export function RepayStack() {
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
      })}>
      <Stack.Group screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="BillsList"
          key="BillsList"
          component={BillsList}
          options={() => ({
            title: 'repay records',
          })}
        />
        <Stack.Screen
          name="BillsDetail"
          key="BillsDetail"
          component={BillsDetail}
          options={() => ({
            title: 'repay record detail',
          })}
        />
        <Stack.Screen
          name="Payment"
          key="Payment"
          component={Payment}
          options={() => ({
            title: 'Payment',
          })}
        />
        <Stack.Screen
          name="PaymentDetail"
          key="PaymentDetail"
          component={PaymentDetail}
          options={() => ({
            title: 'pay type',
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}
