import Picker from '@gregfrench/react-native-wheel-picker'
import type { Dict } from '@typings/response'
import type { ViewStyle, TextStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import React, { useEffect, useState } from 'react'

const PickerItem = Picker.Item

export const WheelPicker = ({
  dataSource,
  selected,
  onChange,
}: {
  dataSource: Dict[]
  selected: Partial<Dict>
  onChange: (value: Dict) => void
}) => {
  const [selectedItem, setSelectedItem] = useState<number>(0)
  const [itemList] = useState(dataSource)
  useEffect(() => {
    if (dataSource) {
      const index = dataSource.findIndex(item => item.code === selected.code)
      setSelectedItem(index)
    }
  }, [dataSource, selected])
  return (
    <Picker
      style={wheelStyles.container}
      lineColor="#000000" //to set top and bottom line color (Without gradients)
      lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
      lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
      selectedValue={selectedItem}
      itemStyle={wheelStyles.item}
      onValueChange={index => {
        setSelectedItem(index)
        onChange(dataSource[index])
      }}>
      {itemList.map(value => (
        <PickerItem label={value.name} value={value.code} key={value.code} />
      ))}
    </Picker>
  )
}

const wheelStyles = StyleSheet.create<{
  container: ViewStyle
  item: ViewStyle | TextStyle
}>({
  container: {
    width: 150,
    height: 180,
  },
  item: {
    color: 'black',
    fontSize: 26,
  },
})
