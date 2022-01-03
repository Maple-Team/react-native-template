import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Provider } from '@ant-design/react-native'
import { useEventListener } from '@/hooks/useListener'
import { Color } from '@/styles/color'
import { ImageStyle } from 'react-native'
import { Step1, Step2, Step3, Step8 } from '@screens/apply'

export type ApplyStackParamList = {
  Step1: undefined
  Step2: undefined
  Step3: undefined
  Step4: undefined
  Step5: undefined
  Step6: undefined
  Step7: undefined
  Step8: undefined
}

const Stack = createNativeStackNavigator()

export function ApplyStack() {
  useEventListener()

  return (
    <Provider>
      <Stack.Navigator
        initialRouteName="Step1"
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
                // FIXME
              }}
            />
          ),
        })}>
        <Stack.Group>
          <Stack.Screen
            key="Step1"
            name="Step1"
            component={Step1}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            key="Step2"
            name="Step2"
            component={Step2}
            options={({ navigation }) => ({
              title: 'step2',
              headerLeft: () => (
                <HeaderLeft
                  onPress={() => {
                    navigation.goBack()
                    // FIXME pop navigate 区别
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            key="Step3"
            name="Step3"
            component={Step3}
            options={({ navigation }) => ({
              title: 'step3',
              headerLeft: () => (
                <HeaderLeft
                  onPress={() => {
                    navigation.goBack()
                    // FIXME pop navigate 区别
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            key="Step8"
            name="Step8"
            component={Step8}
            options={({ navigation }) => ({
              title: 'step8',
              headerLeft: () => (
                <HeaderLeft
                  onPress={() => {
                    navigation.goBack()
                    // FIXME pop navigate 区别
                  }}
                />
              ),
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    </Provider>
  )
}

import { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { HeaderLeft, HeaderRight } from '@components/header'
import {
  NavigationContainerProps,
  NavigationHelpers,
  NavigationProp,
} from '@react-navigation/native'

export const Styles = StyleSheet.create<{
  logo: ImageStyle
  rightWrap: ViewStyle
  notice: ImageStyle
}>({
  logo: { marginLeft: 10.5 },
  rightWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notice: {
    marginRight: 23.5,
  },
})
