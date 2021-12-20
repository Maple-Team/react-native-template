import React, { useMemo, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from './navigation/bottomTab'
import AccountStack from './navigation/accountStack'
// import { Provider, Button, Toast, WhiteSpace, WingBlank, portal } from '@ant-design/react-native'

// function showToast() {
//   // multiple toast
//   Toast.info('This is a toast tips 1 !!!', 4)
//   Toast.info('This is a toast tips 2 !!!', 3)
//   Toast.info('This is a toast tips 3 !!!', 1)
// }
// function successToast() {
//   Toast.success('Load success !!!', 1)
// }
// function showToastNoMask() {
//   Toast.info('Toast without mask !!!', 1, undefined, false)
// }
// function failToast() {
//   Toast.fail('Load failed !!!')
// }
// function offline() {
//   Toast.offline('Network connection failed !!!')
// }
// function loadingToast() {
//   Toast.loading('Loading...', 1, () => {
//     console.log('Load complete !!!')
//   })
// }

// TODO splash display logic

// TODO useReducer
const App = () => {
  const isLoggedIn = useMemo(() => {
    return false
  }, [])

  useEffect(() => {}, [])
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // Screens for logged in users
        <BottomTabNavigator />
      ) : (
        // Auth screens
        <AccountStack />
      )}
    </NavigationContainer>
  )
}

export default App
