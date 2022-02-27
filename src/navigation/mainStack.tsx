import { Color } from '@/styles/color'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useContext } from 'react'
import { ApplyStack } from './applyStack'
import { Payment, PaymentDetail } from '@/screens/repay'
import { BillsDetail, BillsList } from '@/screens/order'
import { HeaderRight, HeaderLeft } from '@components/header'
import { Linking } from 'react-native'
import { default as MoneyyaContext } from '@/state'
import { useNavigation } from '@react-navigation/native'
import { LetterList, LetterDetail } from '@screens/letter'
import { ValidateCode } from '@screens/apply/validateCode'
import { useTranslation } from 'react-i18next'

const Stack = createNativeStackNavigator()
// https://reactnavigation.org/docs/hiding-tabbar-in-screens
// bottom需要在进件过程中隐藏掉，故参考官方文档说明操作
export function MainStack() {
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
  const { t } = useTranslation()

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
          title: t('screenTitle.loanDetailRecord'),
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
                //@ts-ignore
                na.navigate('Order')
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
          title: t('payment'),
        })}
      />
      <Stack.Screen name="PaymentDetail" key="PaymentDetail" component={PaymentDetail} />
      <Stack.Screen
        name="Letters"
        key="Letters"
        component={LetterList}
        options={() => ({
          title: t('notice'),
        })}
      />
      <Stack.Screen name="LetterDetail" key="LetterDetail" component={LetterDetail} />
      <Stack.Screen name="ValidateCode" key="ValidateCode" component={ValidateCode} />
    </Stack.Navigator>
  )
}
