import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { BillsList, BillsDetail } from '@/screens/order'
import { Color } from '@/styles/color'
import { HeaderLeft, HeaderRight } from '@components/header'

const Stack = createNativeStackNavigator()

export function OrderStack() {
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
        headerRight: () => <HeaderRight onPress={() => {}} />,
      })}>
      <Stack.Group screenOptions={{ headerShown: false }}>
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
          options={({ navigation }) => ({
            title: 'step2',
            headerLeft: () => (
              <HeaderLeft
                onPress={() => {
                  navigation.goBack()
                }}
              />
            ),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}
