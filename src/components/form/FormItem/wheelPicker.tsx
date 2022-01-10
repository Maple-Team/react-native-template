import { WheelPicker as WheelCurvedPicker } from 'react-native-wheel-picker-android'
import type { Dict } from '@/typings/response'
import { ViewStyle, View, ActivityIndicator } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import React, { useEffect, useState } from 'react'
import { Color } from '@/styles/color'

export interface WheelPickerProps<T extends Dict> {
  dataSource: T[]
  selected: string
  onChange: (value: number) => void
}
export function WheelPicker<T extends Dict>({
  dataSource,
  selected,
  onChange,
}: WheelPickerProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  useEffect(() => {
    if (dataSource) {
      const index = dataSource.findIndex(item => item.code === selected)
      setSelectedIndex(index < 0 ? 0 : index)
    }
  }, [dataSource, selected])

  if (dataSource.length === 0) {
    return (
      <View style={wheelPickerStyles.container}>
        <ActivityIndicator size="large" color={Color.primary} />
      </View>
    )
  }

  return (
    <View style={wheelPickerStyles.container}>
      <WheelCurvedPicker
        selectedItem={selectedIndex}
        data={dataSource.map(({ name }) => name)}
        onItemSelected={(index: number) => {
          setSelectedIndex(index)
          onChange(index)
        }}
        selectedItemTextFontFamily="ArialMT"
        itemTextFontFamily="ArialMT"
      />
    </View>
  )
}

const wheelPickerStyles = StyleSheet.create<{
  container: ViewStyle
}>({
  container: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
