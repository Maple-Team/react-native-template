import React, { useEffect, useState } from 'react'
import { View, Image, Pressable } from 'react-native'

const data = [
  {
    icon: require('@assets/images/apply/female.webp'),
    key: 'female',
    value: 'female',
  },
  {
    icon: require('@assets/images/apply/male.webp'),
    key: 'male',
    value: 'male',
  },
]
export const RadioComponent = ({
  value,
  onChange,
}: {
  value?: number
  onChange: (selected: string) => void
}) => {
  const [selected, setSelected] = useState<number | undefined>(value)
  useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
      {data.map(({ icon, key, value: _value }) => {
        return (
          <Pressable
            style={{ width: '50%' }}
            key={key}
            onPress={() => {
              onChange(_value)
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={
                  selected === 0
                    ? require('@assets/images/apply/check.webp')
                    : require('@assets/images/apply/uncheck.webp')
                }
                resizeMode="cover"
              />
              <Image source={icon} resizeMode="cover" />
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}
