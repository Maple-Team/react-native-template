import { useEventListener } from '@/hooks/useListener'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { SigninScreen, EntryScreen, SignupScreen } from '@/screens/account'
// import { useQuery } from 'react-query'
// import { queryBrand } from '@/services/apply'
import { Provider } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { Color } from '@/styles/color'
import { HeaderLeft } from '@components/header'

export type AccountStackParamList = {
  Entry: undefined
  SignIn: undefined
  SignUp: undefined
}
const Stack = createNativeStackNavigator<AccountStackParamList>()

function AccountStack() {
  const { t } = useTranslation()
  useEventListener()

  // const query = useQuery('brand', queryBrand)
  // console.log('brand', query.data)
  // screenOptions={{ headerShown: false }}
  return (
    <Provider>
      <Stack.Navigator
        initialRouteName="Entry"
        screenOptions={{
          headerStyle: {
            backgroundColor: Color.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'ArialMT',
          },
          headerTitleAlign: 'center',
        }}>
        <Stack.Group>
          <Stack.Screen
            key="Entry"
            name="Entry"
            component={EntryScreen}
            options={{ headerShown: false, statusBarHidden: true }}
          />
          <Stack.Screen
            key="SignIn"
            name="SignIn"
            component={SigninScreen}
            options={({ navigation }) => ({
              title: t('signin'),
              headerLeft: () => (
                <HeaderLeft
                  onPress={() => {
                    navigation.navigate('Entry')
                  }}
                />
              ),
            })}
          />
          <Stack.Screen
            key="SignUp"
            name="SignUp"
            component={SignupScreen}
            options={({ navigation }) => ({
              title: t('signup'),
              headerLeft: () => (
                <HeaderLeft
                  onPress={() => {
                    navigation.navigate('Entry')
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

export default AccountStack
