import { WebViewScreen } from '@components/webview'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { default as MoneyyaContext } from '@/state'
import emitter from '@/eventbus'

export default () => {
  const { t } = useTranslation()
  const context = useContext(MoneyyaContext)
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
            emitter.emit('UPDATE_HAS_INIT', true)
          },
        },
      ]}
      title={t('authorizaiton')}
      warnMessage={t('authorizaiton-not-reading')}
      type="uri"
      content={context.brand?.channelInfo.privacyUrl || ''}
    />
  )
}
