import React from 'react'
import { ActivityIndicator } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'

export const ToastLoading = ({ animating }: { animating?: boolean }) => {
  const { t } = useTranslation()
  return <ActivityIndicator animating={animating} toast size="large" text={t('loading')} />
}
