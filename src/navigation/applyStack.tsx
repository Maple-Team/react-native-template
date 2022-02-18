import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { Provider } from '@ant-design/react-native'
import { useEventListener } from '@/hooks'
import { Color } from '@/styles/color'
import { ImageStyle } from 'react-native'
import { Step2, Step3, Step4, Step5, Step61, Step62, Step7, Step71, Step8 } from '@screens/apply'
import type { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { HeaderLeft, HeaderRight } from '@components/header'
import { BottomTab } from './bottomTab'
import { useNavigation, useNavigationState } from '@react-navigation/native'
import emitter from '@/eventbus'
import { queryBrand } from '@/services/apply'
import { MMKV } from '@/utils'
import { KEY_BRAND } from '@/utils/constant'
import { t } from 'i18next'

export type ApplyStackList = {
  BottomTab: undefined
  Step2: undefined
  Step3: undefined
  Step4: undefined
  Step5: undefined
  Step61: undefined
  Step62: undefined
  Step7: undefined
  Step71: undefined
  Step8: undefined
}

const Stack = createNativeStackNavigator()

export function ApplyStack() {
  useEventListener()
  console.log(useNavigationState(state => state))
  useEffect(() => {
    queryBrand().then(brand => {
      emitter.emit('UPDATE_BRAND', brand)
      MMKV.setMap(KEY_BRAND, brand)
    })
  }, [])
  const na = useNavigation()
  return (
    <Provider>
      <Stack.Navigator
        initialRouteName="BottomTab"
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
          headerLeft: () => (
            <HeaderLeft
              onPress={() => {
                if (na.canGoBack()) {
                  na.goBack()
                } else {
                  //@ts-ignore
                  na.navigate('BottomTab')
                }
              }}
            />
          ),
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
              title: t('screenTitle.WorkInfo'),
              headerLeft: () => (
                <HeaderLeft
                  onPress={() => {
                    // @ts-ignore
                    na.navigate('BottomTab')
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            key="Step3"
            name="Step3"
            component={Step3}
            options={() => ({
              title: t('screenTitle.RelativeInfo'),
            })}
          />
          <Stack.Screen
            key="Step4"
            name="Step4"
            component={Step4}
            options={() => ({
              title: t('screenTitle.IdcardImage'),
            })}
          />
          <Stack.Screen
            key="Step5"
            name="Step5"
            component={Step5}
            options={() => ({
              title: t('screenTitle.PersonInfo'),
            })}
          />
          <Stack.Screen
            key="Step61"
            name="Step61"
            component={Step61}
            options={() => ({
              title: t('screenTitle.faceRecognition'),
            })}
          />
          <Stack.Screen
            key="Step62"
            name="Step62"
            component={Step62}
            options={() => ({
              title: t('screenTitle.holdIDPhoto'),
            })}
          />
          <Stack.Screen
            key="Step7"
            name="Step7"
            component={Step7}
            options={() => ({
              title: t('screenTitle.BankInfo'),
            })}
          />
          <Stack.Screen
            key="Step71"
            name="Step71"
            component={Step71}
            options={() => ({
              title: t('screenTitle.BankInfo'),
            })}
          />
          <Stack.Screen
            key="Step8"
            name="Step8"
            component={Step8}
            options={() => ({
              title: t('screenTitle.loan'),
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
