import { queryVersion } from '@/services/apply'
import { Modal } from '@ant-design/react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Linking } from 'react-native'
import { useTranslation } from 'react-i18next'

export const Update = () => {
  const { t } = useTranslation()
  useFocusEffect(
    useCallback(() => {
      queryVersion().then(version => {
        if (!version) {
          return
        }
        Modal.alert(
          t('newVersion'),
          version.versionDesc,
          version.isForceUpdate === 'N'
            ? [
                {
                  text: t('cancel'),
                  onPress: () => {},
                  style: 'cancel',
                },
                { text: t('confirm'), onPress: () => Linking.openURL(version.filePath) },
              ]
            : [
                {
                  text: t('confirm'),
                  onPress: () => Linking.openURL(version.filePath),
                  style: 'ok',
                },
              ]
        )
      })
      return () => {}
    }, [t])
  )

  return <></>
}
