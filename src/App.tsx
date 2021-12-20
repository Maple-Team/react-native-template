import React, { useMemo, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from './navigation/bottomTab'
import AccountStack from './navigation/accountStack'

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
