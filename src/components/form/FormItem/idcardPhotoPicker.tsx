import React from 'react'
import { TextInput, View, Image, Pressable, ImageBackground } from 'react-native'
import formItemStyles from './style'
import Text from '@components/Text'
import { ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { onRequestPermission } from '@/utils/permission'

interface Props {
  onChange: (text: string) => void
  value?: string
  error?: string
  field: string
  label: string
  bg: any
}

export function IdcardPhotoPicker({ onChange, value, field, label, bg }: Props) {
  const { t } = useTranslation()

  return (
    <>
      <View
        style={{
          paddingTop: 17,
          paddingBottom: 47.5,
          alignItems: 'center',
        }}>
        <TextInput
          editable={false}
          value={value}
          style={{ position: 'absolute', zIndex: -1 }}
          onPressIn={() => {}}
        />
        <ImageBackground
          style={{ width: 282, height: 185, alignItems: 'flex-end' }}
          source={bg}
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
        <Text>{label}</Text>
      </View>
    </>
  )
}

import { ImageStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create<{}>({})
