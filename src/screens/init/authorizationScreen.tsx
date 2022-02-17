import { WebViewScreen } from '@components/webview'
import { StackActions, useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default () => {
  const { t } = useTranslation()
  const na = useNavigation()
  return (
    <WebViewScreen
      actions={[
        {
          text: t('cancel'),
          color: '#bbbcbd',
          backgroundColor: '#fff',
          onPress: () => {},
        },
        {
          text: t('ok'),
          color: '#eee',
          backgroundColor: '#8e8f90',
          onPress: () => {
            na.dispatch(StackActions.replace('Privacy'))
          },
        },
      ]}
      title={t('authorizaiton')}
      warnMessage={t('authorizaiton-not-reading')}
      type="html"
      content={'en'}
    />
  )
}
