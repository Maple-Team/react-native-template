import { WebViewScreen, Loading } from '@/components'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import emitter from '@/eventbus'
import { queryBrand } from '@/services/apply'
import { Brand } from '@/typings/response'

export default () => {
  const { t } = useTranslation()

  const [brand, setBrand] = useState<Brand>()
  const [loading, setLoading] = useState<boolean>()
  useEffect(() => {
    setLoading(true)
    queryBrand()
      .then(res => {
        setBrand(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])
  if (loading) {
    return <Loading />
  }
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
      content={brand?.channelInfo.privacyUrl || ''}
    />
  )
}
