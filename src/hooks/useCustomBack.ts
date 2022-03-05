import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { t } from 'i18next'
import { useCallback } from 'react'
import { Alert, BackHandler } from 'react-native'

const initStackRoutes = ['Permission', 'Privacy', 'Authorization']
const accountStackRoutes = ['Entry']
const mainStackRoutes = ['Home', 'BillsList', 'UserCenter']
const canExitRoutes = [...initStackRoutes, ...accountStackRoutes, ...mainStackRoutes]

export function useCustomBack() {
  const route = useRoute()
  const navigation = useNavigation()
  useFocusEffect(
    useCallback(() => {
      console.log(
        '=================not exit routes====================',
        route.name,
        navigation.canGoBack(),
        '============'
      )
      const onBackPress = () => {
        if (canExitRoutes.includes(route.name)) {
          Alert.alert(t('notion'), t('are-you-sure-want-to-exit'), [
            {
              text: t('cancel'),
              onPress: () => null,
              style: 'cancel',
            },
            { text: t('confirm'), onPress: () => BackHandler.exitApp() },
          ])
        } else {
          if (navigation.canGoBack()) {
            navigation.goBack()
          } else {
            // @ts-ignore
            navigation.navigate('BottomTab')
          }
        }
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation, route.name])
  )
}
