// 申请中，返回未提交提示

import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

// https://reactnavigation.org/docs/preventing-going-back
export function usePreventBack() {
  const navigation = useNavigation()
  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        console.log('========================', navigation)
        // Prevent default behavior of leaving the screen
        if (navigation.canGoBack()) {
          navigation.goBack()
        }
        e.preventDefault()
        // Prompt the user before leaving the screen
      }),
    [navigation]
  )
}
