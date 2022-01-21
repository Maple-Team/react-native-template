import React, { useState } from 'react'
import {
  TextInput,
  View,
  Image,
  Pressable,
  ImageBackground,
  type ImageSourcePropType,
} from 'react-native'
import formItemStyles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
// import { useTranslation } from 'react-i18next'
import { onRequestPermission } from '@/utils/permission'
// import type { ImageStyle, ViewStyle } from 'react-native'
// import StyleSheet from 'react-native-adaptive-stylesheet'
import { type CameraType, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob-v2'
import { isEmulator } from 'react-native-device-info'
import emitter from '@/eventbus'
import type { BOOL } from '@/typings/common'
import { errorCaptured } from '@/utils/util'
import { t } from 'i18next'
import upload from '@/services/upload'

interface Props {
  value?: string
  error?: string
  field: string
  label: string
  bg: ImageSourcePropType
  isSupplement?: BOOL
  imageType: any
  cameraType: CameraType
  onUploadSuccess: (id: string) => void
  reportExif: any
}

export function IdcardPhotoPicker({
  value,
  field,
  label,
  bg,
  cameraType,
}: // isSupplement,
// imageType,
// onUploadSuccess,
// reportExif,
Props) {
  // const { t } = useTranslation()
  // TODO behavior
  const [, setSource] = useState<{ uri: string }>()
  // const [progress, setProgress] = useState<number>(0)
  const _takePicture = async () => {
    const _isEmulator = await isEmulator()
    if (_isEmulator) {
      const response = await launchImageLibrary({
        quality: 0.1,
        mediaType: 'photo',
        includeBase64: true,
        includeExtra: true,
      })
      const { errorMessage, assets } = response
      if (errorMessage) {
        console.log(errorMessage)
        return
      }
      if (!assets) {
        return
      }
      const { uri, base64, type, fileName } = assets[0]
      if (!uri) {
        return
      }
      setSource({ uri })
      upload({
        response: {
          base64,
          type,
          fileName,
        },
        type: 'imageType',
        isSupplement: 'N',
        onUploadProgress: () => {},
      })
        .then(imageId => {
          console.log({ imageId })
          // onUploadSuccess(imageId)
        })
        .catch(e => {
          console.error(e)
        })
    } else {
      launchCamera(
        {
          quality: 1, // Note 不能压缩,否则没有exif值
          mediaType: 'photo',
          saveToPhotos: true,
          includeBase64: true,
          cameraType,
          includeExtra: true,
        },
        async response => {
          const { assets, errorMessage, errorCode } = response
          if (errorCode) {
            let message: string
            switch (errorCode) {
              case 'camera_unavailable':
                message = t('camera.unavailable')
                break
              case 'permission':
                message = t('camera.no-permission')
                break
              case 'others':
              default:
                message = t('camera.other-error')
                break
            }
            emitter.emit('SHOW_MESSAGE', { type: 'fail', message })
            console.error(errorMessage)
            return
          }
          if (!assets) {
            return
          }
          const { uri, width, height } = assets[0]
          if (!uri) {
            return
          }
          setSource({ uri })
          // Exif.getExif(uri)
          //   .then(msg => {
          //     reportExif(JSON.stringify({ ...msg.exif, ImageHeight: msg.exif.ImageLength }))
          //   })
          //   .catch(msg => {
          //     console.error('exif ERROR: ' + msg)
          //   })

          const newWidth = width
          const newHeight = height
          // const [err, data] =
          await errorCaptured(() =>
            ImageResizer.createResizedImage(
              uri, //imageUri
              newWidth || 0,
              newHeight || 0,
              'PNG',
              30,
              0
            ).then(_response => RNFetchBlob.fs.readFile(_response.path, 'base64'))
          )
          // if (err) {
          //   console.error(err)
          // }
          // response.data = data
          // upload({
          //   response,
          //   isSupplement,
          //   type: imageType,
          //   onUploadProgress: this.onUploadProgress.bind(this),
          // })
          //   .then(imageId => {
          //     onUploadSuccess(imageId, () => {
          //       setProgress(1)
          //     })
          //   })
          //   .catch(e => {
          //     console.log('upload error', e)
          //     setProgress(0)
          //   })
        }
      )
    }
  }
  // const onUploadProgress = async (written: number, total: number) => {
  //   setProgress(written / total)
  // }
  // TODO 拍照预览照片
  return (
    <>
      <View
        style={{
          paddingTop: 17,
          paddingBottom: 47.5,
          alignItems: 'center',
        }}>
        <TextInput editable={false} value={value} style={{ position: 'absolute', zIndex: -1 }} />
        <ImageBackground
          style={{ width: 282, height: 185, alignItems: 'flex-end' }}
          source={bg}
          resizeMode="cover">
          <Pressable
            onPress={() => {
              onRequestPermission({
                blockedMessage: '',
                unavailableMessage: '',
                permission: 'android.permission.CAMERA',
                onGranted: () => {
                  // take picture
                  _takePicture()
                },
              })
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

// const styles = StyleSheet.create<{}>({})
