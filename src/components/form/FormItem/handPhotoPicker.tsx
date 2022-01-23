import React from 'react'
import { View, Image, Pressable, ImageBackground } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'

interface Props {
  onChange: (text: string) => void
  value?: string
  error?: string
  field: string
}

export function HandPhotoPicker({ field }: Props) {
  return (
    <View
      style={{
        paddingTop: 48.5,
      }}>
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 47.5,
          alignItems: 'center',
        }}>
        <ImageBackground
          style={{ width: 282, height: 185, alignItems: 'flex-end' }}
          source={require('@assets/images/apply/hand.webp')}
          resizeMode="cover">
          <Pressable
            onPress={() => {
              console.log('pressed')
            }}>
            <Image source={require('@assets/images/apply/camera.webp')} resizeMode="cover" />
          </Pressable>
        </ImageBackground>
      </View>
      <ErrorMessage name={field}>
        {msg => <Text styles={[formItemStyles.warn, formItemStyles.error]}>{msg}</Text>}
      </ErrorMessage>
      <View style={{ alignItems: 'center' }}>
        <Text fontSize={14}>
          Must provide above mentioned images, otherwise application will be rejected.
        </Text>
      </View>
    </View>
  )
}

import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{}>({})
