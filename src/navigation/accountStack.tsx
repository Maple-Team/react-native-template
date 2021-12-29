import { useEventListener } from '@/hooks/useListener'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { SigninScreen } from '@/screens/account/signin'
import { SignupScreen } from '@/screens/account/signup'
import { EntryScreen } from '@/screens/account/entry'
import emitter from '@/eventbus'
import { useNavigation } from '@react-navigation/native'
// import { useQuery } from 'react-query'
// import { queryBrand } from '@/services/apply'
import { Provider } from '@ant-design/react-native'
export type RootStackParamList = {
  Entry: undefined
  SignIn: undefined
  SignUp: undefined
}
const Stack = createNativeStackNavigator<RootStackParamList>()

function AccountStack() {
  const navigation = useNavigation()
  useEventListener()
  useEffect(() => {
    emitter.on('LOGIN_SUCCESS', user => {
      if (user) {
        console.log(user) //TODO switch user state
      } else {
        // navigation.navigate({ name: 'home' })
      }
    })
  }, [navigation])

  // const query = useQuery('brand', queryBrand)
  // console.log('brand', query.data)
  return (
    <Provider>
      <Stack.Navigator initialRouteName="Entry">
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen key="Entry" name="Entry" component={EntryScreen} />
          <Stack.Screen key="SignIn" name="SignIn" component={SigninScreen} />
          <Stack.Screen key="SignUp" name="SignUp" component={SignupScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </Provider>
  )
}

export default AccountStack
