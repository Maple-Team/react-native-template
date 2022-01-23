import React from 'react'
import { View, Image, Pressable } from 'react-native'
import formItemStyles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
import { Liveness } from '@/modules'
interface Props {
  onChange: (text: string) => void
  value?: string
  error?: string
  field: string
}

export function PhotoPicker({ field }: Props) {
  return (
    <View style={style.container}>
      <Text>Make sure you are operating by yourself</Text>
      <View
        style={{
          paddingTop: 36.5,
          paddingBottom: 47.5,
        }}>
        <Pressable
          // style={{ width: 282, height: 185 }}
          onPress={() => {
            Liveness.startLiveness(
              (livenessid, base64, transitionid, isPay) => {
                console.log(livenessid, base64, transitionid, isPay)
              },
              (cancel, errorMessage, errorCode) => {
                console.log(cancel, errorMessage, errorCode)
              }
            )
          }}>
          <Image source={require('@assets/images/apply/liveness.webp')} resizeMode="cover" />
        </Pressable>
      </View>
      <ErrorMessage name={field}>
        {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
      </ErrorMessage>
      <View>
        <Text>
          Keep face clear,expose completely and without obstructions,Avoid blurring
          casedinsufficient light.
        </Text>
      </View>
    </View>
  )
}

import { ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

const style = StyleSheet.create<{
  container: ViewStyle
}>({
  container: {
    paddingTop: 37,
  },
})
