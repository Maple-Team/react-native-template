import type { Gender } from '@/typings/user'
import React, { useEffect, useState } from 'react'
import { View, Image, Pressable, type ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

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
  value?: Gender
  onChange: (selected: Gender) => void
}) => {
  const [selected, setSelected] = useState<Gender | undefined>(value)
  useEffect(() => {
    setSelected(value)
  }, [value])

  return (
    <View
      style={[
        {
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        },
        style.container,
      ]}>
      {data.map(({ icon, key, value: _value }) => {
        return (
          <Pressable
            style={{ width: '50%', alignItems: 'center' }}
            key={key}
            onPress={() => {
              onChange(_value as Gender)
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={
                  selected === _value
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

const style = StyleSheet.create<{ container: ViewStyle }>({
  container: {
    paddingVertical: 15,
  },
})
