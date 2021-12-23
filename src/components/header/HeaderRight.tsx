import React, { useReducer } from 'react'
import { Text, View } from 'react-native'
import { initiateState, reducer } from '@/state'
import { useTranslation } from 'react-i18next'

export default function HeaderRight() {
  const [state] = useReducer(reducer, initiateState)
  const { t } = useTranslation()

  return !state.user ? <Text onPress={() => {}}>{t('login')}</Text> : <View />
}
