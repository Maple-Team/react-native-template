import { WheelCurvedPicker } from '@/modules/WheelCurvedPicker'
import type { Dict } from '@/typings/response'
import type { ViewStyle, TextStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import React, { useEffect, useState } from 'react'

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
      setSelectedItem(index < 0 ? 0 : index)
    }
  }, [dataSource, selected])

  return (
    <WheelCurvedPicker
      containerStyle={wheelPickerStyles.container}
      selectedValue={selectedItem}
      data={dataSource}
      onValueChange={(index: number) => {
        setSelectedItem(index)
        onChange(dataSource[index])
      }}>
      {itemList.map(value => (
        <WheelCurvedPicker.Item label={value.name} value={value.code} key={value.code} />
      ))}
    </WheelCurvedPicker>
  )
}

const wheelPickerStyles = StyleSheet.create<{
  container: ViewStyle
  item: ViewStyle | TextStyle
}>({
  container: {
    width: 150,
    height: 180,
    backgroundColor: 'red',
  },
  item: {
    color: 'black',
    fontSize: 26,
  },
})
