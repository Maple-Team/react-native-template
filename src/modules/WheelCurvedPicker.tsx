import React, { ReactNode } from 'react'
import {
  RegisteredStyle,
  HostComponent,
  requireNativeComponent,
  ViewStyle,
  View,
} from 'react-native'
import { Dict } from '@/typings/response'

interface ItemProps {
  label: string
  value: string
}
interface ItemStyle {
  color: string
  fontSize: number
}
interface WheelPickerProps<T extends Dict> {
  data: T[]
  onValueChange: (index: number) => void
  selectedValue: number
  itemStyle?: ItemStyle
  lineGradientColorFrom?: string
  lineGradientColorTo?: string
  lineColor?: string
  children: ReactNode
  containerStyle: RegisteredStyle<ViewStyle>
  itemSpace?: number
}
const WheelCurvedPickerNative: HostComponent<{
  data: { label: string; value: number }[]
  onValueChange: (index: number) => void
  selectedIndex: number
  textColor: string
  textSize: number
  itemSpace: number
  lineGradientColorFrom: string
  lineGradientColorTo: string
  lineColor: string
}> = requireNativeComponent('WheelCurvedPicker')
const Item = ({}: ItemProps) => null

function WheelNativePicker<T extends Dict>(props: WheelPickerProps<T>) {
  return (
    <View style={props.containerStyle}>
      <WheelCurvedPickerNative
        {...props}
        lineColor={props.lineColor || '#000000'}
        lineGradientColorFrom={props.lineGradientColorFrom || '#008000'}
        lineGradientColorTo={props.lineGradientColorTo || '#FF5733'}
        textColor={props.itemStyle?.color || '#ffffff'}
        textSize={props.itemStyle?.fontSize || 26}
        itemSpace={props.itemSpace || 20}
        selectedIndex={props.selectedValue}
        data={props.data.map(({ name }, index) => ({ label: name, value: index }))}
      />
    </View>
  )
}
WheelNativePicker.Item = Item

export const WheelCurvedPicker = WheelNativePicker
