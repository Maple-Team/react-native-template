import { WebViewScreen } from '@components/webview'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { default as MoneyyaContext } from '@/state'
import emitter from '@/eventbus'
import { useNavigation, useRoute } from '@react-navigation/native'

export default () => {
  const { t } = useTranslation()
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
  const params = useRoute().params as { url?: string }
  return (
    <WebViewScreen
      actions={[
        {
          text: t('cancel'),
          color: '#bbbcbd',
          backgroundColor: '#fff',
          onPress: () => {
            na.goBack()
          },
        },
        {
          text: t('ok'),
          color: '#eee',
          backgroundColor: '#8e8f90',
          onPress: () => {
            emitter.emit('AGREE_WITH_TERMS', true)
            na.goBack()
          },
        },
      ]}
      title={t('authorizaiton')}
      warnMessage={t('authorizaiton-not-reading')}
      type="uri"
      content={params.url ? params.url : context.brand?.channelInfo.privacyUrl || ''}
    />
  )
}
