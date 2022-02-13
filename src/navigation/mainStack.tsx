import { Color } from '@/styles/color'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext } from 'react'
import { ApplyStack } from './applyStack'
import { BillsList, Payment, PaymentDetail } from '@/screens/repay'
import { BillsDetail } from '@/screens/order'
import { HeaderRight, HeaderLeft } from '@components/header'
import { Linking } from 'react-native'
import { default as MoneyyaContext } from '@/state'
import { useNavigation } from '@react-navigation/native'

const Stack = createNativeStackNavigator()
// https://reactnavigation.org/docs/hiding-tabbar-in-screens
// bottom需要在进件过程中隐藏掉，故参考官方文档说明操作
export function MainStack() {
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
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
      <Stack.Screen
        key="Apply"
        name="Apply"
        component={ApplyStack}
        options={() => ({
          headerShown: false,
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
      <Stack.Screen name="PaymentDetail" key="PaymentDetail" component={PaymentDetail} />
    </Stack.Navigator>
  )
}
