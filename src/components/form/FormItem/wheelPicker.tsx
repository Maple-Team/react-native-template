import type { Dict } from '@/typings/response'
import { ViewStyle, View, ActivityIndicator } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import React, { useEffect, useState } from 'react'
import { Color } from '@/styles/color'
import Picker from '@gregfrench/react-native-wheel-picker'
const PickerItem = Picker.Item

export interface WheelPickerProps<T extends Dict> {
  dataSource: T[]
  selected: string
  onChange: (value: string) => void
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
      <Picker
        style={{ width: 150, height: 180 }}
        lineColor="#000000" //to set top and bottom line color (Without gradients)
        lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
        lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
        selectedValue={selectedIndex}
        itemStyle={{ color: 'black', fontSize: 26 }}
        onValueChange={index => {
          setSelectedIndex(index)
          onChange(dataSource[index].code)
        }}>
        {dataSource.map(({ name, code }) => (
          <PickerItem label={name} value={code} key={code} />
        ))}
      </Picker>
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
