import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from '@ant-design/react-native'
import styles from './style'

export const ApplyButton = ({
  handleSubmit,
  type,
  loading,
  children,
  disabled,
}: {
  handleSubmit: () => void
  type?: 'primary' | 'warning' | 'ghost'
  children: ReactNode
  loading?: boolean
  disabled?: boolean
}) => {
  return (
    <View style={styles.btnWrap}>
      <Button
        style={[styles.btn]}
        type={type}
        loading={loading}
        disabled={disabled}
        // @ts-ignore
        onPress={handleSubmit}>
        {children}
      </Button>
    </View>
  )
}
