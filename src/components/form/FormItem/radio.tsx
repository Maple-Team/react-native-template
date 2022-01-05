import React, { useEffect, useState } from 'react'
import { View, Image } from 'react-native'
import { Radio } from '@ant-design/react-native'

const RadioItem = Radio.RadioItem
const checked = require('@assets/images/apply/check.webp')
const unchecked = require('@assets/images/apply/uncheck.webp')
interface Props {
  value?: number
  onChange: (selected: string) => void
}
export const RadioComponent = ({ value, onChange }: Props) => {
  const [selected, setSelected] = useState<number | undefined>(value)
  useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <View>
      <RadioItem
        key={'female'}
        checked={selected === 0}
        onChange={(event: { target: { checked: boolean } }) => {
          if (event.target.checked) {
            setSelected(0)
            onChange('0')
          }
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={selected === 0 ? checked : unchecked} resizeMode="cover" />
          <Image source={require('@assets/images/apply/female.webp')} resizeMode="cover" />
        </View>
      </RadioItem>
      <RadioItem
        key={'male'}
        checked={selected === 1}
        onChange={(event: { target: { checked: boolean } }) => {
          if (event.target.checked) {
            setSelected(1)
            onChange('1')
          }
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={selected === 1 ? checked : unchecked} resizeMode="cover" />
          <Image source={require('@assets/images/apply/male.webp')} resizeMode="cover" />
        </View>
      </RadioItem>
    </View>
  )
}
