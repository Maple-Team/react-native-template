import React, { useCallback, useState } from 'react'
import { View, Image, Pressable, ImageBackground, type ImageSourcePropType } from 'react-native'
import formItemStyles from './style'
import { Text } from '@/components'
import { ErrorMessage } from 'formik'
import { onRequestPermission } from '@/utils/permission'
import type { ImageStyle, ViewStyle } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { type CameraType, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob-v2'
import { isEmulator } from 'react-native-device-info'
import emitter from '@/eventbus'
import type { BOOL, ImageType } from '@/typings/common'
import { errorCaptured } from '@/utils/util'
import { t } from 'i18next'
import upload from '@/services/upload'

interface Props {
  error?: string
  field: string
  label: string
  bg: ImageSourcePropType
  isSupplement: BOOL
  imageType: ImageType
  cameraType: CameraType
  onUploadSuccess: (id: number, cb?: () => void) => void
  reportExif: (exif: string) => void
}

export function IdcardPhotoPicker({
  field,
  label,
  bg,
  cameraType,
  onUploadSuccess,
  reportExif,
  imageType,
  isSupplement,
}: Props) {
  const [source, setSource] = useState<{ uri: string }>()
  const [progress, setProgress] = useState<number>(0)
  console.log({ progress })

  const takePicture = useCallback(async () => {
    if (await isEmulator()) {
      handleEmulator(setSource, imageType, isSupplement, onUploadSuccess)
    } else {
      const response = await launchCamera({
        quality: 1, // NOTE 不能压缩,否则没有exif值
        mediaType: 'photo',
        saveToPhotos: true,
        includeBase64: true,
        cameraType,
        includeExtra: true,
      })
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
      const { uri, width, height, type, fileName } = assets[0]
      if (!uri) {
        return
      }
      setSource({ uri })
      console.log(reportExif)
      // Exif.getExif(uri)
      //   .then(msg => {
      //     reportExif(JSON.stringify({ ...msg.exif, ImageHeight: msg.exif.ImageLength }))
      //   })
      //   .catch(msg => {
      //     console.error('exif ERROR: ' + msg)
      //   })

      const newWidth = width
      const newHeight = height
      const [err, data] = await errorCaptured(() =>
        ImageResizer.createResizedImage(uri, newWidth || 0, newHeight || 0, 'PNG', 30, 0).then(r =>
          RNFetchBlob.fs.readFile(r.path, 'base64')
        )
      )
      if (err) {
        console.error(err)
      }
      upload({
        response: {
          base64: data,
          type,
          fileName,
        },
        isSupplement,
        type: imageType,
        onUploadProgress: (sent, total) => {
          console.log(sent, total)
          setProgress(sent / total)
        },
      })
        .then(imageId => {
          onUploadSuccess(imageId, () => {
            setProgress(1)
          })
        })
        .catch(e => {
          console.error('upload error', e)
          setProgress(0)
        })
    }
  }, [cameraType, imageType, isSupplement, onUploadSuccess, reportExif])

  return (
    <>
      <View style={styles.container}>
        <ImageBackground style={styles.bg} source={bg} resizeMode="cover">
          {source && <Image source={source} resizeMode="cover" style={styles.preview} />}
          <Pressable
            style={{ zIndex: 999 }}
            onPress={() => {
              onRequestPermission({
                blockedMessage: '',
                unavailableMessage: '',
                permission: 'android.permission.CAMERA',
                onGranted: takePicture,
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

const styles = StyleSheet.create<{
  container: ViewStyle
  bg: ViewStyle
  preview: ImageStyle
}>({
  container: {
    paddingTop: 17,
    paddingBottom: 47.5,
    alignItems: 'center',
  },
  bg: {
    width: 282,
    height: 185,
    alignItems: 'flex-end',
  },
  preview: {
    width: '100%',
    height: '100%',
    zIndex: 900,
    position: 'absolute',
  },
})

/**
 * 模拟器拍照处理逻辑
 * @param setSource
 * @param imageType
 * @param isSupplement
 * @param onUploadSuccess
 * @returns
 */
const handleEmulator = async (
  setSource: {
    (value: React.SetStateAction<{ uri: string } | undefined>): void
    (arg0: { uri: string }): void
  },
  imageType: string,
  isSupplement: string,
  onUploadSuccess: any
) => {
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
    type: imageType,
    isSupplement,
    onUploadProgress: () => {},
  })
    .then(imageId => {
      onUploadSuccess(imageId)
    })
    .catch(e => {
      console.error(e)
    })
}
