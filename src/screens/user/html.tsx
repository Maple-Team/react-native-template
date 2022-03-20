import { WebViewScreen, Loading } from '@/components'
import React, { useEffect, useState } from 'react'
import { queryBrand } from '@/services/apply'
import type { Brand } from '@/typings/response'
import { useRoute } from '@react-navigation/native'

export default () => {
  const [brand, setBrand] = useState<Brand>()
  const [loading, setLoading] = useState<boolean>()
  const route = useRoute()
  const params = route.params as { title: string; field: 'privacyUrl' | 'serviceUrl' }
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
      actions={[]}
      title={params.title}
      type="uri"
      content={brand?.channelInfo[params.field] || ''}
    />
  )
}
