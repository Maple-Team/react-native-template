import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from '@ant-design/react-native'
import styles from './style'

export const ApplyButton = ({
  onPress,
  type,
  loading,
  children,
  disabled,
}: {
  onPress: () => void
  type?: 'primary' | 'warning' | 'ghost'
  children: ReactNode
  loading?: boolean
  disabled?: boolean
}) => {
  return (
    <View style={styles.btnWrap}>
      <Button
        style={[styles.btn, type === 'ghost' ? styles.btnInvalid : {}]}
        type={type}
        loading={loading}
        disabled={disabled}
        onPress={onPress}>
        {children}
      </Button>
    </View>
  )
}
