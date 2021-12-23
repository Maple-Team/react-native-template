import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { BackHandler } from 'react-native'

export function useCustomBack() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSelectionModeEnabled()) {
          disableSelectionMode()
          return true
        } else {
          return false
        }
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  )
}
function disableSelectionMode() {
  //TODO
  throw new Error('Function not implemented.')
}

function isSelectionModeEnabled() {
  //TODO
  return false
}
