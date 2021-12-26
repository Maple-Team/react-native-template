import { useEventListener } from '@/hooks/useListener'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import SignIn from '@/screens/account/signin'
import SignUp from '@/screens/account/signup'
import emitter from '@/eventbus'
import { useNavigation } from '@react-navigation/native'
// import { useQuery } from 'react-query'
// import { queryBrand } from '@/services/apply'
import { Provider } from '@ant-design/react-native'

const Stack = createNativeStackNavigator()

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
      <Stack.Navigator>
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Group>
      </Stack.Navigator>
    </Provider>
  )
}

export default AccountStack
