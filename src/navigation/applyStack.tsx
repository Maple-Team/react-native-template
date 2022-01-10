import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Provider } from '@ant-design/react-native'
import { useEventListener } from '@/hooks'
import { Color } from '@/styles/color'
import { ImageStyle } from 'react-native'
import { Step2, Step3, Step4, Step5, Step6, Step7, Step8 } from '@screens/apply'
import type { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { HeaderLeft, HeaderRight } from '@components/header'
import { BottomTab } from './bottomTab'

export type ApplyStackList = {
  BottomTab: undefined
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
        initialRouteName="BottomTab"
        screenOptions={({ navigation }) => ({
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
                // go to help screen
              }}
            />
          ),
          headerLeft: () => <HeaderLeft onPress={() => navigation.goBack()} />,
          gestureEnabled: true,
        })}>
        <Stack.Group>
          <Stack.Screen
            key="BottomTab"
            name="BottomTab"
            component={BottomTab}
            options={() => ({
              headerShown: false,
            })}
          />
          <Stack.Screen
            key="Step2"
            name="Step2"
            component={Step2}
            options={() => ({
              title: 'step2',
            })}
          />
          <Stack.Screen
            key="Step3"
            name="Step3"
            component={Step3}
            options={() => ({
              title: 'step3',
            })}
          />
          <Stack.Screen
            key="Step4"
            name="Step4"
            component={Step4}
            options={() => ({
              title: 'step3',
            })}
          />
          <Stack.Screen
            key="Step5"
            name="Step5"
            component={Step5}
            options={() => ({
              title: 'Step5',
            })}
          />
          <Stack.Screen
            key="Step6"
            name="Step6"
            component={Step6}
            options={() => ({
              title: 'Step6',
            })}
          />
          <Stack.Screen
            key="Step7"
            name="Step7"
            component={Step7}
            options={() => ({
              title: 'Step7',
            })}
          />
          <Stack.Screen
            key="Step8"
            name="Step8"
            component={Step8}
            options={() => ({
              title: 'step8',
            })}
          />
        </Stack.Group>
      </Stack.Navigator>
    </Provider>
  )
}

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
