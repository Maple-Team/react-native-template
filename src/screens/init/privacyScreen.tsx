import { WebViewScreen, Loading } from '@/components'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { queryBrand } from '@/services/apply'
import type { Brand } from '@/typings/response'
import { StackActions, useNavigation } from '@react-navigation/native'

export default () => {
  const { t } = useTranslation()
  const na = useNavigation()
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
            na.dispatch(StackActions.replace('Permission'))
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
