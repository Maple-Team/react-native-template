import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Provider } from '@ant-design/react-native'
import { useEventListener } from '@/hooks/useListener'
import { useTranslation } from 'react-i18next'
import { Color } from '@/styles/color'
import { Image, ImageStyle, View } from 'react-native'
import { Step1 } from '@screens/apply'

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
  const { t } = useTranslation()
  useEventListener()

  return (
    <Provider>
      <Stack.Navigator
        initialRouteName="Step1"
        // screenOptions={({ navigation }) => ({
        //   headerStyle: {
        //     backgroundColor: Color.primary,
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //     fontFamily: 'ArialMT',
        //   },
        //   headerTitleAlign: 'center',
        //   headerLeft: () => (
        //     <HeaderLeft
        //       onPress={() => {
        //         navigation.navigate('Entry')
        //         // FIXME pop navigate 区别
        //       }}
        //     />
        //   ),
        //   headerRight: () => (
        //     <HeaderRight
        //       onPress={() => {
        //         navigation.navigate('message') // FIXME
        //       }}
        //     />
        //   ),
        // })}
      >
        <Stack.Group>
          <Stack.Screen
            key="Step1"
            name="Step1"
            component={Step1}
            options={() => ({
              headerShown: false,
              // headerTitleAlign: 'left',
              // headerStyle: {
              //   backgroundColor: '#fff',
              // },
              // headerTitle: () => {
              //   return (
              //     <Image
              //       style={Styles.logo}
              //       source={require('@/assets/images/apply/moneyya.webp')}
              //       resizeMode="cover"
              //     />
              //   )
              // },
              // headerLeft: () => {
              //   console.log(navigation)
              //   return (
              //     <Image source={require('@/assets/images/apply/logo.webp')} resizeMode="cover" />
              //   )
              // },
              // headerRight: () => {
              //   return (
              //     <View style={Styles.rightWrap}>
              //       <Image
              //         style={Styles.notice}
              //         source={require('@/assets/images/common/notice.webp')}
              //         resizeMode="cover"
              //       />
              //       <Image
              //         source={require('@/assets/images/common/active/help.webp')}
              //         resizeMode="cover"
              //       />
              //     </View>
              //   )
              // },
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
